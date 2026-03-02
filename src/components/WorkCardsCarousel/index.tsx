import { lazy, Suspense } from 'react';

//* Components
import WorkCard from '../WorkCard';
import Container from '../Containers/Container';

//? Hooks, Config & Data
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { carouselConfig } from '../../config/responsive';
import { works } from '../../data/works';

const SwiperCarousel = lazy(() => import('./SwiperCarousel'));

function StaticCards() {
	return (
		<Container direction={"column"} justify={"center"} align={"center"} gap={"20px"}>
			{works.map((work) => (
				<WorkCard
					key={work.slug}
					slug={work.slug}
					url={work.url}
					showcaseUrl={work.showcaseUrl}
					Logo={work.Logo}
				/>
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
