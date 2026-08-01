import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';

/** Rough characters per token, used to convert a token rate into a char rate. */
const CHARS_PER_TOKEN = 4;
/**
 * Longest frame delta that still counts as elapsed time. A backgrounded tab
 * produces a multi-second gap; without this the text would jump most of the way
 * to the end the moment the tab is focused again.
 */
const MAX_FRAME_DELTA = 64;

export type StreamingTextStatus = 'idle' | 'streaming' | 'paused' | 'done';

export type UseStreamingTextOptions = {
	text: string;
	tokensPerSecond?: number;
	autoStart?: boolean;
	onDone?: () => void;
};

export function useStreamingText({
	text,
	tokensPerSecond = 18,
	autoStart = true,
	onDone,
}: UseStreamingTextOptions) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const total = text.length;

	const [index, setIndex] = useState(0);
	const [status, setStatus] = useState<StreamingTextStatus>(autoStart ? 'streaming' : 'idle');

	const cursor = useRef(0);
	const finished = useRef(onDone);

	useEffect(() => {
		finished.current = onDone;
	}, [onDone]);

	const start = useCallback(() => {
		setStatus((s) => (s === 'done' ? s : 'streaming'));
	}, []);

	const pause = useCallback(() => {
		setStatus((s) => (s === 'streaming' ? 'paused' : s));
	}, []);

	const skip = useCallback(() => {
		cursor.current = total;
		setIndex(total);
		setStatus('done');
	}, [total]);

	const reset = useCallback(() => {
		cursor.current = 0;
		setIndex(0);
		setStatus(autoStart ? 'streaming' : 'idle');
	}, [autoStart]);

	useEffect(() => {
		cursor.current = 0;
		setIndex(0);
		setStatus(autoStart ? 'streaming' : 'idle');
	}, [text, autoStart]);

	/**
	 * Advances on rAF with a carried remainder rather than an interval, so the
	 * rate stays true regardless of refresh rate and no characters are lost to
	 * rounding on a slow frame.
	 */
	useEffect(() => {
		if (status !== 'streaming') return;
		if (prefersReducedMotion || cursor.current >= total) {
			cursor.current = total;
			setIndex(total);
			setStatus('done');
			return;
		}

		const interval = 1000 / Math.max(1, tokensPerSecond * CHARS_PER_TOKEN);
		let frame = 0;
		let last = performance.now();
		let carry = 0;

		const tick = (now: number) => {
			carry += Math.min(now - last, MAX_FRAME_DELTA);
			last = now;

			if (carry >= interval) {
				const advance = Math.floor(carry / interval);
				carry -= advance * interval;
				const next = Math.min(total, cursor.current + advance);
				cursor.current = next;
				setIndex(next);
				if (next >= total) {
					setStatus('done');
					return;
				}
			}

			frame = requestAnimationFrame(tick);
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [status, total, tokensPerSecond, prefersReducedMotion]);

	useEffect(() => {
		if (status === 'done') finished.current?.();
	}, [status]);

	// Under reduced motion the information still arrives — all of it, at once.
	useEffect(() => {
		if (!prefersReducedMotion) return;
		cursor.current = total;
		setIndex(total);
		setStatus('done');
	}, [prefersReducedMotion, total]);

	const visible = useMemo(() => text.slice(0, index), [text, index]);

	return { index, total, status, visible, start, pause, skip, reset };
}
