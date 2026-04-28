import styled from 'styled-components';

//* Shared
import { shimmerSurface } from './shimmer';

const StyledRoot = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--8);
	height: 100%;
`;

const StyledHandleSk = styled.div`
	height: 12px;
	width: 35%;
	border-radius: var(--radius-sm);
	${shimmerSurface}
`;

const StyledPositionSk = styled.div`
	height: 14px;
	width: 70%;
	border-radius: var(--radius-sm);
	${shimmerSurface}
`;

const StyledLocationSk = styled.div`
	height: 12px;
	width: 30%;
	border-radius: var(--radius-sm);
	${shimmerSurface}
`;

const StyledSectionLabelSk = styled.div`
	height: 10px;
	width: 25%;
	border-radius: var(--radius-sm);
	margin-top: var(--4);
	${shimmerSurface}
`;

const StyledExperienceList = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--6);
`;

const StyledExperienceRow = styled.div`
	display: flex;
	align-items: flex-start;
	gap: var(--8);
	padding-left: var(--6);
	border-left: 1px solid var(--glass-border-start);
`;

const StyledLogoSk = styled.div`
	width: 28px;
	height: 28px;
	border-radius: var(--radius-sm);
	flex-shrink: 0;
	${shimmerSurface}
`;

const StyledExpContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--2);
	flex: 1;
	min-width: 0;
`;

const StyledTitleSk = styled.div`
	height: 12px;
	width: 75%;
	border-radius: var(--radius-sm);
	${shimmerSurface}
`;

const StyledPeriodSk = styled.div`
	height: 10px;
	width: 45%;
	border-radius: var(--radius-sm);
	${shimmerSurface}
`;

function LinkedInWidgetSkeleton() {
	return (
		<StyledRoot>
			<StyledHandleSk />
			<StyledPositionSk />
			<StyledLocationSk />
			<StyledSectionLabelSk />
			<StyledExperienceList>
				{Array.from({ length: 3 }).map((_, i) => (
					<StyledExperienceRow key={i}>
						<StyledLogoSk />
						<StyledExpContent>
							<StyledTitleSk />
							<StyledPeriodSk />
						</StyledExpContent>
					</StyledExperienceRow>
				))}
			</StyledExperienceList>
		</StyledRoot>
	);
}

export default LinkedInWidgetSkeleton;
