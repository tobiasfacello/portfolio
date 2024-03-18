import styled from "styled-components";
import { StyleSheetManager } from "styled-components";

const StyledContainer = styled.div<{
	w: string;
	m: string[];
	p: string[];
	direction: string;
	wrap: string;
	justify: string;
	align: string;
}>`
	width: ${(props) => (props.w == null ? "100%" : props.w)};
	height: 100%;
	display: flex;
	margin: ${(props) =>
		props.m &&
		props.m.map((marginSize) => `var(--${marginSize})`).join(" ")};
	padding: ${(props) =>
		props.p &&
		props.p.map((paddingSize) => `var(--${paddingSize})`).join(" ")};
	flex-direction: ${(props) => props.direction != null && props.direction};
	flex-wrap: ${(props) => props.wrap != null && props.wrap};
	justify-content: ${(props) => props.justify != null && props.justify};
	align-items: ${(props) => props.align != null && props.align};
`;

function Container(props: any) {
	const filteredProps: string[] = [
		"m",
		"p",
		"direction",
		"wrap",
		"justify",
		"align",
	];
	return (
		<StyleSheetManager
			shouldForwardProp={(prop) => !filteredProps.includes(prop)}
		>
			<StyledContainer
				w={props.w}
				m={props.m}
				p={props.p}
				direction={props.direction}
				wrap={props.wrap}
				justify={props.justify}
				align={props.align}
			>
				{props.children}
			</StyledContainer>
		</StyleSheetManager>
	);
}

export default Container;
