import { useEffect, useMemo, useState } from 'react';

/** Leading substrings of the passwords that top every breach list. */
const COMMON =
	/^(?:password|passw0rd|qwerty|letmein|welcome|admin|iloveyou|monkey|dragon|abc123|111111|123123|123456)/i;
/** Four or more of the same character in a row. */
const RUN = /(.)\1{3,}/;
/** Runs along the keyboard or the alphabet. */
const RUN_UP = /(?:0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|defg|qwer|wert|erty|asdf)/i;
const SYMBOL = /[!-/:-@[-`{-~]/;

export type PasswordRule = {
	id: string;
	label: string;
	test: (value: string) => boolean;
};

export type EvaluatedRule = PasswordRule & { met: boolean };

export type UsePasswordStrengthOptions = {
	rules?: readonly PasswordRule[];
	labels?: readonly string[];
	announceDelay?: number;
};

export const defaultPasswordRules: readonly PasswordRule[] = [
	{ id: 'length', label: '12 characters or more', test: (v) => v.length >= 12 },
	{ id: 'case', label: 'Upper and lower case', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
	{ id: 'digit', label: 'A number', test: (v) => /\d/.test(v) },
	{ id: 'symbol', label: 'A symbol', test: (v) => SYMBOL.test(v) },
];

const defaultLabels = ['Empty', 'Weak', 'Fair', 'Good', 'Strong'] as const;

/**
 * Scores a password by rules met, then overrides that score when the password
 * is guessable.
 *
 * `Password123!` satisfies every rule and is still terrible, so a recognised
 * pattern is pinned to the lowest non-empty score regardless of what it passes.
 * Counting character classes alone would call it strong.
 */
export function usePasswordStrength(
	value: string,
	{
		rules = defaultPasswordRules,
		labels = defaultLabels,
		announceDelay = 700,
	}: UsePasswordStrengthOptions = {},
) {
	const state = useMemo(() => {
		const evaluated = rules.map((rule) => ({ ...rule, met: rule.test(value) }));
		const passed = evaluated.reduce((n, r) => n + (r.met ? 1 : 0), 0);
		const guessable =
			value.length > 0 && (COMMON.test(value) || RUN.test(value) || RUN_UP.test(value));

		const score =
			value.length === 0 ? 0 : guessable ? 1 : Math.min(rules.length, Math.max(1, passed));

		const label = labels[Math.min(score, labels.length - 1)] ?? '';
		const unmet = evaluated.filter((r) => !r.met);

		const announcement =
			value.length === 0
				? ''
				: [
						`Password strength ${label.toLowerCase()}.`,
						guessable ? 'This is a commonly guessed pattern.' : '',
						unmet.length === 0
							? 'All requirements met.'
							: `Still needed: ${unmet.map((r) => r.label.toLowerCase()).join(', ')}.`,
					]
						.filter(Boolean)
						.join(' ');

		return { score, max: rules.length, label, rules: evaluated, guessable, announcement };
	}, [value, rules, labels]);

	// Announcing on every keystroke would make the field unusable with a screen
	// reader; only the assessment that survives a pause is spoken.
	const [settled, setSettled] = useState('');
	useEffect(() => {
		if (state.announcement === '') {
			setSettled('');
			return;
		}
		const id = setTimeout(() => setSettled(state.announcement), announceDelay);
		return () => clearTimeout(id);
	}, [state.announcement, announceDelay]);

	return { ...state, announcement: settled };
}
