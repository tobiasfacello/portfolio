import styled from 'styled-components';
import Skeleton, { StyledSkeletonStack } from '.';
import { StyledSkeletonCard } from './styled';
import PillSkeleton from './PillSkeleton';
import { mq } from '../../config/breakpoints';

const Card = styled(StyledSkeletonCard)`
	width: 100%;
	height: 250px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: var(--16);

	${mq.up(375)} {
		& {
			width: 335px;
			min-width: 300px;
		}
	}
	${mq.up('mobile-lg')} {
		& {
			width: 340px;
		}
	}
`;

const LeftColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 60%;
	height: 100%;
	gap: var(--16);
`;

const LogoBox = styled.div`
	width: 40%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;

function WorkCardSkeleton() {
	return (
		<Card>
			<LeftColumn>
				<StyledSkeletonStack $gap="var(--12)">
					<Skeleton variant="text" h="var(--32)" w="70%" />
					<StyledSkeletonStack $direction="row" $gap="var(--6)">
						<PillSkeleton w="56px" />
						<PillSkeleton w="64px" />
					</StyledSkeletonStack>
					<StyledSkeletonStack $gap="var(--6)">
						<Skeleton variant="text" />
						<Skeleton variant="text" w="80%" />
					</StyledSkeletonStack>
				</StyledSkeletonStack>
				<StyledSkeletonStack $gap="var(--6)" $w="auto">
					<Skeleton variant="rect" w="32px" h="32px" radius="var(--radius-md)" />
					<Skeleton variant="rect" w="32px" h="32px" radius="var(--radius-md)" />
				</StyledSkeletonStack>
			</LeftColumn>
			<LogoBox>
				<Skeleton variant="circle" w="120px" h="120px" />
			</LogoBox>
		</Card>
	);
}

export default WorkCardSkeleton;
