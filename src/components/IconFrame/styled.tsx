import styled from "styled-components";
export const StyledIconFrame = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 16px;
	margin: 0 4px;
	vertical-align: middle;
	color: var(--text);

	svg {
		width: auto;
		height: 100%;
	}

	@media (min-width: 960px) {
		height: 18px;
	}
`;
