import styled from "styled-components";

export const StyledSplashOverlay = styled.div`
	position: fixed;
	inset: 0;
	z-index: var(--z-overlay);
	background: var(--background);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;
