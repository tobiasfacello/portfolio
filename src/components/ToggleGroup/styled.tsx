import styled from 'styled-components';

export const StyledToggleGroup = styled.div`
	width: fit-content;
	display: flex;
	align-items: center;
	gap: var(--2);
	border: 1px solid var(--text);
	border-radius: var(--radius-pill);
	padding: var(--2);
	opacity: var(--opacity-soft);
	transition: opacity var(--transition-normal);

	&:hover {
		opacity: var(--opacity-full);
	}
`;

export const StyledToggleButton = styled.button<{
	$active: boolean;
	$variant?: 'icon' | 'text';
}>`
	all: unset;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--radius-circle);
	transition: all var(--transition-base);
	color: ${(props) => (props.$active ? 'var(--background)' : 'var(--text)')};
	background-color: ${(props) => (props.$active ? 'var(--accent)' : 'transparent')};

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
