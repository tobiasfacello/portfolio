import { css, keyframes } from 'styled-components';
import { StyledPillTag } from '../components/Pill/styled';

//* Assets
import noiseTexture from '../assets/images/noise-texture.webp';

export const glassCard = css`
	background-color: rgba(197, 199, 188, 5%);
	background-clip: padding-box;
	border: 1px solid transparent;
	border-radius: 20px;
	backdrop-filter: blur(4px);
	cursor: pointer;
	transition: all 300ms;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 20px;
		padding: 1px;
		background: linear-gradient(
			to bottom,
			rgba(197, 199, 188, 10%),
			rgba(197, 199, 188, 0%)
		);
		mask: linear-gradient(#f2e8ea 0 0) content-box, linear-gradient(#f2e8ea 0 0);
		-webkit-mask: linear-gradient(#f2e8ea 0 0) content-box,
			linear-gradient(#f2e8ea 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		transition: all 300ms;
	}

	&:hover::before {
		background: linear-gradient(
			to bottom,
			rgba(197, 199, 188, 30%),
			rgba(197, 199, 188, 6%)
		);
	}
`;

export const hoveredPillStyles = (isHovered: boolean) => css`
	${StyledPillTag} {
		color: ${isHovered ? "var(--pill-text-hovered)" : "var(--text)"};
		background-color: ${isHovered ? "var(--accent)" : "transparent"};
		border-color: ${isHovered ? "var(--primary)" : "inherit"};
		opacity: ${isHovered ? "1" : "0.6"};
	}
`;

export const interactiveHover = css`
	opacity: 0.6;
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
`;

const noiseDrift = keyframes`
	0% { mask-position: 0px 0px; -webkit-mask-position: 0px 0px; }
	20% { mask-position: 170px 500px; -webkit-mask-position: 170px 500px; }
	40% { mask-position: 530px 280px; -webkit-mask-position: 530px 280px; }
	60% { mask-position: 220px 670px; -webkit-mask-position: 220px 670px; }
	80% { mask-position: 620px 140px; -webkit-mask-position: 620px 140px; }
	100% { mask-position: 720px 720px; -webkit-mask-position: 720px 720px; }
`;

export const noisePatternBackground = css`
	position: relative;
	isolation: isolate;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background-image: radial-gradient(circle, #444738 1px, transparent 1px);
		background-size: 13.5px 13.5px;
		-webkit-mask-image: url(${noiseTexture});
		mask-image: url(${noiseTexture});
		-webkit-mask-size: 720px 720px;
		mask-size: 720px 720px;
		-webkit-mask-repeat: repeat;
		mask-repeat: repeat;
		-webkit-transform: translateZ(0);
		transform: translateZ(0);
		will-change: mask-position;
		animation: ${noiseDrift} 150s linear infinite;

		@media (prefers-reduced-motion: reduce) {
			animation: none;
		}
	}
`;

export const spacingArray = (values: string[] | undefined) =>
	values ? values.map((v) => `var(--${v})`).join(' ') : undefined;
