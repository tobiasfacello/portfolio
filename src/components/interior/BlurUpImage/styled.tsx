import styled from 'styled-components';

export const StyledBlurUpFrame = styled.div<{
	$width: number;
	$height: number;
	$radius: number;
	$color?: string;
}>`
	position: relative;
	width: 100%;
	overflow: hidden;
	/* Reserving the ratio up front is what stops the page reflowing on load. */
	aspect-ratio: ${({ $width, $height }) => `${$width} / ${$height}`};
	border-radius: ${({ $radius }) => $radius}px;
	background-color: ${({ $color }) => $color ?? 'var(--secondary)'};
`;

export const StyledBlurUpLayer = styled.img`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

/** Scaled slightly so the blur's soft edge never exposes the frame behind it. */
export const StyledBlurUpPlaceholder = styled(StyledBlurUpLayer)<{ $blur: number }>`
	filter: blur(${({ $blur }) => $blur}px);
	transform: scale(1.08);
`;

export const StyledBlurUpError = styled.div`
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
	background-color: var(--overlay-solid);
	color: var(--text);
	opacity: 0;
`;
