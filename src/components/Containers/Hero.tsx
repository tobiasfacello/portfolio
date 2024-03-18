import styled from "styled-components";

//* Components
import Text from "../../components/Text";
import Logo from "../../components/Logo";
import ImageFrame from "../../components/ImageFrame";
import IconFrame from "../../components/IconFrame";
import SocialButton from "../../components/SocialButton";

//* Assets
import profilePicture from "../../assets/images/profile.jpg";
import arIcon from "../../assets/images/ar.png";
import hoobiesIcon from "../../assets/images/hoobies.png";

import Twitter from "../../assets/icons/Twitter.svg";
import Instagram from "../../assets/icons/Instagram.svg";
import Linkedin from "../../assets/icons/Linkedin.svg";
import Github from "../../assets/icons/Github.svg";

const StyledHero = styled.div<{}>`
	width: 100%;
	height: calc(100vh - 84px);
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	padding: 0 20px;

	& .hero__social-media {
		display: flex;
		flex-direction: column;
		align-items: end;
		margin-bottom: var(--l);
	}

	& .social-media__buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--xxs);
	}
`;

function Hero() {
	return (
		<StyledHero>
			<Logo>FACHE.</Logo>
			<ImageFrame
				src={profilePicture}
				p={["zero"]}
				m={["xxxl", "zero", "zero", "zero"]}
			></ImageFrame>
			<div className="hero__info">
				<Text
					variant={"subtitle-fst"}
					p={["zero"]}
					m={["l", "zero", "m", "zero"]}
				>
					About me
				</Text>
				<Text variant={"paragraph"} m={["zero", "zero", "s", "zero"]}>
					I’m Tobías, a guy from Argentina
					<IconFrame src={arIcon}></IconFrame>
					working as developer & designer. Mostly building and
					improving digital experiences.
				</Text>
				<Text variant={"paragraph"} m={["zero", "zero", "m", "zero"]}>
					I’m always trying to polish both my soft and hard skills
					while learning or working on new things. And a bunch of
					hoobies!
					<IconFrame src={hoobiesIcon}></IconFrame>
				</Text>
				<div className="hero__social-media">
					<Text
						variant={"subtitle-snd"}
						m={["zero", "zero", "m", "zero"]}
					>
						FIND ME AT
					</Text>
					<div className="social-media__buttons">
						<SocialButton src={Twitter}></SocialButton>
						<SocialButton src={Instagram}></SocialButton>
						<SocialButton src={Linkedin}></SocialButton>
						<SocialButton src={Github}></SocialButton>
					</div>
				</div>
			</div>
		</StyledHero>
	);
}

export default Hero;
