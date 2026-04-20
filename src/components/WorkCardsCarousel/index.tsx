import { lazy, Suspense } from 'react';

//* Components
import Container from '../Containers/Container';
import WorkCardSkeleton from '../Skeleton/WorkCardSkeleton';

//? Hooks, Config & Data
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { carouselConfig } from '../../config/responsive';
import { works } from '../../data/works';

const WorkCard = lazy(() => import('../WorkCard'));
const SwiperCarousel = lazy(() => import('./SwiperCarousel'));

function StaticCards() {
	return (
		<Container direction={"column"} justify={"center"} align={"center"} gap={"20px"}>
			{works.map((work) => (
				<Suspense key={work.slug} fallback={<WorkCardSkeleton />}>
					<WorkCard
						slug={work.slug}
						url={work.url}
						showcaseUrl={work.showcaseUrl}
						Logo={work.Logo}
					/>
				</Suspense>
			))}
		</Container>
	);
}

export default function WorkCardsCarousel() {
	const bp = useBreakpoint();
	const cfg = carouselConfig[bp];

	if (!cfg.useSwiper) {
		return <StaticCards />;
	}

	return (
		<Suspense fallback={<StaticCards />}>
			<SwiperCarousel
				slidesPerView={cfg.slidesPerView}
				centeredSlides={cfg.centeredSlides}
				spaceBetween={cfg.spaceBetween}
			/>
		</Suspense>
	);
}
