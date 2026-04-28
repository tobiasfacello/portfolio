import { useEffect, useId, useRef, useState } from 'react';

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

function Tooltip({ text, children, position = 'top', align = 'center', icon, href }: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false);
	// Bumped on every show so the inner reveal animation replays even when the
	// content is unchanged.
	const [revealKey, setRevealKey] = useState(0);
	const tooltipId = useId();
	const enterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const showTooltip = () => {
		enterTimeoutRef.current = setTimeout(() => {
			setIsVisible(true);
			setRevealKey((k) => k + 1);
		}, 300);
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
				id={tooltipId}
				$position={position}
				$align={align}
				$clickable={!!href}
				$visible={isVisible}
				role="tooltip"
				aria-hidden={!isVisible}
			>
				{href && <StyledTooltipBridge $position={position} />}
				<StyledTooltipReveal key={revealKey}>
					{href ? <a href={href}>{content}</a> : content}
				</StyledTooltipReveal>
			</StyledTooltip>
		</StyledTooltipWrapper>
	);
}

export default Tooltip;
