import { memo } from 'react';
import styled, { keyframes } from 'styled-components';

import { iconRegistry, type IconName } from '../Icon';

interface ShinyLabelProps {
	label: string;
	icon?: IconName;
}

// Memoized: its props are a translated string and an icon name, so section
// re-renders on resize or theme change skip it.
export default memo(function ShinyLabel({ label, icon }: ShinyLabelProps) {
	const IconComponent = icon ? iconRegistry[icon] : null;

	return (
		<StyledShinyLabel role="status">
			{IconComponent && (
				<IconComponent width={12} height={12} aria-hidden="true" focusable="false" />
			)}
			<StyledShinyText>{label}</StyledShinyText>
		</StyledShinyLabel>
	);
});

// The 200%-wide gradient puts the bright band at its centre. It used to travel
// 200% → -200% over the whole cycle, but it only overlaps the text between
// 120% and -20%, so two thirds of every cycle repainted an unchanged label.
// Now it waits just off the text and sweeps across at the same speed: the same
// shine, but the label is only repainted while the band is visible.
const shine = keyframes`
	0%, 65% { background-position: 120% center; }
	100%    { background-position: -20% center; }
`;

const StyledShinyLabel = styled.span`
	display: inline-flex;
	align-items: center;
	gap: var(--4);
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-caption);
	line-height: 1;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	color: color-mix(in srgb, var(--text) 40%, transparent);
`;

const StyledShinyText = styled.span`
	background: linear-gradient(
		90deg,
		color-mix(in srgb, var(--text) 40%, transparent) 0%,
		color-mix(in srgb, var(--text) 40%, transparent) 40%,
		var(--text) 50%,
		color-mix(in srgb, var(--text) 40%, transparent) 60%,
		color-mix(in srgb, var(--text) 40%, transparent) 100%
	);
	background-size: 200% auto;
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	animation: ${shine} 3s linear infinite;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
		background: none;
		-webkit-text-fill-color: currentColor;
	}
`;
