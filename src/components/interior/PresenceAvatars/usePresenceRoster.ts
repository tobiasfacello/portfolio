import { useEffect, useMemo, useRef, useState } from 'react';

export type PresencePerson = {
	id: string;
	name: string;
	src?: string;
};

export type UsePresenceRosterOptions = {
	people: PresencePerson[];
	max?: number;
	/** Debounce before the roster is announced, in ms. */
	announceAfter?: number;
};

export function initials(name: string): string {
	const words = name.trim().split(/\s+/).filter(Boolean);
	if (words.length === 0) return '?';
	// Array.from, not [0], so a name starting with an emoji or a surrogate pair
	// does not get cut in half.
	const first = Array.from(words[0])[0] ?? '';
	const last = words.length > 1 ? (Array.from(words[words.length - 1])[0] ?? '') : '';
	return (first + last).toUpperCase();
}

function describe(names: string[]): string {
	if (names.length === 0) return 'Nobody here';
	if (names.length === 1) return `${names[0]} is here`;
	if (names.length === 2) return `${names[0]} and ${names[1]} are here`;
	const rest = names.length - 2;
	return `${names[0]}, ${names[1]} and ${rest} ${rest === 1 ? 'other' : 'others'} are here`;
}

/**
 * Orders a set of people by when they first appeared and splits it into the
 * visible avatars and the overflow.
 *
 * Arrival order is remembered rather than re-derived from the incoming array,
 * so a roster that re-sorts server-side does not reshuffle the avatars on
 * screen: someone already there keeps their position.
 */
export function usePresenceRoster({
	people,
	max = 5,
	announceAfter = 900,
}: UsePresenceRosterOptions) {
	const seen = useRef(new Map<string, number>());
	const next = useRef(0);

	const ordered = useMemo(() => {
		const order = seen.current;
		for (const person of people) {
			if (!order.has(person.id)) {
				order.set(person.id, next.current);
				next.current += 1;
			}
		}
		return people.slice().sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
	}, [people]);

	const slots = Math.max(1, max);
	const visible = ordered.slice(0, slots);
	const hidden = ordered.slice(slots);
	const summary = describe(ordered.map((person) => person.name));

	// People joining and leaving in quick succession would otherwise queue up a
	// backlog of announcements; only the settled roster is read out.
	const [announcement, setAnnouncement] = useState(summary);
	useEffect(() => {
		const timer = setTimeout(() => setAnnouncement(summary), announceAfter);
		return () => clearTimeout(timer);
	}, [summary, announceAfter]);

	return {
		ordered,
		visible,
		hidden,
		overflow: hidden.length,
		total: ordered.length,
		summary,
		announcement,
	};
}
