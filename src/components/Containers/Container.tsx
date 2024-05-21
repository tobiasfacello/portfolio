import styled from "styled-components";
import { StyleSheetManager } from "styled-components";

const StyledContainer = styled.div<{
	style: string;
	w: string;
	h: string;
	m: string[];
	p: string[];
	direction: string;
	justify: string;
	align: string;
	gap: string;
	wrap: string;
}>`
	${(props) => props.style}
	width: ${(props) => (props.w == null ? "100%" : props.w)};
	height: ${(props) => (props.h == null ? "100%" : props.h)};
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
	gap: ${(props) => props.gap != null && props.gap};
`;

function Container(props: any) {
	const filteredProps: string[] = [
		"style",
		"w",
		"h",
		"m",
		"p",
		"direction",
		"justify",
		"align",
		"gap",
		"wrap",
	];
	return (
		<StyleSheetManager
			shouldForwardProp={(prop) => !filteredProps.includes(prop)}
		>
			<StyledContainer
				style={props.style}
				w={props.w}
				h={props.h}
				m={props.m}
				p={props.p}
				direction={props.direction}
				gap={props.gap}
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
