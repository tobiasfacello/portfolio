import Skeleton from '.';

type PillSkeletonProps = {
	w?: string;
	h?: string;
};

function PillSkeleton({ w = '64px', h = '22px' }: PillSkeletonProps) {
	return <Skeleton variant="pill" w={w} h={h} />;
}

export default PillSkeleton;
