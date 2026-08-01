import styled from 'styled-components';

//* Shared
import { StyledStateStack, uiLabel } from '../shared/styled';

export type StrengthTone = 'none' | 'danger' | 'caution' | 'safe';

const toneColor: Record<StrengthTone, string> = {
	none: 'var(--text)',
	danger: 'var(--danger)',
	caution: 'var(--warning)',
	safe: 'var(--success)',
};

export const StyledStrengthRoot = styled.div`
	width: 100%;
`;

export const StyledStrengthMeter = styled.div<{ $segments: number }>`
	display: grid;
	gap: var(--6);
	grid-template-columns: repeat(${({ $segments }) => $segments}, minmax(0, 1fr));
`;

export const StyledStrengthSegment = styled.div`
	position: relative;
	height: 6px;
	overflow: hidden;
	border-radius: 2px;
	background-color: var(--glass-bg-bold);
`;

export const StyledStrengthFill = styled.span<{ $tone: StrengthTone }>`
	position: absolute;
	inset: 0;
	transform-origin: left center;
	border-radius: 2px;
	background-color: ${({ $tone }) => toneColor[$tone]};
	opacity: ${({ $tone }) => ($tone === 'none' ? 'var(--opacity-subtle)' : 'var(--opacity-full)')};
	transition: background-color var(--transition-base) var(--ease-state);
	will-change: transform;
`;

export const StyledStrengthRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--12);
	height: var(--20);
	margin-top: var(--8);
`;

export const StyledStrengthLabels = styled(StyledStateStack)<{ $tone: StrengthTone }>`
	${uiLabel}
	justify-items: start;
	font-size: var(--font-size-body-sm);
	color: ${({ $tone }) => toneColor[$tone]};
	transition: color var(--transition-base) var(--ease-state);

	> span {
		white-space: nowrap;
	}
`;

export const StyledGuessableFlag = styled.span`
	${uiLabel}
	font-size: var(--font-size-caption);
	color: var(--warning);
	white-space: nowrap;
	opacity: 0;
`;

export const StyledRuleList = styled.ul`
	display: grid;
	gap: var(--6);
	margin-top: var(--12);
	list-style: none;
`;

export const StyledRuleRow = styled.li`
	display: flex;
	align-items: center;
	gap: var(--8);
`;

export const StyledRuleBox = styled.span`
	position: relative;
	display: grid;
	place-items: center;
	width: 14px;
	height: 14px;
	flex-shrink: 0;
	border: 1px solid var(--glass-border-bold-start);
	border-radius: 4px;
	color: var(--background);
`;

export const StyledRuleFill = styled.span`
	position: absolute;
	inset: 0;
	border-radius: 3px;
	background-color: var(--success);
	opacity: 0;
`;

export const StyledRuleTick = styled.svg`
	position: relative;
	width: 9px;
	height: 9px;
	opacity: 0;
`;

export const StyledRuleLabel = styled.span<{ $met: boolean }>`
	${uiLabel}
	font-size: var(--font-size-body-sm);
	opacity: ${({ $met }) => ($met ? 'var(--opacity-full)' : 'var(--opacity-text-muted)')};
	transition: opacity var(--transition-base) var(--ease-state);
`;
