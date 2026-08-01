//! React
import { useEffect, useRef, useState } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { usePollResults, type UsePollResultsOptions } from './usePollResults';

//? Lib
import { SPRINGS, EASE_SMOOTH_OUT, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledPollRoot,
	StyledPollTitle,
	StyledPollRows,
	StyledPollRow,
	StyledPollBar,
	StyledPollRowInner,
	StyledPollLabel,
	StyledPollTick,
	StyledPollReadout,
	StyledPollTotal,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

type RowProps = {
	label: string;
	share: number;
	winner: boolean;
	mine: boolean;
	revealed: boolean;
	reducedMotion: boolean;
	onPick: () => void;
};

function PollRow({ label, share, winner, mine, revealed, reducedMotion, onPick }: RowProps) {
	const barRef = useRef<HTMLSpanElement>(null);
	const readoutRef = useRef<HTMLSpanElement>(null);
	const tickRef = useRef<HTMLSpanElement>(null);
	const [landed, setLanded] = useState(false);

	useGSAP(() => {
		if (!revealed) return;

		const bar = barRef.current;
		const readout = readoutRef.current;
		const fill = motionSafe(SPRINGS.drift, reducedMotion);

		const progress = { value: 0 };
		const tween = gsap.to(progress, {
			value: share,
			duration: fill.duration,
			ease: fill.ease,
			onUpdate: () => {
				// The number is written straight to the DOM rather than through
				// state — this runs every frame, and a re-render per frame is not
				// a price worth paying for a percentage.
				if (bar) {
					bar.style.clipPath = `inset(0 ${((1 - progress.value) * 100).toFixed(2)}% 0 0 round 5px)`;
				}
				if (readout) {
					const next = `${Math.round(progress.value * 100)}%`;
					if (readout.textContent !== next) readout.textContent = next;
				}
			},
			onComplete: () => setLanded(true),
		});

		if (readout) {
			gsap.to(readout, { opacity: 1, duration: reducedMotion ? 0 : 0.2, ease: EASE_SMOOTH_OUT });
		}

		return () => {
			tween.kill();
		};
	}, [revealed, share, reducedMotion]);

	// The winner's tick waits for the bars to finish, so it confirms a result
	// rather than predicting one mid-fill.
	useGSAP(() => {
		const node = tickRef.current;
		if (!node) return;

		const visible = revealed && winner && landed;
		const pop = motionSafe(SPRINGS.pop, reducedMotion);
		gsap.to(node, {
			opacity: visible ? 1 : 0,
			scale: visible ? 1 : 0.4,
			duration: pop.duration,
			ease: pop.ease,
		});
	}, [revealed, winner, landed, reducedMotion]);

	return (
		<StyledPollRow
			type="button"
			onClick={onPick}
			aria-disabled={revealed}
			aria-pressed={revealed ? mine : undefined}
			$revealed={revealed}
		>
			<StyledPollBar
				ref={barRef}
				aria-hidden="true"
				$mine={mine}
				style={{ clipPath: 'inset(0 100% 0 0 round 5px)' }}
			/>

			<StyledPollRowInner>
				<StyledPollLabel $winner={revealed && winner}>{label}</StyledPollLabel>

				<StyledPollTick ref={tickRef} aria-hidden="true">
					<svg viewBox="0 0 256 256" width="11" height="11" fill="none">
						<polyline
							points="216 72 104 184 48 128"
							stroke="currentColor"
							strokeWidth="26"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</StyledPollTick>

				<StyledPollReadout aria-hidden="true">
					<span data-ghost>100%</span>
					<span ref={readoutRef} style={{ opacity: 0 }}>
						0%
					</span>
				</StyledPollReadout>
			</StyledPollRowInner>
		</StyledPollRow>
	);
}

export type PollResultsProps = UsePollResultsOptions & {
	label: string;
};

function PollResults({ options, value, defaultValue, onVote, label }: PollResultsProps) {
	const poll = usePollResults({ options, value, defaultValue, onVote });
	const prefersReducedMotion = usePrefersReducedMotion();
	const totalRef = useRef<HTMLSpanElement>(null);

	useGSAP(() => {
		const node = totalRef.current;
		if (!node) return;

		gsap.to(node, {
			opacity: poll.revealed ? 1 : 0,
			duration: prefersReducedMotion ? 0 : 0.2,
			delay: prefersReducedMotion || !poll.revealed ? 0 : 0.4,
			ease: EASE_SMOOTH_OUT,
		});
	}, [poll.revealed, prefersReducedMotion]);

	const [spoken, setSpoken] = useState('');
	useEffect(() => {
		if (!poll.revealed) return;
		const winner = poll.rows.find((r) => r.winner);
		const timer = setTimeout(
			() =>
				setSpoken(
					winner
						? `Results: ${winner.label} leads with ${Math.round(winner.share * 100)} percent of ${poll.total} votes`
						: `Results shown, ${poll.total} votes`,
				),
			700,
		);
		return () => clearTimeout(timer);
	}, [poll.revealed, poll.rows, poll.total]);

	return (
		<StyledPollRoot role="group" aria-label={label}>
			<StyledPollTitle>{label}</StyledPollTitle>

			<StyledPollRows>
				{poll.rows.map((row) => (
					<PollRow
						key={row.id}
						label={row.label}
						share={row.share}
						winner={row.winner}
						mine={row.mine}
						revealed={poll.revealed}
						reducedMotion={prefersReducedMotion}
						onPick={() => poll.vote(row.id)}
					/>
				))}
			</StyledPollRows>

			<StyledPollTotal>
				<span ref={totalRef}>{poll.total.toLocaleString('en-US')} votes</span>
			</StyledPollTotal>

			<StyledVisuallyHidden role="status">{spoken}</StyledVisuallyHidden>
		</StyledPollRoot>
	);
}

export default PollResults;
