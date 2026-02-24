import styled, { css } from 'styled-components';

const arrowSize = 5;

const positionTop = css`
	bottom: calc(100% + ${arrowSize + 4}px);
	left: 50%;
	transform: translateX(-50%);

	&::before {
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border-left: ${arrowSize}px solid transparent;
		border-right: ${arrowSize}px solid transparent;
		border-top: ${arrowSize}px solid var(--glass-border-start);
	}
`;

const positionBottom = css`
	top: calc(100% + ${arrowSize + 4}px);
	left: 50%;
	transform: translateX(-50%);

	&::before {
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
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
	$clickable?: boolean;
}>`
	position: absolute;
	z-index: var(--z-tooltip);
	white-space: nowrap;
	padding: 6px 10px;
	border-radius: var(--radius-md);
	pointer-events: ${({ $clickable }) => ($clickable ? 'auto' : 'none')};
	${({ $clickable }) => $clickable && 'cursor: pointer;'}

	font-family: 'Plus Jakarta Sans', sans-serif;
	font-size: 12px;
	font-weight: 500;
	color: var(--text);

	background-color: var(--glass-bg);
	backdrop-filter: blur(4px);
	-webkit-backdrop-filter: blur(4px);
	border: 1px solid transparent;
	background-clip: padding-box;

	transition:
		background-color var(--transition-base) ease-in-out,
		color var(--transition-base) ease-in-out,
		border-color var(--transition-base) ease-in-out;

	${({ $position }) => ($position === 'top' ? positionTop : positionBottom)}

	/* Arrow */
	&::before {
		content: '';
		position: absolute;
		transition: border-color var(--transition-base) ease-in-out;
	}

	/* Glass gradient border */
	&::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: var(--radius-md);
		padding: 1px;
		background: linear-gradient(
			to bottom,
			var(--glass-border-start),
			var(--glass-border-end)
		);
		mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask: linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		pointer-events: none;
		transition: opacity var(--transition-base) ease-in-out;
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
	gap: 6px;
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
	display: inline-flex;
	width: 14px;
	height: 14px;
	color: inherit;

	svg {
		width: 100%;
		height: 100%;
	}
`;
