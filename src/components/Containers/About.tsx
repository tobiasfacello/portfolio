import styled from "styled-components";
import { useMediaQuery } from "react-responsive";

//* Components
import Container from "./Container";
import Text from "../../components/Text";
import IconFrame from "../../components/IconFrame";
import SocialButton from "../../components/SocialButton";

//* Assets
import arIcon from "../../assets/images/ar.png";
import hoobiesIcon from "../../assets/images/hobbies.png";
import Twitter from "../../assets/icons/Twitter.svg";
import Instagram from "../../assets/icons/Instagram.svg";
import Linkedin from "../../assets/icons/Linkedin.svg";
import Github from "../../assets/icons/Github.svg";

const StyledAbout = styled.div<{}>`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	padding: 0 20px;

	@media (min-width: 960px) {
		& {
			border-left: 1px solid var(--secondary-60);
			border-right: 1px solid var(--secondary-60);
		}
	}
`;

export default function About() {
	const isDesktop = useMediaQuery({ minWidth: "960px" });

	return (
		<StyledAbout>
			<Container
				p={isDesktop ? ["zero", "xxxl", "zero", "xxxl"] : ""}
				direction={"column"}
				justify={"space-evenly"}
				align={isDesktop ? "start" : "center"}
			>
				<Text
					variant={
						isDesktop ? "subtitle-fst desktop" : "subtitle-fst"
					}
					p={["zero"]}
					m={["l", "zero", "m", "zero"]}
				>
					About me
				</Text>
				<Text
					variant={isDesktop ? "paragraph desktop" : "paragraph"}
					m={["zero", "zero", "s", "zero"]}
				>
					I’m Tobías, a guy from Argentina
					<IconFrame src={arIcon}></IconFrame>
					working as developer & designer. Mostly building and
					improving digital experiences.
				</Text>
				<Text
					variant={isDesktop ? "paragraph desktop" : "paragraph"}
					m={["zero", "zero", "m", "zero"]}
				>
					I’m always trying to polish both my soft and hard skills
					while learning or working on new things. And a bunch of
					hobbies!
					<IconFrame src={hoobiesIcon}></IconFrame>
				</Text>
				<Container
					h={"auto"}
					direction={"column"}
					justify={"center"}
					align={"end"}
				>
					<Text
						variant={"subtitle-snd"}
						m={["zero", "zero", "m", "zero"]}
					>
						FIND ME AT
					</Text>
					<Container
						m={["zero", "zero", "l", "zero"]}
						justify={"end"}
						align={"center"}
						gap={"var(--xxs)"}
					>
						<SocialButton src={Twitter}></SocialButton>
						<SocialButton src={Instagram}></SocialButton>
						<SocialButton src={Linkedin}></SocialButton>
						<SocialButton src={Github}></SocialButton>
					</Container>
				</Container>
			</Container>
		</StyledAbout>
	);
}
