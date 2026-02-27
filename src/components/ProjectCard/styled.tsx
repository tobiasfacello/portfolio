import styled from 'styled-components';
import { glassCard, hoveredPillStyles } from '../../styles/mixins';

export const TechPillIcon = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 10px;
	height: 10px;
	flex-shrink: 0;

	& svg {
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
`;

export const TechPill = styled.span<{ $iconOnly?: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: ${(props) => (props.$iconOnly ? '0' : 'var(--4)')};
	height: 18px;
	padding: 0 ${(props) => (props.$iconOnly ? 'var(--4)' : 'var(--6)')};
	font-family: var(--font-geist-pixel-circle);
	font-size: 9px;
	line-height: 1;
	color: var(--text);
	opacity: var(--opacity-muted);
	border: 1px solid var(--text);
	border-radius: var(--radius-pill);
	white-space: nowrap;
	transition: opacity var(--transition-normal);
`;

export const MeasureContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 0;
	overflow: hidden;
	visibility: hidden;
	pointer-events: none;
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const PillWrapper = styled.span<{ $ready?: boolean }>`
	display: inline-flex;
	align-items: center;
	overflow: hidden;
	max-width: var(--pill-max-w);
	opacity: var(--pill-opacity);
	visibility: ${(props) => (props.$ready === false ? 'hidden' : 'visible')};
	transition: ${(props) =>
		props.$ready === false
			? 'none'
			: 'max-width 250ms ease-out, opacity 180ms ease-out'};
`;

export const StyledProjectCard = styled.a<{
	$isHovered: boolean;
}>`
	text-decoration: none;
	color: inherit;
	position: relative;
	width: 100%;
	height: 120px;
	min-width: 320px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: var(--8);
	${glassCard(true)}

	@media (max-width: 768px) {
		& {
			max-width: 335px;
		}
	}

	@media (min-width: 768px) and (max-width: 1279px) {
		& {
			max-width: 380px;
		}
	}

	& > div:last-of-type img {
		max-width: 100px;
		max-height: 100px;
		width: auto;
		height: auto;
		object-fit: contain;
		opacity: ${(props) => (props.$isHovered ? 'var(--opacity-full)' : 'var(--opacity-soft)')};
		transition: all var(--transition-normal);
	}

	&:hover ${TechPill} {
		opacity: var(--opacity-soft);
	}

	${(props) => hoveredPillStyles(props.$isHovered)}
`;
