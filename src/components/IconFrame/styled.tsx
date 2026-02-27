import styled from "styled-components";

export const StyledIconFrame = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: var(--icon-sm);
	margin: 0 var(--4);
	vertical-align: middle;
	color: var(--text);

	svg {
		width: auto;
		height: 100%;
	}

	@media (min-width: 960px) {
		height: calc(var(--icon-sm) + 0.125rem);
	}
`;
