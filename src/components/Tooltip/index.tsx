import { useEffect, useId, useRef } from 'react';

//* Types
import type { TooltipProps } from '../../types';

//* Styled
import {
	StyledTooltipWrapper,
	StyledTooltip,
	StyledTooltipBridge,
	StyledTooltipContent,
	StyledTooltipIcon,
	StyledTooltipReveal,
} from './styled';

const SHOW_DELAY_MS = 300;

function Tooltip({ text, children, position = 'top', align = 'center', icon, href }: TooltipProps) {
	const tooltipId = useId();
	const tooltipRef = useRef<HTMLSpanElement>(null);
	const enterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Visibility is a DOM attribute rather than state (see StyledTooltip):
	// hovering or focusing a trigger shows its tooltip without a React render.
	const setVisible = (visible: boolean) => {
		const tooltip = tooltipRef.current;
		if (!tooltip) return;
		tooltip.toggleAttribute('data-visible', visible);
		tooltip.setAttribute('aria-hidden', String(!visible));
	};

	const clearEnterTimeout = () => {
		if (enterTimeoutRef.current) {
			clearTimeout(enterTimeoutRef.current);
			enterTimeoutRef.current = null;
		}
	};

	const showTooltip = () => {
		clearEnterTimeout();
		enterTimeoutRef.current = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
	};

	const hideTooltip = () => {
		clearEnterTimeout();
		setVisible(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			hideTooltip();
		}
	};

	useEffect(() => clearEnterTimeout, []);

	const content = icon ? (
		<StyledTooltipContent>
			<StyledTooltipIcon>{icon}</StyledTooltipIcon>
			{text}
		</StyledTooltipContent>
	) : (
		text
	);

	return (
		<StyledTooltipWrapper
			onMouseEnter={showTooltip}
			onMouseLeave={hideTooltip}
			onFocus={showTooltip}
			onBlur={hideTooltip}
			onKeyDown={handleKeyDown}
			aria-describedby={tooltipId}
		>
			{children}
			<StyledTooltip
				ref={tooltipRef}
				id={tooltipId}
				$position={position}
				$align={align}
				$clickable={!!href}
				role="tooltip"
				aria-hidden="true"
			>
				{href && <StyledTooltipBridge $position={position} />}
				<StyledTooltipReveal>
					{href ? <a href={href}>{content}</a> : content}
				</StyledTooltipReveal>
			</StyledTooltip>
		</StyledTooltipWrapper>
	);
}

export default Tooltip;
