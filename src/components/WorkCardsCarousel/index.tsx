import MediaQuery, { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';

//* Swiper Modules
import { Autoplay } from 'swiper/modules';

//* Swiper Styles
import 'swiper/css';
import './swiper.style.css';

//* Components
import WorkCard from '../WorkCard';

//* Assets
import moldeLogo from '../../assets/works/molde.svg';
import indaloLogo from '../../assets/works/indalo.svg';
import ranchoLogo from '../../assets/works/rancho.svg';
import clamacoLogo from '../../assets/works/clamaco.svg';

export default function WorkCardsCarousel() {
	const isDesktop = useMediaQuery({ minWidth: 960 });

	return (
		<>
			<MediaQuery minWidth={360} maxWidth={959}>
				<WorkCard
					title={'Molde'}
					tag={'Development'}
					details={'Architecture studio'}
					url={'https://www.estudiomolde.com/'}
					showcaseUrl={
						'https://contra.com/p/o3YcvW6c-molde-architecture-studio-development'
					}
					src={moldeLogo}
				/>
				<WorkCard
					title={'Indalo'}
					tag={'Development'}
					details={'Enterprises group'}
					url={'https://www.grupoindalo.com.ar/'}
					showcaseUrl={
						'https://contra.com/p/WPl3g6WF-indalo-enterprises-group-development'
					}
					src={indaloLogo}
				/>
				<WorkCard
					title={'Rancho'}
					tag={'Development'}
					details={'Rental business'}
					url={'https://bungalowselrancho.com.ar/'}
					showcaseUrl={
						'https://contra.com/p/XFlM23XE-el-rancho-family-run-rental-business-design-and-development'
					}
					src={ranchoLogo}
				/>
				<WorkCard
					title={'Clamaco'}
					tag={'Design'}
					details={'Construction company'}
					url={'https://clamaco.com.ar/'}
					src={clamacoLogo}
				/>
			</MediaQuery>
			<MediaQuery minWidth={960} maxWidth={1279}>
				<Swiper
					className="swiper"
					modules={[Autoplay]}
					autoplay={true}
					loop={true}
					centeredSlides={true}
					slidesPerView={1}
					spaceBetween={10}
					direction={isDesktop ? 'horizontal' : 'vertical'}
				>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Molde'}
							tag={'Development'}
							details={'Architecture studio'}
							url={'https://www.estudiomolde.com/'}
							showcaseUrl={
								'https://contra.com/p/o3YcvW6c-molde-architecture-studio-development'
							}
							src={moldeLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Indalo'}
							tag={'Development'}
							details={'Enterprises group'}
							url={'https://www.grupoindalo.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/WPl3g6WF-indalo-enterprises-group-development'
							}
							src={indaloLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Rancho'}
							tag={'Development'}
							details={'Rental business'}
							url={'https://bungalowselrancho.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/XFlM23XE-el-rancho-family-run-rental-business-design-and-development'
							}
							src={ranchoLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Clamaco'}
							tag={'Design'}
							details={'Construction company'}
							url={'https://clamaco.com.ar/'}
							src={clamacoLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Molde'}
							tag={'Development'}
							details={'Architecture studio'}
							url={'https://www.estudiomolde.com/'}
							showcaseUrl={
								'https://contra.com/p/o3YcvW6c-molde-architecture-studio-development'
							}
							src={moldeLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Indalo'}
							tag={'Development'}
							details={'Enterprises group'}
							url={'https://www.grupoindalo.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/WPl3g6WF-indalo-enterprises-group-development'
							}
							src={indaloLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Rancho'}
							tag={'Development'}
							details={'Rental business'}
							url={'https://bungalowselrancho.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/XFlM23XE-el-rancho-family-run-rental-business-design-and-development'
							}
							src={ranchoLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Clamaco'}
							tag={'Design'}
							details={'Construction company'}
							url={'https://clamaco.com.ar/'}
							src={clamacoLogo}
						/>
					</SwiperSlide>
				</Swiper>
			</MediaQuery>
			<MediaQuery minWidth={1280} maxWidth={1439}>
				<Swiper
					className="swiper"
					modules={[Autoplay]}
					autoplay={true}
					loop={true}
					centeredSlides={true}
					slidesPerView={1}
					spaceBetween={10}
					direction={isDesktop ? 'horizontal' : 'vertical'}
				>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Molde'}
							tag={'Development'}
							details={'Architecture studio'}
							url={'https://www.estudiomolde.com/'}
							showcaseUrl={
								'https://contra.com/p/o3YcvW6c-molde-architecture-studio-development'
							}
							src={moldeLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Indalo'}
							tag={'Development'}
							details={'Enterprises group'}
							url={'https://www.grupoindalo.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/WPl3g6WF-indalo-enterprises-group-development'
							}
							src={indaloLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Rancho'}
							tag={'Development'}
							details={'Rental business'}
							url={'https://bungalowselrancho.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/XFlM23XE-el-rancho-family-run-rental-business-design-and-development'
							}
							src={ranchoLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Clamaco'}
							tag={'Design'}
							details={'Construction company'}
							url={'https://clamaco.com.ar/'}
							src={clamacoLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Molde'}
							tag={'Development'}
							details={'Architecture studio'}
							url={'https://www.estudiomolde.com/'}
							showcaseUrl={
								'https://contra.com/p/o3YcvW6c-molde-architecture-studio-development'
							}
							src={moldeLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Indalo'}
							tag={'Development'}
							details={'Enterprises group'}
							url={'https://www.grupoindalo.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/WPl3g6WF-indalo-enterprises-group-development'
							}
							src={indaloLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Rancho'}
							tag={'Development'}
							details={'Rental business'}
							url={'https://bungalowselrancho.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/XFlM23XE-el-rancho-family-run-rental-business-design-and-development'
							}
							src={ranchoLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Clamaco'}
							tag={'Design'}
							details={'Construction company'}
							url={'https://clamaco.com.ar/'}
							src={clamacoLogo}
						/>
					</SwiperSlide>
				</Swiper>
			</MediaQuery>
			<MediaQuery minWidth={1440} maxWidth={1800}>
				<Swiper
					className="swiper"
					modules={[Autoplay]}
					autoplay={true}
					loop={true}
					centeredSlides={true}
					slidesPerView={1}
					spaceBetween={10}
					direction={isDesktop ? 'horizontal' : 'vertical'}
				>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Molde'}
							tag={'Development'}
							details={'Architecture studio'}
							url={'https://www.estudiomolde.com/'}
							showcaseUrl={
								'https://contra.com/p/o3YcvW6c-molde-architecture-studio-development'
							}
							src={moldeLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Indalo'}
							tag={'Development'}
							details={'Enterprises group'}
							url={'https://www.grupoindalo.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/WPl3g6WF-indalo-enterprises-group-development'
							}
							src={indaloLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Rancho'}
							tag={'Development'}
							details={'Rental business'}
							url={'https://bungalowselrancho.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/XFlM23XE-el-rancho-family-run-rental-business-design-and-development'
							}
							src={ranchoLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Clamaco'}
							tag={'Design'}
							details={'Construction company'}
							url={'https://clamaco.com.ar/'}
							src={clamacoLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Molde'}
							tag={'Development'}
							details={'Architecture studio'}
							url={'https://www.estudiomolde.com/'}
							showcaseUrl={
								'https://contra.com/p/o3YcvW6c-molde-architecture-studio-development'
							}
							src={moldeLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Indalo'}
							tag={'Development'}
							details={'Enterprises group'}
							url={'https://www.grupoindalo.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/WPl3g6WF-indalo-enterprises-group-development'
							}
							src={indaloLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Rancho'}
							tag={'Development'}
							details={'Rental business'}
							url={'https://bungalowselrancho.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/XFlM23XE-el-rancho-family-run-rental-business-design-and-development'
							}
							src={ranchoLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Clamaco'}
							tag={'Design'}
							details={'Construction company'}
							url={'https://clamaco.com.ar/'}
							src={clamacoLogo}
						/>
					</SwiperSlide>
				</Swiper>
			</MediaQuery>
			<MediaQuery minWidth={1801}>
				<Swiper
					className="swiper"
					modules={[Autoplay]}
					autoplay={true}
					loop={true}
					centeredSlides={false}
					slidesPerView={3}
					spaceBetween={10}
					direction={isDesktop ? 'horizontal' : 'vertical'}
				>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Molde'}
							tag={'Development'}
							details={'Architecture studio'}
							url={'https://www.estudiomolde.com/'}
							showcaseUrl={
								'https://contra.com/p/o3YcvW6c-molde-architecture-studio-development'
							}
							src={moldeLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Indalo'}
							tag={'Development'}
							details={'Enterprises group'}
							url={'https://www.grupoindalo.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/WPl3g6WF-indalo-enterprises-group-development'
							}
							src={indaloLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Rancho'}
							tag={'Development'}
							details={'Rental business'}
							url={'https://bungalowselrancho.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/XFlM23XE-el-rancho-family-run-rental-business-design-and-development'
							}
							src={ranchoLogo}
						/>{' '}
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Clamaco'}
							tag={'Design'}
							details={'Construction company'}
							url={'https://clamaco.com.ar/'}
							src={clamacoLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Molde'}
							tag={'Development'}
							details={'Architecture studio'}
							url={'https://www.estudiomolde.com/'}
							showcaseUrl={
								'https://contra.com/p/o3YcvW6c-molde-architecture-studio-development'
							}
							src={moldeLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Indalo'}
							tag={'Development'}
							details={'Enterprises group'}
							url={''}
							src={indaloLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Rancho'}
							tag={'Development'}
							details={'Rental business'}
							url={'https://bungalowselrancho.com.ar/'}
							showcaseUrl={
								'https://contra.com/p/XFlM23XE-el-rancho-family-run-rental-business-design-and-development'
							}
							src={ranchoLogo}
						/>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={'Clamaco'}
							tag={'Design'}
							details={'Construction company'}
							url={'https://clamaco.com.ar/'}
							src={clamacoLogo}
						/>
					</SwiperSlide>
				</Swiper>
			</MediaQuery>
		</>
	);
}
