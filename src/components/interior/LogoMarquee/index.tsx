//! React
import type { ReactNode } from 'react';

//? Hooks
import { useLogoMarquee, type MarqueeDirection } from './useLogoMarquee';

//* Styled
import {
	StyledMarqueeRoot,
	StyledMarqueeViewport,
	StyledMarqueeTrack,
	StyledMarqueeGroup,
	StyledMarqueeItem,
	StyledMarqueeFace,
	StyledMarqueeLink,
	StyledMarqueeButton,
	StyledMarqueeFade,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type LogoMarqueeItem = {
	id: string;
	label: string;
	href?: string;
	mark?: ReactNode;
};

export type LogoMarqueeProps = {
	items: LogoMarqueeItem[];
	label?: string;
	speed?: number;
	direction?: MarqueeDirection;
	gap?: number;
	paused?: boolean;
	onSelect?: (item: LogoMarqueeItem) => void;
};

function face(item: LogoMarqueeItem) {
	if (!item.mark) return item.label;
	return (
		<>
			<span aria-hidden="true">{item.mark}</span>
			<StyledVisuallyHidden>{item.label}</StyledVisuallyHidden>
		</>
	);
}

function LogoMarquee({
	items,
	label = 'Logos',
	speed = 44,
	direction = 'left',
	gap = 40,
	paused = false,
	onSelect,
}: LogoMarqueeProps) {
	const { viewportRef, trackRef, groupRef, copies, reducedMotion, bind } = useLogoMarquee({
		speed,
		direction,
		gap,
		paused,
	});

	const groups = reducedMotion ? 1 : copies;
	/**
	 * Only one copy is real. The duplicates exist to hide the seam and are
	 * hidden from assistive tech and the tab order — otherwise the same logo
	 * would be announced a dozen times.
	 */
	const live = reducedMotion ? 0 : 1;

	return (
		<StyledMarqueeRoot aria-label={label} {...bind}>
			<StyledMarqueeViewport
				ref={viewportRef}
				tabIndex={reducedMotion ? 0 : undefined}
				style={{ overflowX: reducedMotion ? 'auto' : 'hidden' }}
			>
				<StyledMarqueeTrack ref={trackRef} $gap={gap}>
					{Array.from({ length: groups }, (_, copy) => (
						<StyledMarqueeGroup
							key={copy}
							ref={copy === live ? groupRef : undefined}
							aria-hidden={copy === live ? undefined : true}
							$gap={gap}
						>
							{items.map((item) => (
								<StyledMarqueeItem key={item.id}>
									{copy !== live ? (
										<StyledMarqueeFace>{item.mark ?? item.label}</StyledMarqueeFace>
									) : item.href ? (
										<StyledMarqueeLink href={item.href}>{face(item)}</StyledMarqueeLink>
									) : onSelect ? (
										<StyledMarqueeButton type="button" onClick={() => onSelect(item)}>
											{face(item)}
										</StyledMarqueeButton>
									) : (
										<StyledMarqueeFace>{face(item)}</StyledMarqueeFace>
									)}
								</StyledMarqueeItem>
							))}
						</StyledMarqueeGroup>
					))}
				</StyledMarqueeTrack>
			</StyledMarqueeViewport>

			<StyledMarqueeFade aria-hidden="true" $side="left" />
			<StyledMarqueeFade aria-hidden="true" $side="right" />
		</StyledMarqueeRoot>
	);
}

export default LogoMarquee;
