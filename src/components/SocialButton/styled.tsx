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
	border-radius: 100px;
	opacity: 60%;
	color: var(--text);
	transition: all 0.3s;

	&:hover {
		opacity: 80%;
		cursor: pointer;
	}

	&:active {
		opacity: 100%;
	}

	& > img {
		width: 20px;
		height: auto;
	}
`;
