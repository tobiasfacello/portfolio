import styled from 'styled-components';

//* Shared
import { bareButton, insetFocusRing, pressable, uiLabel } from '../shared/styled';

/** Gap between page slots, in px. Shared with the thumb's travel maths. */
export const SLOT_GAP = 4;

export const StyledPaginationNav = styled.nav`
	display: inline-block;
`;

export const StyledPaginationRow = styled.div`
	display: flex;
	align-items: center;
	gap: ${SLOT_GAP}px;
`;

export const StyledPaginationArrow = styled.button<{ $enabled: boolean }>`
	${bareButton}
	${pressable}
	display: flex;
	align-items: center;
	justify-content: center;
	width: var(--32);
	height: var(--32);
	flex-shrink: 0;
	border-radius: var(--radius-sm);
	color: var(--text);
	opacity: ${({ $enabled }) => ($enabled ? 'var(--opacity-text-muted)' : 'var(--opacity-text-disabled)')};
	cursor: ${({ $enabled }) => ($enabled ? 'pointer' : 'default')};
	transition:
		opacity var(--transition-fast) var(--ease-state),
		background-color var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: ${({ $enabled }) => ($enabled ? 'var(--opacity-full)' : 'var(--opacity-text-disabled)')};
		background-color: ${({ $enabled }) => ($enabled ? 'var(--glass-bg-bold)' : 'transparent')};
	}

	${insetFocusRing}
`;

export const StyledPaginationTrack = styled.div`
	position: relative;
`;

export const StyledPaginationThumb = styled.span<{ $width: number }>`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: ${({ $width }) => $width}px;
	border-radius: var(--radius-sm);
	background-color: var(--accent);
	pointer-events: none;
	will-change: transform;
`;

export const StyledPaginationList = styled.ol`
	position: relative;
	display: flex;
	gap: ${SLOT_GAP}px;
	list-style: none;
`;

export const StyledPaginationSlot = styled.li<{ $width: number }>`
	width: ${({ $width }) => $width}px;
`;

export const StyledPaginationGap = styled.li<{ $width: number }>`
	${uiLabel}
	display: flex;
	align-items: center;
	justify-content: center;
	width: ${({ $width }) => $width}px;
	height: var(--32);
	opacity: var(--opacity-text-muted);
`;

export const StyledPageButton = styled.button<{ $selected: boolean }>`
	${bareButton}
	${pressable}
	${uiLabel}
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: var(--32);
	border-radius: var(--radius-sm);
	overflow: hidden;
	font-variant-numeric: tabular-nums;
	color: ${({ $selected }) => ($selected ? 'var(--pill-text-hovered)' : 'var(--text)')};
	opacity: ${({ $selected }) => ($selected ? 'var(--opacity-full)' : 'var(--opacity-text-muted)')};
	transition:
		color var(--transition-fast) var(--ease-state),
		opacity var(--transition-fast) var(--ease-state),
		background-color var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
		background-color: ${({ $selected }) => ($selected ? 'transparent' : 'var(--glass-bg-bold)')};
	}

	${insetFocusRing}
`;

export const StyledPageDigits = styled.span`
	display: block;
	will-change: transform, opacity;
`;

export const StyledChevron = styled.svg<{ $flip?: boolean }>`
	transform: ${({ $flip }) => ($flip ? 'scaleX(-1)' : 'none')};
`;
