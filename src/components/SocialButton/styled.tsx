import styled from "styled-components";

export const StyledSocialButton = styled.div<{}>`
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	object-fit: contain;
	background-color: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 10px;
	cursor: pointer;
	opacity: 0.6;
	color: var(--text);
	transition: all 150ms;
	
	&:hover {
		opacity: 1;	
		background-color: var(--accent);
		border: 1px solid var(--primary);
	}
	
	&:active {
		background-color: var(--primary);
		transition: all 100ms;
	}



	& > img {
		width: 20px;
		height: auto;
		mix-blend-mode: difference;
	}
`;
