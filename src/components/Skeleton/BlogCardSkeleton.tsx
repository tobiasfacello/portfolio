import styled from 'styled-components';
import Skeleton, { StyledSkeletonStack } from '.';
import { StyledSkeletonCard } from './styled';
import PillSkeleton from './PillSkeleton';

const ImageWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 150px;
	flex-shrink: 0;
	overflow: hidden;
	border-radius: var(--radius-md);
`;

const TagsRow = styled.div`
	position: absolute;
	bottom: var(--8);
	left: var(--8);
	display: flex;
	gap: var(--4);
`;

function BlogCardSkeleton() {
	return (
		<StyledSkeletonCard>
			<StyledSkeletonStack $gap="var(--4)" $h="auto">
				<Skeleton variant="text" h="var(--16)" w="80%" />
				<Skeleton variant="text" w="100%" />
				<Skeleton variant="text" w="60%" m={['0', '0', '8', '0']} />
			</StyledSkeletonStack>
			<ImageWrapper>
				<Skeleton variant="rect" h="100%" radius="var(--radius-md)" />
				<TagsRow>
					<PillSkeleton w="48px" h="20px" />
					<PillSkeleton w="56px" h="20px" />
				</TagsRow>
			</ImageWrapper>
		</StyledSkeletonCard>
	);
}

export default BlogCardSkeleton;
