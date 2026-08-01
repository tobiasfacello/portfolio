import styled from 'styled-components';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { bareButton, focusRing, outsetFocusRing, pressable, pressableRow, StyledStateStack, uiBody, uiLabel } from '../shared/styled';

export const StyledWizardRoot = styled.div`
	width: 100%;
`;

/** All step titles stacked, so the heading row never changes height. */
export const StyledWizardTitles = styled(StyledStateStack)`
	${uiLabel}
	margin-bottom: var(--8);
	font-size: var(--font-size-body-sm);
	user-select: none;

	> span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

export const StyledWizardRail = styled.ol`
	display: flex;
	align-items: center;
	gap: var(--4);
	margin-bottom: var(--16);
	padding: 0;
	list-style: none;
`;

export const StyledWizardStep = styled.li`
	display: flex;
	align-items: center;
	gap: var(--4);
	flex: 1;

	&:last-child {
		flex: none;
	}
`;

export const StyledWizardTileButton = styled.button`
	${bareButton}
	${pressableRow}
	border-radius: var(--radius-sm);

	${outsetFocusRing}
`;

export const StyledWizardTile = styled.span<{ $done: boolean; $here: boolean }>`
	${uiLabel}
	display: grid;
	place-items: center;
	width: var(--24);
	height: var(--24);
	border-radius: var(--radius-sm);
	border: 1px solid ${({ $done }) => ($done ? 'var(--accent)' : 'var(--glass-border-bold-start)')};
	background-color: ${({ $done }) => ($done ? 'var(--accent)' : 'transparent')};
	color: ${({ $done }) => ($done ? 'var(--pill-text-hovered)' : 'var(--text)')};
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	opacity: ${({ $done, $here }) =>
		$done || $here ? 'var(--opacity-full)' : 'var(--opacity-text-muted)'};
	transition:
		background-color var(--transition-fast) var(--ease-state),
		border-color var(--transition-fast) var(--ease-state),
		color var(--transition-fast) var(--ease-state),
		opacity var(--transition-fast) var(--ease-state);
	will-change: transform;
`;

export const StyledWizardConnector = styled.span`
	position: relative;
	height: 3px;
	flex: 1;
	overflow: hidden;
	border-radius: 2px;
	background-color: var(--glass-bg-bold);
`;

export const StyledWizardConnectorFill = styled.span`
	position: absolute;
	inset: 0;
	transform-origin: left center;
	border-radius: 2px;
	background-color: var(--accent);
	will-change: transform;
`;

export const StyledWizardViewport = styled.div<{ $height: number }>`
	position: relative;
	height: ${({ $height }) => $height}px;
	overflow: hidden;
	background-color: var(--glass-bg);
	background-clip: padding-box;
	border-radius: var(--radius-md);
	outline: none;
	${glassGradientBorder({ radius: 'var(--radius-md)' })}
`;

export const StyledWizardPanel = styled.div`
	${uiBody}
	position: absolute;
	inset: 0;
	overflow-y: auto;
	overscroll-behavior: contain;
	padding: var(--12);
	scrollbar-gutter: stable;
	will-change: transform, opacity;
`;

export const StyledWizardComplete = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: var(--6);
	height: 100%;
`;

export const StyledWizardActions = styled.div`
	display: flex;
	align-items: center;
	gap: var(--12);
	height: var(--36);
	margin-top: var(--12);
`;

export const StyledWizardBack = styled.button`
	${bareButton}
	${pressable}
	${uiLabel}
	${focusRing}
	height: var(--36);
	padding: 0 var(--12);
	border: 1px solid var(--text);
	border-radius: var(--radius-md);
	opacity: var(--opacity-text-muted);
	transition: opacity var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
	}
`;

export const StyledWizardAdvance = styled.button`
	${bareButton}
	${pressable}
	${uiLabel}
	${focusRing}
	display: grid;
	place-items: center;
	height: var(--36);
	margin-left: auto;
	padding: 0 var(--12);
	border-radius: var(--radius-md);
	background-color: var(--accent);
	color: var(--pill-text-hovered);

	/* Reserves the wider of the two labels, so finishing never resizes it. */
	> span {
		grid-area: 1 / 1;
		white-space: nowrap;
	}

	> span[data-ghost] {
		visibility: hidden;
	}
`;
