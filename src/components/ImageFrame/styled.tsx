import styled from "styled-components";
export const StyledImageFrame = styled.div<{
	m: string[];
	p: string[];
}>`
	//* Margin
	margin: ${(props) =>
		props.m &&
		props.m.map((marginSize) => `var(--${marginSize})`).join(" ")};

	//* Padding
	padding: ${(props) =>
		props.p &&
		props.p.map((paddingSize) => `var(--${paddingSize})`).join(" ")};

	@media (min-width: 375px) {
		& {
			width: 175px;
			height: 175px;
			border-width: 1.5px;
			border-radius: 100px;
		}

		@media (min-width: 1280px) {
			& {
				width: 275px;
				height: 275px;
				border-width: 3px;
				border-radius: 500px;
			}
		}

		@media (min-width: 1440px) {
			& {
				width: 345px;
				height: 345px;
				border-width: 3px;
				border-radius: 500px;
			}
		}
	}

	& > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		border-radius: 500px;
	}
`;
