import styled, { css } from 'styled-components';
import { glassGradientBorder, iconWrapper } from '../../styles/mixins';

const arrowSize = 5;

type Align = 'center' | 'start' | 'end';

const alignStyles = (align: Align) => {
	if (align === 'start') return css`left: 0;`;
	if (align === 'end') return css`right: 0;`;
	return css`left: 50%; transform: translateX(-50%);`;
};

const arrowAlign = (align: Align) => {
	if (align === 'start') return css`left: 12px;`;
	if (align === 'end') return css`right: 12px;`;
	return css`left: 50%; transform: translateX(-50%);`;
};

const positionTop = (align: Align) => css`
	bottom: calc(100% + ${arrowSize + 4}px);
	${alignStyles(align)}

	&::before {
		top: 100%;
		${arrowAlign(align)}
		border-left: ${arrowSize}px solid transparent;
		border-right: ${arrowSize}px solid transparent;
		border-top: ${arrowSize}px solid var(--glass-border-start);
	}
`;

const positionBottom = (align: Align) => css`
	top: calc(100% + ${arrowSize + 4}px);
	${alignStyles(align)}

	&::before {
		bottom: 100%;
		${arrowAlign(align)}
		border-left: ${arrowSize}px solid transparent;
		border-right: ${arrowSize}px solid transparent;
		border-bottom: ${arrowSize}px solid var(--glass-border-start);
	}
`;

export const StyledTooltipWrapper = styled.div`
	position: relative;
	display: inline-flex;
`;

export const StyledTooltip = styled.span<{
	$position: 'top' | 'bottom';
	$align: Align;
	$clickable?: boolean;
}>`
	position: absolute;
	z-index: var(--z-tooltip);
	white-space: nowrap;
	padding: var(--6) var(--12);
	border-radius: var(--radius-md);
	pointer-events: ${({ $clickable }) => ($clickable ? 'auto' : 'none')};
	${({ $clickable }) => $clickable && 'cursor: pointer;'}

	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-label);
	font-weight: var(--font-weight-medium);
	color: var(--text);

	background-color: var(--glass-bg);
	backdrop-filter: blur(var(--blur-sm));
	-webkit-backdrop-filter: blur(var(--blur-sm));
	${glassGradientBorder({ radius: 'var(--radius-md)' })}

	transition:
		background-color var(--transition-base) ease-in-out,
		color var(--transition-base) ease-in-out,
		border-color var(--transition-base) ease-in-out;

	${({ $position, $align }) => ($position === 'top' ? positionTop($align) : positionBottom($align))}

	/* Arrow */
	&::before {
		content: '';
		position: absolute;
		transition: border-color var(--transition-base) ease-in-out;
	}

	${({ $clickable, $position }) =>
		$clickable &&
		css`
			&:hover {
				background-color: var(--tooltip-clickable-hover-bg);
				color: var(--tooltip-clickable-hover-text);
				backdrop-filter: none;
				-webkit-backdrop-filter: none;
				border-color: var(--tooltip-clickable-hover-bg);

				&::before {
					${$position === 'top'
						? `border-top-color: var(--tooltip-clickable-hover-bg);`
						: `border-bottom-color: var(--tooltip-clickable-hover-bg);`}
				}

				&::after {
					opacity: 0;
				}
			}
		`}
`;

export const StyledTooltipContent = styled.span`
	display: inline-flex;
	align-items: center;
	gap: var(--6);
`;

export const StyledTooltipBridge = styled.span<{
	$position: 'top' | 'bottom';
}>`
	position: absolute;
	left: 0;
	width: 100%;
	height: ${arrowSize + 4}px;
	${({ $position }) =>
		$position === 'top' ? 'top: 100%;' : 'bottom: 100%;'}
`;

export const StyledTooltipIcon = styled.span`
	${iconWrapper('var(--icon-xs)')}
	color: inherit;
`;
