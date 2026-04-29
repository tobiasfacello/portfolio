import { css } from 'styled-components';
import { StyledPillTag } from '../components/Pill/styled';
import { mq } from '../config/breakpoints';

export const spacingArray = (values: string[] | undefined) =>
	values ? values.map((v) => `var(--${v})`).join(' ') : undefined;

export const glassGradientBorder = ({
	bold = false,
	radius = 'var(--radius-lg)',
	pseudo = '::after',
}: {
	bold?: boolean;
	radius?: string;
	pseudo?: '::after' | '::before';
} = {}) => css`
	border: 1px solid transparent;
	background-clip: padding-box;

	&${pseudo} {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: ${radius};
		padding: 1px;
		background: linear-gradient(
			to bottom,
			var(--glass-border${bold ? '-bold' : ''}-start),
			var(--glass-border${bold ? '-bold' : ''}-end)
		);
		mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask: linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		pointer-events: none;
		transition: background var(--transition-slow) ease-in-out;
	}
`;

export const glassBorder = (bold = false) => css`
	position: relative;
	background-color: var(--glass-bg${bold ? '-bold' : ''});
	background-clip: padding-box;
	border-radius: var(--radius-lg);
	backdrop-filter: blur(var(--blur-sm));
	-webkit-backdrop-filter: blur(var(--blur-sm));
	transition: all var(--transition-slow) ease-in-out;
	${glassGradientBorder({ bold })}

	&::after {
		z-index: 1;
	}

	&:hover::after {
		background: linear-gradient(
			to bottom,
			var(--glass-border${bold ? '-bold-' : '-'}hover-start),
			var(--glass-border${bold ? '-bold-' : '-'}hover-end)
		);
	}
`;

export const glassCard = (bold = false) => css`
	background-color: var(--glass-bg${bold ? '-bold' : ''});
	background-clip: padding-box;
	border: 1px solid transparent;
	border-radius: var(--radius-lg);
	backdrop-filter: blur(var(--blur-sm));
	transition: all var(--transition-slow) ease-in-out;

	${glassGradientBorder({ bold, pseudo: '::before' })}

	&:hover::before {
		background: linear-gradient(
			to bottom,
			var(--glass-border${bold ? '-bold-' : '-'}hover-start),
			var(--glass-border${bold ? '-bold-' : '-'}hover-end)
		);
	}
`;

export const hoveredPillStyles = css`
	${StyledPillTag} {
		color: var(--text);
		background-color: transparent;
		border-color: inherit;
		opacity: var(--opacity-soft);
	}

	&:hover ${StyledPillTag} {
		color: var(--pill-text-hovered);
		background-color: var(--accent);
		border-color: var(--primary);
		opacity: var(--opacity-full);
	}
`;

export const interactiveHover = css`
	opacity: var(--opacity-soft);
	transition: all var(--transition-fast);

	&:hover {
		opacity: var(--opacity-full);
		background-color: var(--accent);
		border: 1px solid var(--primary);
	}

	&:active {
		background-color: var(--primary);
		transition: all var(--transition-fast);
	}
`;

export const sectionBase = (gridArea: string) => css`
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;

	${mq.up('desktop-sm')} {
		grid-area: ${gridArea};
	}
`;

export const tooltipBase = css`
	position: absolute;
	z-index: var(--z-tooltip);
	white-space: nowrap;
	padding: var(--6) var(--12);
	border-radius: var(--radius-md);
	pointer-events: none;

	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-label);
	font-weight: var(--font-weight-medium);
	color: var(--text);

	background-color: var(--glass-bg);
	backdrop-filter: blur(var(--blur-md));
	-webkit-backdrop-filter: blur(var(--blur-md));
	${glassGradientBorder({ radius: 'var(--radius-md)' })}
`;

export const iconWrapper = (size: string) => css`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: ${size};
	height: ${size};
	flex-shrink: 0;

	svg {
		width: 100%;
		height: 100%;
	}
`;

export const responsiveCardPadding = css`
	padding: 0.5rem;
	${mq.up('mobile-lg')} {
		padding: 1rem;
	}
`;

export const imageCardContent = (hoverScale = 1.01) => css`
	& > img {
		width: 100%;
		height: auto;
		display: block;
		object-fit: cover;
		border-radius: 12px;
		transition: transform 300ms ease-in-out;

		${mq.up('mobile-lg')} {
			border-radius: 8px;
		}
	}

	&:hover > img {
		transform: scale(${hoverScale});
	}
`;

export const widgetText = (fontSize: string, opacity: string) => css`
	font-family: var(--font-geist-pixel-circle);
	font-size: ${fontSize};
	line-height: 1;
	color: var(--text);
	opacity: ${opacity};
`;

