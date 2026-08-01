import styled from 'styled-components';

//* Shared
import { insetFocusRing, StyledStateStack, uiLabel } from '../shared/styled';

export const StyledSpyNav = styled.nav`
	width: 100%;
`;

export const StyledSpyRail = styled.div`
	position: relative;
	padding: var(--4);
	border-radius: var(--radius-md);
	background-color: var(--glass-bg-bold);
`;

export const StyledSpyList = styled.ol`
	display: flex;
	gap: var(--4);
	overflow-x: auto;
	list-style: none;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
`;

export const StyledSpyItem = styled.li`
	position: relative;
	flex: 1 0 auto;
`;

/** One thumb for the whole rail, moved between chips rather than redrawn. */
export const StyledSpyThumb = styled.span`
	position: absolute;
	top: var(--4);
	left: 0;
	height: var(--24);
	border-radius: var(--radius-sm);
	background-color: var(--accent);
	pointer-events: none;
	opacity: 0;
	will-change: transform, width;
`;

export const StyledSpyLink = styled.a<{ $active: boolean }>`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	height: var(--24);
	width: 100%;
	padding: 0 var(--8);
	border-radius: var(--radius-sm);
	text-decoration: none;
	color: ${({ $active }) => ($active ? 'var(--pill-text-hovered)' : 'var(--text)')};
	opacity: ${({ $active }) => ($active ? 'var(--opacity-full)' : 'var(--opacity-text-muted)')};
	transition:
		color var(--transition-fast) var(--ease-state),
		opacity var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
	}

	${insetFocusRing}
`;

/**
 * The label is drawn twice — once invisible at its active weight — so becoming
 * active never widens the chip and shifts the rail.
 */
export const StyledSpyLabel = styled(StyledStateStack)`
	${uiLabel}
	place-items: center;
	font-size: var(--font-size-caption);

	> span {
		white-space: nowrap;
	}

	> span[data-ghost] {
		visibility: hidden;
		font-weight: var(--font-weight-semibold);
	}
`;
