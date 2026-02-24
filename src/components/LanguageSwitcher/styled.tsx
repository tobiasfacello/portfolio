import styled from 'styled-components';

export const StyledLanguageSwitcher = styled.div`
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

export const StyledLangButton = styled.button<{ $active: boolean }>`
	all: unset;
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: var(--font-geist-pixel-circle);
	font-size: 11px;
	letter-spacing: 0.5px;
	height: 24px;
	padding: 0 8px;
	border-radius: 30px;
	transition: all 200ms;
	color: ${(props) => (props.$active ? 'var(--background)' : 'var(--text)')};
	background-color: ${(props) => (props.$active ? 'var(--accent)' : 'transparent')};
	font-weight: ${(props) => (props.$active ? '600' : '400')};
`;
