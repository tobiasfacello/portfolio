import styled from 'styled-components';
import { glassCard, iconWrapper } from '../../../styles/mixins';

export const StyledWidgetCard = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: var(--12);
	gap: var(--12);
	overflow: hidden;
	width: 100%;
	min-height: 280px;
	${glassCard(true)}

	/* Move backdrop-filter to pseudo so nested tooltip blur works */
	backdrop-filter: none;
	isolation: isolate;

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		backdrop-filter: blur(var(--blur-sm));
		-webkit-backdrop-filter: blur(var(--blur-sm));
		z-index: -1;
		pointer-events: none;
	}
`;

export const StyledWidgetHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`;

export const StyledWidgetPlatform = styled.div`
	display: flex;
	align-items: center;
	gap: var(--8);
`;

export const StyledWidgetIcon = styled.span`
	${iconWrapper('var(--control-xs)')}
	color: var(--text);
	opacity: var(--opacity-soft);
`;

export const StyledWidgetContent = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: var(--8);
	overflow: hidden;
`;

export const StyledWidgetHandle = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: 0.75rem;
	line-height: 1;
	color: var(--text);
	opacity: var(--opacity-soft);
`;

export const StyledWidgetStat = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-label);
	line-height: 1;
	color: var(--text);
	opacity: var(--opacity-muted);
`;

export const StyledErrorState = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: var(--12);
	flex: 1;
`;

// Footer slot — anchored to the widget bottom via margin-top: auto, with
// space-between so a left stat and a right stat read as a balanced pair on
// wider screens. On narrow viewports we stack the items vertically and
// align everything left so the right-justified total stops orphaning on a
// solo line.
export const StyledWidgetFooter = styled.div`
	margin-top: auto;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--12);
	flex-wrap: wrap;
	padding-top: var(--6);

	@media (max-width: 479px) {
		flex-direction: column;
		align-items: flex-start;
		gap: var(--4);

		& > * {
			text-align: left;
		}
	}
`;
