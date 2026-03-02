import { useId, useState } from 'react';

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
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
			onFocus={() => setIsVisible(true)}
			onBlur={() => setIsVisible(false)}
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
