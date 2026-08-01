//! React
import { Children, useId, type ReactNode } from 'react';

//? Hooks
import { useSnapCarousel, type UseSnapCarouselOptions } from './useSnapCarousel';

//* Styled
import {
	StyledCarouselRoot,
	StyledCarouselViewport,
	StyledCarouselTrack,
	StyledCarouselSlide,
	StyledCarouselDots,
	StyledCarouselDot,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type SnapCarouselProps = Omit<UseSnapCarouselOptions, 'count'> & {
	children: ReactNode;
	label: string;
	showDots?: boolean;
};

function SnapCarousel({ children, label, showDots = true, gap = 12, ...options }: SnapCarouselProps) {
	const slides = Children.toArray(children);
	const baseId = useId();

	const { index, total, dragging, goTo, viewportProps, trackRef } = useSnapCarousel({
		...options,
		gap,
		count: slides.length,
	});

	return (
		<StyledCarouselRoot>
			<StyledCarouselViewport
				{...viewportProps}
				role="group"
				aria-roledescription="carousel"
				aria-label={label}
				$dragging={dragging}
			>
				<StyledCarouselTrack ref={trackRef} $gap={gap}>
					{slides.map((slide, i) => (
						<StyledCarouselSlide
							key={i}
							id={`${baseId}-slide-${i}`}
							role="group"
							aria-roledescription="slide"
							aria-label={`${i + 1} of ${total}`}
							// Off-screen slides leave the tab order, so tabbing does not
							// wander into content nobody can see.
							inert={i !== index}
						>
							{slide}
						</StyledCarouselSlide>
					))}
				</StyledCarouselTrack>
			</StyledCarouselViewport>

			{showDots && total > 1 ? (
				<StyledCarouselDots role="tablist" aria-label={`${label} slides`}>
					{slides.map((_, i) => (
						<StyledCarouselDot
							key={i}
							type="button"
							role="tab"
							aria-selected={i === index}
							aria-controls={`${baseId}-slide-${i}`}
							aria-label={`Go to slide ${i + 1}`}
							onClick={() => goTo(i)}
							$active={i === index}
						/>
					))}
				</StyledCarouselDots>
			) : null}

			<StyledVisuallyHidden role="status" aria-live="polite">
				{`Slide ${index + 1} of ${total}`}
			</StyledVisuallyHidden>
		</StyledCarouselRoot>
	);
}

export default SnapCarousel;
