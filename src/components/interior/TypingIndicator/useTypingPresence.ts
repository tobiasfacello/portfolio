import { useCallback, useEffect, useRef, useState } from 'react';

/** How long the bubble takes to fly away on send, in ms. */
export const SEND_MS = 340;

export type UseTypingPresenceOptions = {
	/** A typist is dropped this long after their last keystroke, in ms. */
	timeout?: number;
	/** Once shown, the bubble stays at least this long, in ms. */
	minVisible?: number;
};

export type TypingPresence = {
	typists: string[];
	beat: number;
	sending: boolean;
	ping: (name: string) => void;
	send: (name: string) => void;
	clear: (name: string) => void;
	reset: () => void;
};

/**
 * Tracks who is currently typing.
 *
 * Two things keep this from flickering: a typist survives `timeout` past their
 * last keystroke, and the bubble as a whole survives `minVisible` once shown.
 * Someone who types a single character and stops still produces a bubble that
 * is visible long enough to be read, rather than a one-frame flash.
 */
export function useTypingPresence({
	timeout = 3000,
	minVisible = 900,
}: UseTypingPresenceOptions = {}): TypingPresence {
	const [presence, setPresence] = useState<{ typists: string[]; beat: number }>({
		typists: [],
		beat: 0,
	});
	const [sending, setSending] = useState(false);

	const seen = useRef(new Map<string, number>());
	const shown = useRef<string[]>([]);
	const shownAt = useRef(0);
	const sweep = useRef<ReturnType<typeof setTimeout> | null>(null);
	const release = useRef<ReturnType<typeof setTimeout> | null>(null);
	const settle = useRef<(bump: boolean) => void>(() => {});

	const commit = useCallback(
		(bump: boolean) => {
			const now = Date.now();

			for (const [name, at] of seen.current) {
				if (at + timeout <= now) seen.current.delete(name);
			}

			let next = Infinity;
			for (const at of seen.current.values()) next = Math.min(next, at + timeout);

			let roster = Array.from(seen.current.keys());
			if (roster.length === 0 && shown.current.length > 0) {
				const until = shownAt.current + minVisible;
				if (until > now) {
					roster = shown.current;
					next = Math.min(next, until);
				}
			}

			const changed =
				roster.length !== shown.current.length ||
				roster.some((name, i) => name !== shown.current[i]);

			if (changed) {
				if (shown.current.length === 0) shownAt.current = now;
				shown.current = roster;
			}

			if (changed || bump) {
				setPresence((prev) => ({
					typists: changed ? roster : prev.typists,
					beat: changed && roster.length === 0 ? 0 : bump ? prev.beat + 1 : prev.beat,
				}));
			}

			// Re-arm for whichever deadline comes first rather than polling.
			if (sweep.current) clearTimeout(sweep.current);
			sweep.current =
				next === Infinity ? null : setTimeout(() => settle.current(false), Math.max(24, next - now));
		},
		[timeout, minVisible],
	);

	settle.current = commit;

	const ping = useCallback(
		(name: string) => {
			if (release.current) {
				clearTimeout(release.current);
				release.current = null;
				setSending(false);
				shown.current = [];
				shownAt.current = 0;
			}
			seen.current.set(name, Date.now());
			commit(true);
		},
		[commit],
	);

	const clear = useCallback(
		(name: string) => {
			if (!seen.current.delete(name)) return;
			commit(false);
		},
		[commit],
	);

	const send = useCallback((name: string) => {
		if (!seen.current.has(name) && !shown.current.includes(name)) return;
		seen.current.delete(name);
		if (sweep.current) clearTimeout(sweep.current);
		sweep.current = null;
		setSending(true);

		if (release.current) clearTimeout(release.current);
		release.current = setTimeout(() => {
			release.current = null;
			setSending(false);
			shown.current = [];
			shownAt.current = 0;
			setPresence({ typists: [], beat: 0 });

			// Someone else may have started typing during the send animation.
			if (seen.current.size > 0) settle.current(false);
		}, SEND_MS);
	}, []);

	const reset = useCallback(() => {
		if (sweep.current) clearTimeout(sweep.current);
		if (release.current) clearTimeout(release.current);
		sweep.current = null;
		release.current = null;
		seen.current.clear();
		shown.current = [];
		shownAt.current = 0;
		setSending(false);
		setPresence({ typists: [], beat: 0 });
	}, []);

	useEffect(
		() => () => {
			if (sweep.current) clearTimeout(sweep.current);
			if (release.current) clearTimeout(release.current);
			sweep.current = null;
			release.current = null;
		},
		[],
	);

	return {
		typists: presence.typists,
		beat: presence.beat,
		sending,
		ping,
		send,
		clear,
		reset,
	};
}

/** Renders a roster as the sentence a person would say. */
export function describeTypists(names: string[], max: number): string {
	if (names.length === 0) return '';

	const head = names.slice(0, Math.max(1, max));
	const rest = names.length - head.length;

	if (rest > 0) {
		return `${head.join(', ')} and ${rest} ${rest === 1 ? 'other' : 'others'} are typing`;
	}
	if (head.length === 1) return `${head[0]} is typing`;

	return `${head.slice(0, -1).join(', ')} and ${head[head.length - 1]} are typing`;
}
