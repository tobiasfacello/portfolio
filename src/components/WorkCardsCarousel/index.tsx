import { Swiper, SwiperSlide } from 'swiper/react';

//* Swiper Modules
import { Autoplay } from 'swiper/modules';

//* Swiper Styles
import 'swiper/css';
import './swiper.style.css';

//* Components
import WorkCard from '../WorkCard';
import Container from '../Containers/Container';

//? Hooks, Config & Data
import { useBreakpoint, isDesktop } from '../../hooks/useBreakpoint';
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
						key={work.title}
						title={work.title}
						tags={work.tags}
						details={work.details}
						url={work.url}
						showcaseUrl={work.showcaseUrl}
						src={work.src}
					/>
				))}
			</Container>
		);
	}

	const swiperItems = [...works, ...works];

	return (
		<Swiper
			className="swiper"
			modules={[Autoplay]}
			autoplay={true}
			loop={true}
			centeredSlides={cfg.centeredSlides}
			slidesPerView={cfg.slidesPerView}
			spaceBetween={cfg.spaceBetween}
			direction={isDesktop(bp) ? 'horizontal' : 'horizontal'}
		>
			{swiperItems.map((work, i) => (
				<SwiperSlide key={`${work.title}-${i}`} className="swiper-slide">
					<WorkCard
						title={work.title}
						tags={work.tags}
						details={work.details}
						url={work.url}
						showcaseUrl={work.showcaseUrl}
						src={work.src}
					/>
				</SwiperSlide>
			))}
		</Swiper>
	);
}
