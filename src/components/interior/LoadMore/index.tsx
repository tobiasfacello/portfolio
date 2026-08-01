//! React
import { useRef } from 'react';

//? Variants
import type { ControlSize, ControlTone } from '../shared/variants';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useLoadMore, type LoadMoreStatus, type UseLoadMoreOptions } from './useLoadMore';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledLoadMoreRoot,
	StyledLoadMoreSentinel,
	StyledLoadMoreButton,
	StyledLoadMoreFaces,
	StyledLoadMoreFace,
	StyledLoadMoreSpinner,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

const FACES: LoadMoreStatus[] = ['idle', 'loading', 'error', 'end'];

export type LoadMoreProps = UseLoadMoreOptions & {
	size?: ControlSize;
	tone?: ControlTone;
	idleLabel?: string;
	loadingLabel?: string;
	errorLabel?: string;
	endLabel?: string;
};

function LoadMore({
	size = 'md',
	tone = 'default',
	idleLabel = 'Load more',
	loadingLabel = 'Loading',
	errorLabel = 'Retry',
	endLabel = 'That is everything',
	...options
}: LoadMoreProps) {
	const { status, paused, sentinelRef, load } = useLoadMore(options);
	const prefersReducedMotion = usePrefersReducedMotion();

	const facesRef = useRef<Record<LoadMoreStatus, HTMLSpanElement | null>>({
		idle: null,
		loading: null,
		error: null,
		end: null,
	});
	const spinnerRef = useRef<SVGSVGElement>(null);

	useGSAP(() => {
		const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
		FACES.forEach((key) => {
			const node = facesRef.current[key];
			if (!node) return;
			gsap.to(node, {
				opacity: key === status ? 1 : 0,
				duration: fade.duration,
				ease: fade.ease,
			});
		});
	}, [status, prefersReducedMotion]);

	useGSAP(() => {
		const node = spinnerRef.current;
		if (!node) return;

		gsap.killTweensOf(node);
		if (status !== 'loading' || prefersReducedMotion) {
			gsap.set(node, { rotate: 0 });
			return;
		}
		const tween = gsap.to(node, { rotate: 360, duration: 0.7, ease: 'none', repeat: -1 });
		return () => {
			tween.kill();
		};
	}, [status, prefersReducedMotion]);

	const inert = status === 'end' || status === 'loading';

	return (
		<StyledLoadMoreRoot>
			<StyledLoadMoreSentinel ref={sentinelRef} aria-hidden="true" />

			<StyledLoadMoreButton $size={size} $tone={tone}
				type="button"
				onClick={() => !inert && load()}
				aria-disabled={inert || undefined}
				aria-busy={status === 'loading' || undefined}
				$status={status}
			>
				<StyledLoadMoreFaces aria-hidden="true">
					<StyledLoadMoreFace
						ref={(node) => {
							facesRef.current.idle = node;
						}}
					>
						<svg width="11" height="11" viewBox="0 0 11 11" fill="none">
							<path
								d="M2.6 4.2 5.5 7.1 8.4 4.2"
								stroke="currentColor"
								strokeWidth="1.6"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						{idleLabel}
					</StyledLoadMoreFace>

					<StyledLoadMoreFace
						ref={(node) => {
							facesRef.current.loading = node;
						}}
						style={{ opacity: 0 }}
					>
						<StyledLoadMoreSpinner ref={spinnerRef} width="11" height="11" viewBox="0 0 12 12" fill="none">
							<circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
							<path d="M10.5 6A4.5 4.5 0 0 0 6 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
						</StyledLoadMoreSpinner>
						{loadingLabel}
					</StyledLoadMoreFace>

					<StyledLoadMoreFace
						ref={(node) => {
							facesRef.current.error = node;
						}}
						style={{ opacity: 0 }}
					>
						<svg width="11" height="11" viewBox="0 0 11 11" fill="none">
							<path d="M5.5 2.4v3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
							<rect x="4.7" y="7.5" width="1.6" height="1.6" rx="0.4" fill="currentColor" />
						</svg>
						{errorLabel}
					</StyledLoadMoreFace>

					<StyledLoadMoreFace
						ref={(node) => {
							facesRef.current.end = node;
						}}
						style={{ opacity: 0 }}
					>
						<svg width="11" height="11" viewBox="0 0 11 11" fill="none">
							<path
								d="M2.2 5.7 4.5 8 8.8 3"
								stroke="currentColor"
								strokeWidth="1.6"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						{endLabel}
					</StyledLoadMoreFace>
				</StyledLoadMoreFaces>
			</StyledLoadMoreButton>

			<StyledVisuallyHidden role="status" aria-live="polite">
				{status === 'end'
					? endLabel
					: status === 'error'
						? 'Could not load more.'
						: paused
							? 'Paused. Press to keep loading.'
							: ''}
			</StyledVisuallyHidden>
		</StyledLoadMoreRoot>
	);
}

export default LoadMore;
