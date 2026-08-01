//! React
import { useRef } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useStreamingText } from './useStreamingText';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledStreamRoot,
	StyledStreamBlock,
	StyledStreamGhost,
	StyledStreamVisible,
	StyledCaretSlot,
	StyledCaret,
	StyledStreamActions,
	StyledStreamButton,
	StyledStreamButtonLabels,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type StreamingTextProps = {
	text: string;
	tokensPerSecond?: number;
	autoStart?: boolean;
	showSkip?: boolean;
	label?: string;
	onDone?: () => void;
};

function StreamingText({
	text,
	tokensPerSecond = 18,
	autoStart = true,
	showSkip = true,
	label = 'Streamed response',
	onDone,
}: StreamingTextProps) {
	const { visible, status, skip, start, reset } = useStreamingText({
		text,
		tokensPerSecond,
		autoStart,
		onDone,
	});
	const prefersReducedMotion = usePrefersReducedMotion();

	const caretRef = useRef<HTMLSpanElement>(null);
	const skipRef = useRef<HTMLSpanElement>(null);
	const replayRef = useRef<HTMLSpanElement>(null);

	const done = status === 'done';
	// The caret only blinks while waiting. A caret that blinks *while* typing
	// competes with the text for attention.
	const blink = !prefersReducedMotion && (status === 'idle' || status === 'paused');

	useGSAP(() => {
		const caret = caretRef.current;
		if (!caret) return;

		gsap.killTweensOf(caret);

		if (blink) {
			const timeline = gsap.timeline({ repeat: -1 });
			timeline.set(caret, { opacity: 1 });
			timeline.to(caret, { opacity: 0, duration: 0.01, ease: 'none' }, 0.48);
			timeline.to(caret, { opacity: 1, duration: 0.01, ease: 'none' }, 1.01);
			return () => {
				timeline.kill();
			};
		}

		const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
		gsap.to(caret, { opacity: done ? 0 : 1, duration: fade.duration, ease: fade.ease });
	}, [blink, done, prefersReducedMotion]);

	useGSAP(() => {
		const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
		if (skipRef.current) {
			gsap.to(skipRef.current, { opacity: done ? 0 : 1, duration: fade.duration, ease: fade.ease });
		}
		if (replayRef.current) {
			gsap.to(replayRef.current, {
				opacity: done ? 1 : 0,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
	}, [done, prefersReducedMotion]);

	return (
		<StyledStreamRoot role="group" aria-label={label} aria-busy={status === 'streaming'}>
			<StyledStreamBlock aria-hidden="true">
				<StyledStreamGhost>{text}</StyledStreamGhost>
				<StyledStreamVisible>
					{visible}
					<StyledCaretSlot>
						<StyledCaret ref={caretRef} />
					</StyledCaretSlot>
				</StyledStreamVisible>
			</StyledStreamBlock>

			{/* Announced only once complete — a live region fed character by
			    character would be unusable with a screen reader. */}
			<StyledVisuallyHidden role="status" aria-live="polite">
				{done ? text : ''}
			</StyledVisuallyHidden>

			{showSkip ? (
				<StyledStreamActions>
					<StyledStreamButton
						type="button"
						onClick={
							done
								? () => {
										reset();
										start();
									}
								: skip
						}
						aria-label={done ? `Replay ${label}` : 'Skip to the end'}
					>
						<StyledStreamButtonLabels>
							<span ref={skipRef} aria-hidden="true">
								Skip
							</span>
							<span ref={replayRef} aria-hidden="true" style={{ opacity: 0 }}>
								Replay
							</span>
						</StyledStreamButtonLabels>
					</StyledStreamButton>
				</StyledStreamActions>
			) : null}
		</StyledStreamRoot>
	);
}

export default StreamingText;
