import { Swiper, SwiperSlide } from 'swiper/react';

//* Swiper Modules
import { Autoplay, A11y } from 'swiper/modules';

//* Swiper Styles
import 'swiper/css';
import './swiper.style.css';

//* Components
import WorkCard from '../WorkCard';
import Container from '../Containers/Container';

//? Hooks, Config & Data
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { carouselConfig } from '../../config/responsive';
import { works } from '../../data/works';

export default function WorkCardsCarousel() {
	const bp = useBreakpoint();
	const cfg = carouselConfig[bp];

	if (!cfg.useSwiper) {
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

	return (
		<Swiper
			className="swiper"
			role="region"
			aria-label="Work showcase carousel"
			modules={[Autoplay, A11y]}
			autoplay={{ delay: 5000, disableOnInteraction: true }}
			loop={true}
			centeredSlides={cfg.centeredSlides}
			slidesPerView={cfg.slidesPerView}
			spaceBetween={cfg.spaceBetween}
		>
			{works.map((work) => (
				<SwiperSlide key={work.slug} className="swiper-slide">
					<WorkCard
						slug={work.slug}
						url={work.url}
						showcaseUrl={work.showcaseUrl}
						Logo={work.Logo}
					/>
				</SwiperSlide>
			))}
		</Swiper>
	);
}
