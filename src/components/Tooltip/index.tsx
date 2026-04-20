import { useEffect, useId, useRef, useState } from 'react';

//* Types
import type { TooltipProps } from '../../types';

//? Hooks
import { useTooltipAnimation } from '../../hooks/useTooltipAnimation';

//* Styled
import {
	StyledTooltipWrapper,
	StyledTooltip,
	StyledTooltipBridge,
	StyledTooltipContent,
	StyledTooltipIcon,
} from './styled';

function Tooltip({ text, children, position = 'top', align = 'center', icon, href }: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false);
	const tooltipId = useId();
	const tooltipRef = useTooltipAnimation(isVisible, position);
	const enterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const showTooltip = () => {
		enterTimeoutRef.current = setTimeout(() => setIsVisible(true), 300);
	};

	const hideTooltip = () => {
		if (enterTimeoutRef.current) {
			clearTimeout(enterTimeoutRef.current);
			enterTimeoutRef.current = null;
		}
		setIsVisible(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			hideTooltip();
		}
	};

	useEffect(() => {
		return () => {
			if (enterTimeoutRef.current) {
				clearTimeout(enterTimeoutRef.current);
				enterTimeoutRef.current = null;
			}
		};
	}, []);

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
				aria-hidden={!isVisible}
			>
				{href && <StyledTooltipBridge $position={position} />}
				{href ? <a href={href}>{content}</a> : content}
			</StyledTooltip>
		</StyledTooltipWrapper>
	);
}

export default Tooltip;
