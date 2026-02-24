import styled from 'styled-components';

export const StyledThemeSwitcher = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	border: 1px solid var(--text);
	border-radius: 30px;
	padding: 2px;
	opacity: 0.6;
	transition: opacity 300ms;

	&:hover {
		opacity: 1;
	}
`;

export const StyledThemeButton = styled.button<{ $active: boolean }>`
	all: unset;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	transition: all 200ms;
	color: ${(props) => (props.$active ? 'var(--background)' : 'var(--text)')};
	background-color: ${(props) => (props.$active ? 'var(--accent)' : 'transparent')};

	& svg {
		width: 14px;
		height: 14px;
	}
`;
