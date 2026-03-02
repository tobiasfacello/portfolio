import styled from 'styled-components';
import { glassCard } from '../../../styles/mixins';

export const StyledWidgetCard = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	padding: var(--12);
	gap: var(--12);
	overflow: hidden;
	width: 100%;
	min-height: 280px;
	${glassCard(true)}
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
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: var(--control-xs);
	height: var(--control-xs);
	color: var(--text);
	opacity: var(--opacity-soft);

	svg {
		width: 100%;
		height: 100%;
	}
`;

export const StyledWidgetContent = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: var(--8);
	overflow: hidden;
`;
