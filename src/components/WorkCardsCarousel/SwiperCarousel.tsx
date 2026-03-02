import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, A11y } from 'swiper/modules';
import 'swiper/css';
import './swiper.style.css';

import WorkCard from '../WorkCard';
import { works } from '../../data/works';

const SWIPER_MODULES = [Autoplay, A11y];

interface SwiperCarouselProps {
	slidesPerView?: number;
	centeredSlides?: boolean;
	spaceBetween?: number;
}

export default function SwiperCarousel({ slidesPerView, centeredSlides, spaceBetween }: SwiperCarouselProps) {
	return (
		<Swiper
			className="swiper"
			role="region"
			aria-label="Work showcase carousel"
			modules={SWIPER_MODULES}
			autoplay={{ delay: 5000, disableOnInteraction: true }}
			loop={true}
			centeredSlides={centeredSlides}
			slidesPerView={slidesPerView}
			spaceBetween={spaceBetween}
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
