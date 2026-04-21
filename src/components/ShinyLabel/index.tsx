import styled, { keyframes } from 'styled-components';

import { iconRegistry, type IconName } from '../Icon';

interface ShinyLabelProps {
	label: string;
	icon?: IconName;
}

export default function ShinyLabel({ label, icon }: ShinyLabelProps) {
	const IconComponent = icon ? iconRegistry[icon] : null;

	return (
		<StyledShinyLabel role="status">
			{IconComponent && (
				<IconComponent width={12} height={12} aria-hidden="true" focusable="false" />
			)}
			<StyledShinyText>{label}</StyledShinyText>
		</StyledShinyLabel>
	);
}

const shine = keyframes`
	0%   { background-position: 200% center; }
	100% { background-position: -200% center; }
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
