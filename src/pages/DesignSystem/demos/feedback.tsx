//! React
import { useEffect, useState } from 'react';

//* Components
import CopyButton from '../../../components/interior/CopyButton';
import ProgressBar from '../../../components/interior/ProgressBar';
import PressDepth from '../../../components/interior/PressDepth';
import Ripple from '../../../components/interior/Ripple';
import ValueFlash from '../../../components/interior/ValueFlash';
import SkeletonSwap from '../../../components/Skeleton/SkeletonSwap';
import LoadingButton from '../../../components/interior/LoadingButton';
import LikeBurst from '../../../components/interior/LikeBurst';
import LongPressButton from '../../../components/interior/LongPress';
import HoldToConfirm from '../../../components/interior/HoldToConfirm';
import LiveActivity from '../../../components/interior/LiveActivity';
import { useLiveActivity } from '../../../components/interior/LiveActivity/useLiveActivity';

//* Styled
import { StyledDemoRow, StyledDemoStack, StyledDemoButton } from '../styled';

export function CopyButtonDemo() {
	return (
		<StyledDemoRow>
			<CopyButton value="npm i gsap styled-components" />
			<CopyButton value="git checkout -b feat/design-system" label="Copy branch" />
		</StyledDemoRow>
	);
}

export function ProgressBarDemo() {
	const [value, setValue] = useState<number | null>(38);

	return (
		<StyledDemoStack>
			<ProgressBar value={value} label="Uploading assets" />
			<StyledDemoRow>
				<StyledDemoButton onClick={() => setValue((v) => Math.min(100, (v ?? 0) + 20))}>
					Advance
				</StyledDemoButton>
				<StyledDemoButton onClick={() => setValue(null)}>Indeterminate</StyledDemoButton>
				<StyledDemoButton onClick={() => setValue(0)}>Reset</StyledDemoButton>
			</StyledDemoRow>
		</StyledDemoStack>
	);
}

export function PressDepthDemo() {
	return (
		<StyledDemoRow>
			<PressDepth>Press me</PressDepth>
			<PressDepth depth={6} tilt={10}>
				Deeper travel
			</PressDepth>
			<PressDepth disabled>Disabled</PressDepth>
		</StyledDemoRow>
	);
}

export function RippleDemo() {
	return (
		<StyledDemoRow>
			<Ripple>Tap anywhere</Ripple>
			<Ripple max={1}>Single ripple</Ripple>
		</StyledDemoRow>
	);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function LoadingButtonDemo() {
	return (
		<StyledDemoRow>
			<LoadingButton onAction={() => wait(1200)} successLabel="Saved">
				Save changes
			</LoadingButton>
			<LoadingButton
				onAction={async () => {
					await wait(900);
					throw new Error('demo');
				}}
				errorLabel="Failed"
			>
				Deploy
			</LoadingButton>
		</StyledDemoRow>
	);
}

export function HoldToConfirmDemo() {
	const [count, setCount] = useState(0);

	return (
		<StyledDemoStack $w="auto">
			<StyledDemoRow>
				<HoldToConfirm onConfirm={() => setCount((c) => c + 1)} confirmLabel="Deleted">
					Hold to delete everything
				</HoldToConfirm>
			</StyledDemoRow>
			<StyledDemoRow>Let go halfway — the meter drains instead of snapping back. ({count})</StyledDemoRow>
		</StyledDemoStack>
	);
}

export function LongPressDemo() {
	const [confirmed, setConfirmed] = useState(0);

	return (
		<StyledDemoStack $w="auto">
			<StyledDemoRow>
				<LongPressButton onLongPress={() => setConfirmed((c) => c + 1)}>
					Hold to delete
				</LongPressButton>
				<LongPressButton duration={1100} onLongPress={() => setConfirmed((c) => c + 1)}>
					Hold longer
				</LongPressButton>
			</StyledDemoRow>
			<StyledDemoRow>Confirmed {confirmed} times</StyledDemoRow>
		</StyledDemoStack>
	);
}

export function LikeBurstDemo() {
	return (
		<StyledDemoRow>
			<LikeBurst initialCount={998} onCommit={() => wait(700)} />
			<LikeBurst initialCount={12} initialLiked onCommit={() => wait(700)} />
		</StyledDemoRow>
	);
}

export function SkeletonSwapDemo() {
	const [ready, setReady] = useState(true);

	return (
		<StyledDemoStack>
			<SkeletonSwap ready={ready} lines={3} label="Release notes">
				Content that arrives inside the delay never shows a skeleton at all, and one that
				does show stays long enough to be read. Either way the box is the same height.
			</SkeletonSwap>
			<StyledDemoRow>
				<StyledDemoButton onClick={() => setReady((r) => !r)}>
					{ready ? 'Start loading' : 'Finish loading'}
				</StyledDemoButton>
			</StyledDemoRow>
		</StyledDemoStack>
	);
}

export function ValueFlashDemo() {
	const [price, setPrice] = useState(1284.5);

	// A live-looking figure so the up/down colouring has something to report.
	useEffect(() => {
		const id = setInterval(() => {
			setPrice((current) => {
				const drift = (Math.random() - 0.48) * 12;
				return Math.round((current + drift) * 100) / 100;
			});
		}, 1800);
		return () => clearInterval(id);
	}, []);

	return (
		<StyledDemoRow>
			<ValueFlash
				value={price}
				label="Price"
				format={(v) => `$${v.toFixed(2)}`}
			/>
			<StyledDemoButton onClick={() => setPrice((v) => Math.round((v + 25) * 100) / 100)}>
				Bump up
			</StyledDemoButton>
			<StyledDemoButton onClick={() => setPrice((v) => Math.round((v - 25) * 100) / 100)}>
				Bump down
			</StyledDemoButton>
		</StyledDemoRow>
	);
}

export function LiveActivityDemo() {
	const { activity, start, update, succeed, fail } = useLiveActivity();

	const run = (outcome: 'success' | 'error') => {
		start({ title: 'Deploying to production', detail: 'Uploading build', progress: 0.1 });
		setTimeout(() => update({ progress: 0.55, detail: 'Running checks' }), 700);
		setTimeout(() => {
			if (outcome === 'success') succeed({ detail: 'Live in 3 regions' });
			else fail({ detail: 'Health check failed' });
		}, 1600);
	};

	return (
		<StyledDemoStack $w="100%">
			<LiveActivity activity={activity} />
			<StyledDemoRow>
				<StyledDemoButton onClick={() => run('success')}>Run and succeed</StyledDemoButton>
				<StyledDemoButton onClick={() => run('error')}>Run and fail</StyledDemoButton>
			</StyledDemoRow>
		</StyledDemoStack>
	);
}
