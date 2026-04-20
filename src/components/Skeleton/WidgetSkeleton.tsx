import Skeleton, { StyledSkeletonStack } from '.';

type WidgetSkeletonProps = {
	rows?: number;
};

const widths = ['60%', '40%', '100%', '80%', '50%', '70%', '45%'];

function WidgetSkeleton({ rows = 5 }: WidgetSkeletonProps) {
	return (
		<StyledSkeletonStack $gap="var(--8)" $h="100%">
			{Array.from({ length: rows }).map((_, i) => (
				<Skeleton key={i} variant="text" w={widths[i % widths.length]} />
			))}
		</StyledSkeletonStack>
	);
}

export default WidgetSkeleton;
