//! React
import { useRef } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useBlurUpImage } from './useBlurUpImage';

//? Lib
import { EASE_SMOOTH_OUT } from '../../../lib/motion';

//* Styled
import {
	StyledBlurUpFrame,
	StyledBlurUpLayer,
	StyledBlurUpPlaceholder,
	StyledBlurUpError,
} from './styled';

/** Long enough to read as a photograph developing rather than a plain fade. */
const DEVELOP = 0.65;

export type BlurUpImageProps = {
	src?: string;
	alt: string;
	width: number;
	height: number;
	/** A tiny inline preview, typically a data URI. */
	placeholder?: string;
	color?: string;
	blur?: number;
	radius?: number;
	srcSet?: string;
	sizes?: string;
	loading?: 'lazy' | 'eager';
	fetchPriority?: 'high' | 'low' | 'auto';
	onReady?: () => void;
	onError?: () => void;
};

function BlurUpImage({
	src,
	alt,
	width,
	height,
	placeholder,
	color,
	blur = 14,
	radius = 11,
	srcSet,
	sizes,
	loading = 'lazy',
	fetchPriority,
	onReady,
	onError,
}: BlurUpImageProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const { ref, status, instant } = useBlurUpImage({ src, srcSet, onReady, onError });
	const errorRef = useRef<HTMLDivElement>(null);

	const shown = status === 'ready';
	const still = prefersReducedMotion || instant;

	useGSAP(() => {
		const node = ref.current;
		if (!node) return;

		if (still) {
			gsap.set(node, { opacity: shown ? 1 : 0, filter: 'none', scale: 1 });
			return;
		}

		// Saturation and scale resolve alongside the blur, so the image settles
		// into place instead of simply sharpening.
		gsap.to(node, {
			opacity: shown ? 1 : 0,
			filter: shown ? 'blur(0px) saturate(1)' : 'blur(18px) saturate(0.6)',
			scale: shown ? 1 : 1.06,
			duration: DEVELOP,
			ease: EASE_SMOOTH_OUT,
		});
	}, [shown, still, ref]);

	useGSAP(() => {
		const node = errorRef.current;
		if (!node) return;

		gsap.to(node, {
			opacity: 1,
			duration: still ? 0 : DEVELOP,
			ease: EASE_SMOOTH_OUT,
		});
	}, [status, still]);

	return (
		<StyledBlurUpFrame
			aria-busy={status === 'loading'}
			$width={width}
			$height={height}
			$radius={radius}
			$color={color}
		>
			{placeholder ? (
				<StyledBlurUpPlaceholder
					src={placeholder}
					alt=""
					aria-hidden="true"
					draggable={false}
					$blur={blur}
				/>
			) : null}

			<StyledBlurUpLayer
				ref={ref}
				src={src}
				srcSet={srcSet}
				sizes={sizes}
				alt={alt}
				width={width}
				height={height}
				loading={loading}
				fetchPriority={fetchPriority}
				decoding="async"
				draggable={false}
				style={{ opacity: 0 }}
			/>

			{status === 'error' ? (
				<StyledBlurUpError ref={errorRef} aria-hidden="true">
					<svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor" opacity="0.5">
						<path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z" />
					</svg>
				</StyledBlurUpError>
			) : null}
		</StyledBlurUpFrame>
	);
}

export default BlurUpImage;
