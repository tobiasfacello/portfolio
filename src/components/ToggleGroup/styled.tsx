import styled from 'styled-components';

export const StyledToggleGroup = styled.div`
	position: relative;
	width: fit-content;
	display: flex;
	align-items: center;
	gap: var(--2);
	border: 1px solid var(--text);
	border-radius: var(--radius-pill);
	padding: var(--2);
	opacity: var(--opacity-text-muted);
	transition: opacity var(--transition-normal);

	&:hover {
		opacity: var(--opacity-full);
	}
`;

export const StyledTogglePill = styled.span`
	position: absolute;
	top: var(--2);
	left: 0;
	height: calc(100% - var(--2) * 2);
	width: 0;
	background-color: var(--accent);
	border-radius: var(--radius-pill);
	transform: translateX(0);
	transition:
		transform var(--transition-tab) var(--ease-smooth-out),
		width var(--transition-tab) var(--ease-smooth-out);
	will-change: transform, width;
	z-index: 0;
	pointer-events: none;

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

export const StyledToggleButton = styled.button<{
	$active: boolean;
	$variant?: 'icon' | 'text';
}>`
	all: unset;
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--radius-pill);
	background-color: transparent;
	color: ${(props) => (props.$active ? 'var(--background)' : 'var(--text)')};
	transition: color var(--transition-tab) var(--ease-smooth-out);
	cursor: pointer;

	/* Expand touch target to 44px without changing visual size */
	&::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 44px;
		height: 44px;
	}

	${(props) => props.$variant === 'text'
		? `
			font-family: var(--font-geist-pixel-circle);
			font-size: var(--font-size-caption);
			letter-spacing: 0.5px;
			padding: var(--4);
			font-weight: ${props.$active ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)'};
		`
		: `
			padding: var(--4);

			& svg {
				width: var(--icon-xs);
				height: var(--icon-xs);
			}
		`
	}
`;
