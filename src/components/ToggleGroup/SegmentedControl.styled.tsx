import styled from 'styled-components';

//* Shared
import { bareButton, insetFocusRing, uiLabel } from '../interior/shared/styled';

/**
 * Styles for the segmented control — the accessible, mask-thumbed sibling of
 * `ToggleGroup`. It shares the DS pill language (pill radius, accent thumb,
 * inverted label) but needs its own grid structure to support the mask.
 */

export const StyledSegmentedRoot = styled.div`
	position: relative;
	display: inline-block;
	padding: 3px;
	border: 1px solid var(--glass-border-bold-start);
	border-radius: var(--radius-md);
	background-color: var(--glass-bg-bold);
	user-select: none;
`;

export const StyledSegmentedGrid = styled.div<{ $columns: string }>`
	position: relative;
	display: grid;
	grid-template-columns: ${({ $columns }) => $columns};
	touch-action: manipulation;
`;

export const StyledSegmentLabel = styled.span<{ $state: 'idle' | 'hovered' | 'disabled' }>`
	${uiLabel}
	padding: var(--6) var(--12);
	text-align: center;
	white-space: nowrap;
	pointer-events: none;
	opacity: ${({ $state }) =>
		$state === 'disabled'
			? 'var(--opacity-subtle)'
			: $state === 'hovered'
				? 'var(--opacity-medium)'
				: 'var(--opacity-text-muted)'};
	transition: opacity var(--transition-fast) var(--ease-state);
`;

/** The sliding thumb. Clips the inverted copy of the labels beneath it. */
export const StyledSegmentedThumb = styled.div<{ $width: string }>`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: ${({ $width }) => $width};
	overflow: hidden;
	border-radius: var(--radius-sm);
	background-color: var(--accent);
	pointer-events: none;
	will-change: transform;
`;

/**
 * Counter-translated against the thumb so the full label row appears to stay
 * still while the window over it moves. That is what makes the text under the
 * thumb invert exactly at its edges, mid-glyph included.
 */
export const StyledSegmentedMask = styled.div`
	position: absolute;
	inset: 0;
	will-change: transform;
`;

export const StyledSegmentedMaskRow = styled.div<{ $columns: string; $width: string }>`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	display: grid;
	width: ${({ $width }) => $width};
	grid-template-columns: ${({ $columns }) => $columns};
`;

export const StyledSegmentedMaskLabel = styled.span`
	${uiLabel}
	padding: var(--6) var(--12);
	text-align: center;
	white-space: nowrap;
	color: var(--pill-text-hovered);
`;

export const StyledSegmentedHitGrid = styled.div<{ $columns: string }>`
	position: absolute;
	inset: 0;
	display: grid;
	grid-template-columns: ${({ $columns }) => $columns};
`;

export const StyledSegmentedButton = styled.button`
	${bareButton}
	border-radius: var(--radius-sm);
	cursor: default;

	${insetFocusRing}
`;
