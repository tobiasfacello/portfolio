import styled from 'styled-components';
import Skeleton, { StyledSkeletonStack } from '.';
import { StyledSkeletonCard } from './styled';
import PillSkeleton from './PillSkeleton';
import { mq } from '../../config/breakpoints';

const Card = styled(StyledSkeletonCard)`
	width: 100%;
	height: 120px;
	min-width: 320px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: var(--8);

	${mq.down('mobile-lg')} {
		& {
			max-width: 335px;
		}
	}
	${mq.between('mobile-lg', 'desktop-sm')} {
		& {
			max-width: 380px;
		}
	}
`;

const LogoBox = styled.div`
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

function ProjectCardSkeleton() {
	return (
		<Card>
			<StyledSkeletonStack $gap="var(--8)" $h="100%" $justify="space-between">
				<StyledSkeletonStack $direction="row" $gap="var(--8)" $align="center">
					<Skeleton variant="text" h="var(--20)" w="120px" />
					<PillSkeleton w="48px" />
				</StyledSkeletonStack>
				<Skeleton variant="text" w="90%" />
				<StyledSkeletonStack $direction="row" $gap="var(--8)">
					<PillSkeleton w="40px" h="18px" />
					<PillSkeleton w="40px" h="18px" />
					<PillSkeleton w="40px" h="18px" />
				</StyledSkeletonStack>
			</StyledSkeletonStack>
			<LogoBox>
				<Skeleton variant="rect" w="80px" h="80px" radius="var(--radius-md)" />
			</LogoBox>
		</Card>
	);
}

export default ProjectCardSkeleton;
