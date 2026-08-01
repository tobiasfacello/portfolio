import styled from 'styled-components';

//* Shared
import { bareButton, pressable, uiLabel } from '../shared/styled';

export const StyledLightboxOverlay = styled.div`
	position: fixed;
	inset: 0;
	z-index: var(--z-overlay);
	display: grid;
	place-items: center;
	padding: var(--48) var(--16);
`;

export const StyledLightboxBackdrop = styled.div`
	position: absolute;
	inset: 0;
	background-color: var(--lightbox-overlay);
`;

export const StyledLightboxFrame = styled.div`
	position: relative;
	z-index: var(--z-overlay-content);
	display: flex;
	align-items: center;
	justify-content: center;
	max-width: 90vw;
	max-height: 80vh;
	outline: none;
`;

export const StyledLightboxImage = styled.img`
	max-width: 90vw;
	max-height: 80vh;
	object-fit: contain;
	border-radius: var(--radius-sm);
	will-change: transform, opacity;
`;

export const StyledLightboxButton = styled.button<{ $side?: 'prev' | 'next' }>`
	${bareButton}
	${pressable}
	position: absolute;
	z-index: var(--z-overlay-content);
	display: grid;
	place-items: center;
	width: 44px;
	height: 44px;
	border-radius: var(--radius-circle);
	border: 1px solid var(--lightbox-btn-border);
	background-color: var(--lightbox-btn-bg);
	color: var(--lightbox-btn-color);
	backdrop-filter: blur(var(--blur-sm));
	transition:
		background-color var(--transition-fast) var(--ease-state),
		opacity var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	${({ $side }) =>
		$side === 'prev'
			? 'left: var(--16); top: 50%; transform: translateY(-50%);'
			: $side === 'next'
				? 'right: var(--16); top: 50%; transform: translateY(-50%);'
				: 'top: var(--16); right: var(--16);'}

	&:hover {
		background-color: var(--lightbox-btn-hover-bg);
	}

	&:disabled {
		opacity: var(--opacity-subtle);
		cursor: default;
	}

	&:focus-visible {
		outline: 2px solid var(--lightbox-btn-focus);
		outline-offset: 2px;
	}
`;

export const StyledLightboxCounter = styled.div`
	${uiLabel}
	position: absolute;
	bottom: var(--16);
	left: 50%;
	transform: translateX(-50%);
	z-index: var(--z-overlay-content);
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	color: var(--lightbox-counter-color);
`;
