import MediaQuery, { useMediaQuery } from "react-responsive";
import { Swiper, SwiperSlide } from "swiper/react";

//* Swiper Modules
import { Autoplay } from "swiper/modules";

//* Swiper Styles
import "swiper/css";
import "./swiper.style.css";

//* Components
import WorkCard from "../WorkCard";

//* Assets
import moldeLogo from "../../assets/works/molde.svg";
import indaloLogo from "../../assets/works/indalo.svg";
import clamacoLogo from "../../assets/works/clamaco.svg";

export default function WorkCardsCarousel() {
	const isDesktop = useMediaQuery({ minWidth: 960 });

	return (
		<>
			<MediaQuery minWidth={360} maxWidth={959}>
				<WorkCard
					title={"Molde"}
					tag={"Development"}
					details={"Landing Page for an architecture studio."}
					url={"https://www.estudiomolde.com/"}
					src={moldeLogo}
				></WorkCard>
				<WorkCard
					title={"Indalo"}
					tag={"Development"}
					details={"Landing Page for an enterprises group."}
					url={"https://www.grupoindalo.com.ar/"}
					src={indaloLogo}
				></WorkCard>
				<WorkCard
					title={"Clamaco"}
					tag={"Design"}
					details={"Landing Page for a construction company."}
					url={"https://clamaco.com.ar/"}
					src={clamacoLogo}
				></WorkCard>
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
					direction={isDesktop ? "horizontal" : "vertical"}
				>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Molde"}
							tag={"Development"}
							details={"Landing Page for an architecture studio."}
							url={"https://www.estudiomolde.com/"}
							src={moldeLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Indalo"}
							tag={"Development"}
							details={"Landing Page for an enterprises group."}
							url={"https://www.grupoindalo.com.ar/"}
							src={indaloLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Clamaco"}
							tag={"Design"}
							details={"Landing Page for a construction company."}
							url={"https://clamaco.com.ar/"}
							src={clamacoLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Molde"}
							tag={"Development"}
							details={"Landing Page for an architecture studio."}
							url={"https://www.estudiomolde.com/"}
							src={moldeLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Indalo"}
							tag={"Development"}
							details={"Landing Page for an enterprises group."}
							url={"https://www.grupoindalo.com.ar/"}
							src={indaloLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Clamaco"}
							tag={"Design"}
							details={"Landing Page for a construction company."}
							url={"https://clamaco.com.ar/"}
							src={clamacoLogo}
						></WorkCard>
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
					direction={isDesktop ? "horizontal" : "vertical"}
				>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Molde"}
							tag={"Development"}
							details={"Landing Page for an architecture studio."}
							url={"https://www.estudiomolde.com/"}
							src={moldeLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Indalo"}
							tag={"Development"}
							details={"Landing Page for an enterprises group."}
							url={"https://www.grupoindalo.com.ar/"}
							src={indaloLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Clamaco"}
							tag={"Design"}
							details={"Landing Page for a construction company."}
							url={"https://clamaco.com.ar/"}
							src={clamacoLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Molde"}
							tag={"Development"}
							details={"Landing Page for an architecture studio."}
							url={"https://www.estudiomolde.com/"}
							src={moldeLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Indalo"}
							tag={"Development"}
							details={"Landing Page for an enterprises group."}
							url={"https://www.grupoindalo.com.ar/"}
							src={indaloLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Clamaco"}
							tag={"Design"}
							details={"Landing Page for a construction company."}
							url={"https://clamaco.com.ar/"}
							src={clamacoLogo}
						></WorkCard>
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
					direction={isDesktop ? "horizontal" : "vertical"}
				>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Molde"}
							tag={"Development"}
							details={"Landing Page for an architecture studio."}
							url={"https://www.estudiomolde.com/"}
							src={moldeLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Indalo"}
							tag={"Development"}
							details={"Landing Page for an enterprises group."}
							url={"https://www.grupoindalo.com.ar/"}
							src={indaloLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Clamaco"}
							tag={"Design"}
							details={"Landing Page for a construction company."}
							url={"https://clamaco.com.ar/"}
							src={clamacoLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Molde"}
							tag={"Development"}
							details={"Landing Page for an architecture studio."}
							url={"https://www.estudiomolde.com/"}
							src={moldeLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Indalo"}
							tag={"Development"}
							details={"Landing Page for an enterprises group."}
							url={"https://www.grupoindalo.com.ar/"}
							src={indaloLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Clamaco"}
							tag={"Design"}
							details={"Landing Page for a construction company."}
							url={"https://clamaco.com.ar/"}
							src={clamacoLogo}
						></WorkCard>
					</SwiperSlide>
				</Swiper>
			</MediaQuery>
			<MediaQuery minWidth={1801}>
				<Swiper
					className="swiper"
					modules={[Autoplay]}
					autoplay={true}
					loop={true}
					centeredSlides={true}
					slidesPerView={3}
					spaceBetween={10}
					direction={isDesktop ? "horizontal" : "vertical"}
				>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Molde"}
							tag={"Development"}
							details={"Landing Page for an architecture studio."}
							url={"https://www.estudiomolde.com/"}
							src={moldeLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Indalo"}
							tag={"Development"}
							details={"Landing Page for an enterprises group."}
							url={"https://www.grupoindalo.com.ar/"}
							src={indaloLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Clamaco"}
							tag={"Design"}
							details={"Landing Page for a construction company."}
							url={"https://clamaco.com.ar/"}
							src={clamacoLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Molde"}
							tag={"Development"}
							details={"Landing Page for an architecture studio."}
							url={"https://www.estudiomolde.com/"}
							src={moldeLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Indalo"}
							tag={"Development"}
							details={"Landing Page for an enterprises group."}
							url={""}
							src={indaloLogo}
						></WorkCard>
					</SwiperSlide>
					<SwiperSlide className="swiper-slide">
						<WorkCard
							title={"Clamaco"}
							tag={"Design"}
							details={"Landing Page for a construction company."}
							url={"https://clamaco.com.ar/"}
							src={clamacoLogo}
						></WorkCard>
					</SwiperSlide>
				</Swiper>
			</MediaQuery>
		</>
	);
}
