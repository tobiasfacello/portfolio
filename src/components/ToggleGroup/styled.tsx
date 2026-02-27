import styled from 'styled-components';

export const StyledToggleGroup = styled.div`
	display: flex;
	align-items: center;
	gap: var(--4);
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
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--radius-circle);
	transition: all var(--transition-base);
	color: ${(props) => (props.$active ? 'var(--background)' : 'var(--text)')};
	background-color: ${(props) => (props.$active ? 'var(--accent)' : 'transparent')};

	${(props) => props.$variant === 'text'
		? `
			font-family: var(--font-geist-pixel-circle);
			font-size: var(--font-size-caption);
			letter-spacing: 0.5px;
			width: var(--control-xs);
			height: var(--control-xs);
			font-weight: ${props.$active ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)'};
		`
		: `
			width: var(--control-xs);
			height: var(--control-xs);

			& svg {
				width: var(--icon-xs);
				height: var(--icon-xs);
			}
		`
	}

`;
