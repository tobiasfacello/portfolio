/**
 * Motion runtime — GSAP-backed replacement for the primitives `motion.dev`
 * exposes (springs, named easings, reduced-motion fallbacks).
 *
 * GSAP has no native spring, so `spring()` integrates the damped-harmonic
 * oscillator analytically and hands GSAP a plain ease function sampled from it.
 * That keeps the exact physics of the original components without pulling in a
 * second animation library or the CustomEase plugin.
 */

//? Types
export type SpringConfig = {
	stiffness: number;
	damping: number;
	mass: number;
};

export type Tween = {
	duration: number;
	ease: gsap.EaseFunction | string;
};

/** Displacement is considered settled below this fraction of the total travel. */
const REST_DELTA = 0.001;
/** Velocity (units per second, travel normalised to 1) considered at rest. */
const REST_SPEED = 0.01;
const MAX_DURATION = 10;
const SAMPLE_STEP = 1 / 240;

/**
 * Normalised displacement from the target at time `t`, starting at 1 with zero
 * velocity. Returns the remaining distance, so progress is `1 - displacement`.
 */
function displacementSolver({ stiffness, damping, mass }: SpringConfig) {
	const naturalFreq = Math.sqrt(stiffness / mass);
	const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));

	if (dampingRatio < 1) {
		const dampedFreq = naturalFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
		return (t: number) =>
			Math.exp(-dampingRatio * naturalFreq * t) *
			(Math.cos(dampedFreq * t) +
				((dampingRatio * naturalFreq) / dampedFreq) * Math.sin(dampedFreq * t));
	}

	if (dampingRatio === 1) {
		return (t: number) => Math.exp(-naturalFreq * t) * (1 + naturalFreq * t);
	}

	const decay = naturalFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
	const rootA = -naturalFreq * dampingRatio + decay;
	const rootB = -naturalFreq * dampingRatio - decay;
	const coeffA = rootB / (rootB - rootA);
	const coeffB = -rootA / (rootB - rootA);
	return (t: number) => coeffA * Math.exp(rootA * t) + coeffB * Math.exp(rootB * t);
}

/**
 * Walks the solver forward until the spring both sits within `REST_DELTA` of
 * its target and has effectively stopped moving, mirroring how motion.dev
 * derives an implicit duration from a spring's physics.
 */
function settleTime(displacement: (t: number) => number): number {
	let previous = displacement(0);

	for (let t = SAMPLE_STEP; t < MAX_DURATION; t += SAMPLE_STEP) {
		const current = displacement(t);
		const speed = Math.abs(current - previous) / SAMPLE_STEP;

		if (Math.abs(current) < REST_DELTA && speed < REST_SPEED) return t;
		previous = current;
	}

	return MAX_DURATION;
}

const springCache = new Map<string, Tween>();

/**
 * Turns a motion.dev spring config into a GSAP-ready `{ duration, ease }`.
 * Results are cached because the same handful of configs are shared across
 * every component in the set.
 */
export function spring(config: SpringConfig): Tween {
	const key = `${config.stiffness}:${config.damping}:${config.mass}`;
	const cached = springCache.get(key);
	if (cached) return cached;

	const displacement = displacementSolver(config);
	const duration = settleTime(displacement);

	// Re-normalise so the ease lands exactly on 1 — the solver only ever gets
	// asymptotically close, and GSAP needs an exact endpoint.
	const residual = displacement(duration);
	const scale = 1 / (1 - residual);

	const tween: Tween = {
		duration,
		ease: (progress: number) => {
			if (progress >= 1) return 1;
			return (1 - displacement(progress * duration)) * scale;
		},
	};

	springCache.set(key, tween);
	return tween;
}

/**
 * Shared springs, named after what they do rather than their numbers. The
 * configs are carried over 1:1 from the source components so the motion reads
 * identically; one-off springs stay local to the component that needs them.
 */
export const SPRINGS = {
	/** Thumbs, indicators and anything that slides between fixed cells. */
	cell: spring({ stiffness: 520, damping: 34, mass: 0.45 }),
	/** Content swapping in place — label changes, icon morphs. */
	crossfade: spring({ stiffness: 260, damping: 34, mass: 0.8 }),
	/** Short, decisive travel: press states, snapping into position. */
	snap: spring({ stiffness: 700, damping: 46, mass: 0.5 }),
	/** Deliberate overshoot — bursts, badges arriving. */
	pop: spring({ stiffness: 640, damping: 22, mass: 0.7 }),
	/** Long, unhurried travel across a large distance. */
	drift: spring({ stiffness: 210, damping: 34, mass: 0.9 }),
	/** Panels and sheets coming to rest. */
	settle: spring({ stiffness: 420, damping: 36, mass: 0.9 }),
	/** The slowest of the set, for ambient movement. */
	sway: spring({ stiffness: 150, damping: 27, mass: 1 }),
} as const;

/**
 * The set's house easing curve. Matches `--ease-smooth-out` in index.css, which
 * is the same curve the source components inline as `[0.23, 1, 0.32, 1]`.
 */
export const EASE_SMOOTH_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

/** Durations, in seconds, matching the `--transition-*` tokens. */
export const DURATION = {
	fast: 0.15,
	base: 0.2,
	tab: 0.25,
	normal: 0.3,
	slow: 0.35,
	panel: 0.4,
	emphasis: 0.5,
} as const;

/** A tween that completes immediately — the reduced-motion substitute. */
export const INSTANT: Tween = { duration: 0, ease: 'none' };

/**
 * Picks between a tween and its instant counterpart. Under reduced motion the
 * information still arrives, only the trip is skipped.
 */
export function motionSafe(tween: Tween, prefersReducedMotion: boolean): Tween {
	return prefersReducedMotion ? INSTANT : tween;
}
