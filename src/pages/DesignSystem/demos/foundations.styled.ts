import styled from 'styled-components';

//* Shared
import { bareButton, focusRing, uiLabel, wellSurface } from '../../../components/interior/shared/styled';
import {
	control,
	surface,
	SURFACE_PADDING,
	type ControlSize,
	type ControlTone,
	type SurfaceDensity,
} from '../../../components/interior/shared/variants';

/** A bare control whose only job is to show one size/tone pairing. */
export const StyledVariantButton = styled.button<{ $size: ControlSize; $tone: ControlTone; $iconOnly?: boolean }>`
	${bareButton}
	${({ $size, $tone, $iconOnly }) => control({ size: $size, tone: $tone, iconOnly: $iconOnly })}
	${focusRing}
`;

export const StyledVariantGrid = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--8);
`;

export const StyledVariantRow = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--6);
	width: 100%;
`;

export const StyledVariantCaption = styled.span`
	${uiLabel}
	font-size: var(--font-size-caption);
	opacity: var(--opacity-text-muted);
	text-transform: uppercase;
	letter-spacing: 0.06em;
`;

/** A card at one of the three densities, labelled with the value it uses. */
export const StyledDensityCard = styled.div<{ $density: SurfaceDensity }>`
	${wellSurface}
	${({ $density }) => surface($density)}
	display: flex;
	flex-direction: column;
	flex: 1 1 140px;
	min-width: 0;

	&::before {
		content: '${({ $density }) => SURFACE_PADDING[$density]}';
		${uiLabel}
		font-size: var(--font-size-caption);
		opacity: var(--opacity-text-muted);
	}
`;

export const StyledDensityRow = styled.div`
	display: flex;
	gap: var(--8);
	width: 100%;
`;

/**
 * Sets a ported control directly beside the landing's own, because the point
 * is not that each looks fine alone — it is that the two agree on height and
 * padding when they sit on the same row.
 */
export const StyledCompareRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--12);
	width: 100%;
`;

export const StyledCompareCell = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: var(--6);
`;
