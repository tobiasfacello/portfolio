import { lazy, Suspense, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import './swiper.style.css';

import WorkCardSkeleton from '../Skeleton/WorkCardSkeleton';
import { works } from '../../data/works';

const WorkCard = lazy(() => import('../WorkCard'));

const SWIPER_MODULES = [A11y];
const AUTOPLAY_DELAY_MS = 5000;

/**
 * Swiper's Autoplay module keeps a requestAnimationFrame loop running for the
 * carousel's whole lifetime (to report the time left), even while it's
 * scrolled out of view. This timer keeps the same behaviour — next slide 5s
 * after each transition ends, stopped for good once the user drags — but does
 * no work between slides and pauses while the carousel is off-screen or the
 * tab is hidden.
 */
function useAutoplay(swiperRef: React.RefObject<SwiperInstance | null>) {
	useEffect(() => {
		const swiper = swiperRef.current;
		if (!swiper) return;

		let timer: ReturnType<typeof setTimeout> | undefined;
		let visible = false;
		let stopped = false;

		const schedule = () => {
			clearTimeout(timer);
			if (stopped || !visible || document.hidden) return;
			timer = setTimeout(() => swiper.slideNext(), AUTOPLAY_DELAY_MS);
		};
		const stop = () => {
			stopped = true;
			clearTimeout(timer);
		};

		const observer = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			schedule();
		});
		observer.observe(swiper.el);
		swiper.on('slideChangeTransitionEnd', schedule);
		swiper.on('sliderFirstMove', stop);
		document.addEventListener('visibilitychange', schedule);

		return () => {
			clearTimeout(timer);
			observer.disconnect();
			swiper.off('slideChangeTransitionEnd', schedule);
			swiper.off('sliderFirstMove', stop);
			document.removeEventListener('visibilitychange', schedule);
		};
	}, [swiperRef]);
}

interface SwiperCarouselProps {
	slidesPerView?: number;
	centeredSlides?: boolean;
	spaceBetween?: number;
}

export default function SwiperCarousel({ slidesPerView, centeredSlides, spaceBetween }: SwiperCarouselProps) {
	const swiperRef = useRef<SwiperInstance | null>(null);
	useAutoplay(swiperRef);

	return (
		<Swiper
			className="swiper"
			role="region"
			aria-label="Work showcase carousel"
			modules={SWIPER_MODULES}
			onSwiper={(swiper) => {
				swiperRef.current = swiper;
			}}
			loop={true}
			centeredSlides={centeredSlides}
			slidesPerView={slidesPerView}
			spaceBetween={spaceBetween}
			speed={600}
			grabCursor={true}
		>
			{works.map((work) => (
				<SwiperSlide key={work.slug} className="swiper-slide">
					<Suspense fallback={<WorkCardSkeleton />}>
						<WorkCard
							slug={work.slug}
							url={work.url}
							showcaseUrl={work.showcaseUrl}
							Logo={work.Logo}
						/>
					</Suspense>
				</SwiperSlide>
			))}
		</Swiper>
	);
}
