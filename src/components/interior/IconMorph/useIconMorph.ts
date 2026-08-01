import { useCallback, useMemo, useState } from 'react';

const NUMBER = /-?\d*\.?\d+/g;
/** Where a missing sub-path collapses to — the centre of the 24×24 viewBox. */
const CENTER = '12';

export type MorphShape = {
	d: readonly string[];
	rotate?: number;
};

export type IconMorphMode = 'stroke' | 'fill';

export type IconMorphPreset = 'menu-close' | 'play-pause' | 'plus-minus' | 'check-close';

export type IconMorphSlot = {
	key: number;
	d: string;
	visible: boolean;
};

export type IconMorphSemantics = 'label' | 'pressed' | 'expanded';

export const iconMorphPresets: Record<
	IconMorphPreset,
	{ mode: IconMorphMode; labels: readonly string[]; shapes: readonly MorphShape[] }
> = {
	'menu-close': {
		mode: 'stroke',
		labels: ['Menu', 'Close'],
		shapes: [
			{ rotate: 0, d: ['M 4 7 L 20 7', 'M 4 12 L 20 12', 'M 4 17 L 20 17'] },
			{ rotate: 90, d: ['M 6.5 6.5 L 17.5 17.5', 'M 12 12 L 12 12', 'M 6.5 17.5 L 17.5 6.5'] },
		],
	},
	'play-pause': {
		mode: 'fill',
		labels: ['Play', 'Pause'],
		shapes: [
			{ d: ['M 8 5 L 14 8.5 L 14 15.5 L 8 19 Z', 'M 14 8.5 L 20 12 L 20 12 L 14 15.5 Z'] },
			{ d: ['M 8 5 L 11.5 5 L 11.5 19 L 8 19 Z', 'M 15 5 L 18.5 5 L 18.5 19 L 15 19 Z'] },
		],
	},
	'plus-minus': {
		mode: 'stroke',
		labels: ['Add', 'Remove'],
		shapes: [
			{ rotate: 0, d: ['M 5 12 L 19 12', 'M 12 5 L 12 19'] },
			{ rotate: 180, d: ['M 5 12 L 19 12', 'M 5 12 L 19 12'] },
		],
	},
	'check-close': {
		mode: 'stroke',
		labels: ['Confirm', 'Cancel'],
		shapes: [
			{ d: ['M 5 12.5 L 10 17.5 L 19.5 7', 'M 12 12 L 12 12 L 12 12'] },
			{ d: ['M 6.5 6.5 L 12 12 L 17.5 17.5', 'M 17.5 6.5 L 12 12 L 6.5 17.5'] },
		],
	},
};

/** A path whose points have all collapsed onto one spot draws nothing. */
function isCollapsed(d: string): boolean {
	const nums = d.match(NUMBER);
	if (!nums || nums.length < 4) return false;
	return nums.every((n, i) => n === nums[i % 2]);
}

/**
 * Pads every shape to the same number of sub-paths.
 *
 * Morphing needs a one-to-one correspondence between source and target paths;
 * a shape with fewer strokes gets the missing ones as degenerate points at the
 * centre, so they grow out of the middle instead of popping into existence.
 */
function normalize(shapes: readonly MorphShape[]): IconMorphSlot[][] {
	const slots = shapes.reduce((most, s) => Math.max(most, s.d.length), 0);

	return shapes.map((shape) =>
		Array.from({ length: slots }, (_, i) => {
			const own = shape.d[i];
			const sibling = shapes.find((s) => s.d[i] !== undefined)?.d[i] ?? '';
			const d = own ?? sibling.replace(NUMBER, CENTER);
			return { key: i, d, visible: !isCollapsed(d) };
		}),
	);
}

/**
 * Blends two path strings by interpolating their numbers in place.
 *
 * Every shape in a morph pair is authored with the same command sequence, so
 * the strings differ only in their coordinates — which makes this exact, and
 * avoids pulling in a general-purpose path morphing plugin. Mismatched
 * structures fall back to a hard swap at the midpoint.
 */
export function interpolatePath(from: string, to: string, t: number): string {
	const fromNumbers = from.match(NUMBER);
	const toNumbers = to.match(NUMBER);

	if (!fromNumbers || !toNumbers || fromNumbers.length !== toNumbers.length) {
		return t < 0.5 ? from : to;
	}

	let i = 0;
	return to.replace(NUMBER, () => {
		const a = Number.parseFloat(fromNumbers[i]);
		const b = Number.parseFloat(toNumbers[i]);
		i += 1;
		return String(Math.round((a + (b - a) * t) * 1000) / 1000);
	});
}

function toIndex(value: number | boolean): number {
	return typeof value === 'boolean' ? (value ? 1 : 0) : Math.trunc(value);
}

export type UseIconMorphOptions = {
	preset?: IconMorphPreset;
	shapes?: readonly MorphShape[];
	mode?: IconMorphMode;
	labels?: readonly string[];
	active?: number | boolean;
	defaultActive?: number | boolean;
	onActiveChange?: (index: number) => void;
};

export function useIconMorph({
	preset = 'menu-close',
	shapes,
	mode,
	labels,
	active,
	defaultActive = 0,
	onActiveChange,
}: UseIconMorphOptions = {}) {
	const base = iconMorphPresets[preset];
	const source = shapes ?? base.shapes;
	const names = labels ?? base.labels;
	const count = source.length;

	const [internal, setInternal] = useState(() => toIndex(defaultActive));

	const raw = active === undefined ? internal : toIndex(active);
	const index = count === 0 ? 0 : Math.min(Math.max(raw, 0), count - 1);

	const frames = useMemo(() => normalize(source), [source]);

	const setIndex = useCallback(
		(next: number) => {
			if (count === 0) return;
			const wrapped = ((next % count) + count) % count;
			if (active === undefined) setInternal(wrapped);
			onActiveChange?.(wrapped);
		},
		[active, count, onActiveChange],
	);

	const toggle = useCallback(() => setIndex(index + 1), [setIndex, index]);

	return {
		index,
		count,
		slots: frames[index] ?? [],
		rotate: source[index]?.rotate ?? 0,
		mode: mode ?? base.mode,
		label: names[index] ?? '',
		labels: names,
		setIndex,
		toggle,
	};
}
