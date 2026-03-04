import styled from "styled-components";
import { ContainerProps, FlexDirection, FlexJustify, FlexAlign, FlexWrap } from "../../types";
import { spacingArray } from "../../styles/mixins";

const StyledContainer = styled.div<{
	$css?: string;
	$w?: string;
	$minW?: string;
	$maxW?: string;
	$h?: string;
	$minH?: string;
	$maxH?: string;
	$m?: string[];
	$p?: string[];
	$direction?: FlexDirection;
	$justify?: FlexJustify;
	$align?: FlexAlign;
	$gap?: string;
	$wrap?: FlexWrap;
}>`
	${(props) => props.$css}
	width: ${(props) => (props.$w == null ? "100%" : props.$w)};
	${(props) => props.$minW != null && `min-width: ${props.$minW};`}
	${(props) => props.$maxW != null && `max-width: ${props.$maxW};`}
	height: ${(props) => props.$h ?? "100%"};
	${(props) => props.$minH != null && `min-height: ${props.$minH};`}
	${(props) => props.$maxH != null && `max-height: ${props.$maxH};`}
	display: flex;
	margin: ${(props) => spacingArray(props.$m)};
	padding: ${(props) => spacingArray(props.$p)};
	${(props) => props.$direction != null && `flex-direction: ${props.$direction};`}
	${(props) => props.$wrap != null && `flex-wrap: ${props.$wrap};`}
	${(props) => props.$justify != null && `justify-content: ${props.$justify};`}
	${(props) => props.$align != null && `align-items: ${props.$align};`}
	${(props) => props.$gap != null && `gap: ${props.$gap};`}
`;

function Container(props: ContainerProps) {
	return (
		<StyledContainer
			ref={props.ref}
			$css={props.$css}
			$w={props.w}
			$minW={props.minW}
			$maxW={props.maxW}
			$h={props.h}
			$minH={props.minH}
			$maxH={props.maxH}
			$m={props.m}
			$p={props.p}
			$direction={props.direction}
			$gap={props.gap}
			$wrap={props.wrap}
			$justify={props.justify}
			$align={props.align}
		>
			{props.children}
		</StyledContainer>
	);
}

export default Container;
