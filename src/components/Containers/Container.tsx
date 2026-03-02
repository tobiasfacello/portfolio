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
	min-width: ${(props) => (props.$minW == null ? "" : props.$minW)};
	max-width: ${(props) => (props.$maxW == null ? "" : props.$maxW)};
	height: ${(props) => (props.$h == null ? "100%" : props.$h)};
	min-height: ${(props) => (props.$minH == null ? "" : props.$minH)};
	max-height: ${(props) => (props.$maxH == null ? "" : props.$maxH)};
	display: flex;
	margin: ${(props) => spacingArray(props.$m)};
	padding: ${(props) => spacingArray(props.$p)};
	flex-direction: ${(props) => props.$direction != null && props.$direction};
	flex-wrap: ${(props) => props.$wrap != null && props.$wrap};
	justify-content: ${(props) => props.$justify != null && props.$justify};
	align-items: ${(props) => props.$align != null && props.$align};
	gap: ${(props) => props.$gap != null && props.$gap};
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
