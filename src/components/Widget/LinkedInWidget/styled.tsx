import styled, { keyframes } from 'styled-components';
import { widgetText } from '../../../styles/mixins';
import { popInAnimation } from '../shared/digitPop';

export const StyledProfileInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--8);
	flex: 1;
	justify-content: flex-start;
`;

export const StyledHeadline = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: 0.875rem;
	line-height: 1.4;
	color: var(--text);
	opacity: var(--opacity-medium);
`;

export const StyledPosition = styled.span`
	${widgetText('0.75rem', 'var(--opacity-muted)')}
	line-height: 1.25;
`;

export const StyledLocation = styled.span`
	display: inline-flex;
	align-items: center;
	gap: var(--6);
	font-family: var(--font-geist-pixel-circle);
	font-size: 0.75rem;
	line-height: 1;
	color: var(--text);
	opacity: var(--opacity-muted);

	&::before {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: var(--accent);
		flex-shrink: 0;
	}
`;

export const StyledSectionLabel = styled.span`
	${widgetText('0.5625rem', 'var(--opacity-muted)')}
	text-transform: uppercase;
	letter-spacing: 0.08em;
`;

export const StyledExperienceList = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--6);
	margin-top: var(--4);
`;

export const StyledExperienceItem = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	gap: var(--8);
	padding-left: var(--6);
	border-left: 1px solid var(--glass-border-start);
	${popInAnimation}
`;

export const StyledCompanyLogo = styled.img`
	width: 28px;
	height: 28px;
	border-radius: var(--radius-sm);
	flex-shrink: 0;
	object-fit: cover;
`;

export const StyledExperienceContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--2);
	min-width: 0;
`;

export const StyledExperienceTitle = styled.span`
	display: flex;
	align-items: center;
	gap: var(--6);
	${widgetText('0.75rem', 'var(--opacity-medium)')}
	line-height: 1.25;
`;

export const StyledExperiencePeriod = styled.span`
	${widgetText('0.625rem', 'var(--opacity-muted)')}
`;

// Subtle "live" pulse on the Current badge — opacity-only so the layout
// doesn't reflow and the GPU compositor keeps it smooth.
const livePulse = keyframes`
	0%, 100% { opacity: 1; }
	50%      { opacity: 0.6; }
`;

export const StyledCurrentBadge = styled.span`
	display: inline-flex;
	align-items: center;
	padding: var(--2) var(--6);
	border-radius: var(--radius-sm);
	background-color: var(--accent);
	font-family: var(--font-geist-pixel-circle);
	font-size: 0.5rem;
	line-height: 1;
	color: var(--background);
	font-weight: 600;
	animation: ${livePulse} 2.4s ease-in-out infinite;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;

export const StyledFooterLabel = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-label);
	line-height: 1;
	color: var(--text);
	opacity: var(--opacity-soft);
`;

export const StyledFooterMeta = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-label);
	line-height: 1;
	color: var(--text);
	opacity: var(--opacity-muted);
	text-align: right;
`;
