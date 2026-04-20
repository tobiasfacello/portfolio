import { StyledSkeleton, StyledSkeletonStack, type SkeletonVariant } from './styled';

type SkeletonProps = {
	variant?: SkeletonVariant;
	w?: string;
	h?: string;
	radius?: string;
	m?: string[];
	'aria-label'?: string;
};

function Skeleton({ variant = 'rect', w, h, radius, m, ...rest }: SkeletonProps) {
	return (
		<StyledSkeleton
			$variant={variant}
			$w={w}
			$h={h}
			$radius={radius}
			$m={m}
			role="status"
			aria-busy="true"
			aria-live="polite"
			aria-label={rest['aria-label'] ?? 'Cargando'}
		/>
	);
}

export default Skeleton;
export { StyledSkeletonStack };
export type { SkeletonProps };
