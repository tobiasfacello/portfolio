import styled from "styled-components";
import MediaQuery from "react-responsive";

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
		}
	}

	@media (min-width: 1280px) {
		& {
			border-left: 1px solid var(--secondary-60);
			border-right: 1px solid var(--secondary-60);
			padding: 0 16px;
			height: 100%;
		}
	}

	@media (min-width: 1440px) {
		& {
			padding: 0 21px;
		}
	}

	@media (min-width: 1800px) {
		& {
			padding: 0 20px;
		}
	}
`;

export default function About() {
	return (
		<StyledAbout>
			<MediaQuery minWidth={375} maxWidth={767}>
				<Container
					direction={"column"}
					justify={"space-evenly"}
					align={"center"}
				>
					<Text
						variant={"subtitle-fst"}
						p={["zero"]}
						m={["l", "zero", "m", "zero"]}
					>
						About me
					</Text>
					<Text
						variant={"paragraph"}
						m={["zero", "zero", "s", "zero"]}
					>
						I’m Tobías, a guy from Argentina
						<IconFrame src={arIcon}></IconFrame>
						working as developer & designer. Mostly building and
						improving digital experiences.
					</Text>
					<Text
						variant={"paragraph"}
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
							<SocialButton
								url={"https://www.x.com/fachedev"}
								src={Twitter}
							></SocialButton>
							<SocialButton
								url={"https://www.instagram.com/fachedev/"}
								src={Instagram}
							></SocialButton>
							<SocialButton
								url={
									"https://www.linkedin.com/in/tobiasfacello/"
								}
								src={Linkedin}
							></SocialButton>
							<SocialButton
								url={"https://www.github.com/tobiasfacello"}
								src={Github}
							></SocialButton>
						</Container>
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={768} maxWidth={959}>
				<Container
					w={"80%"}
					direction={"column"}
					justify={"space-evenly"}
					align={"center"}
				>
					<Text
						variant={"subtitle-fst"}
						p={["zero"]}
						m={["l", "zero", "m", "zero"]}
					>
						About me
					</Text>
					<Text
						variant={"paragraph"}
						m={["zero", "zero", "s", "zero"]}
					>
						I’m Tobías, a guy from Argentina
						<IconFrame src={arIcon}></IconFrame>
						working as developer & designer. Mostly building and
						improving digital experiences.
					</Text>
					<Text
						variant={"paragraph"}
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
							<SocialButton
								url={"https://www.x.com/fachedev"}
								src={Twitter}
							></SocialButton>
							<SocialButton
								url={"https://www.instagram.com/fachedev/"}
								src={Instagram}
							></SocialButton>
							<SocialButton
								url={
									"https://www.linkedin.com/in/tobiasfacello/"
								}
								src={Linkedin}
							></SocialButton>
							<SocialButton
								url={"https://www.github.com/tobiasfacello"}
								src={Github}
							></SocialButton>
						</Container>
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={960} maxWidth={1279}>
				<Container
					w={"90%"}
					p={["zero", "xxxl", "zero", "xxxl"]}
					direction={"column"}
					justify={"space-evenly"}
					align={"center"}
				>
					<Text
						variant={"subtitle-fst desktop"}
						p={["zero"]}
						m={["l", "zero", "xl", "zero"]}
					>
						About me
					</Text>
					<Text
						variant={"paragraph"}
						m={["zero", "zero", "s", "zero"]}
					>
						I’m Tobías, a guy from Argentina
						<IconFrame src={arIcon}></IconFrame>
						working as developer & designer. Mostly building and
						improving digital experiences.
					</Text>
					<Text
						variant={"paragraph"}
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
							<SocialButton
								url={"https://www.x.com/fachedev"}
								src={Twitter}
							></SocialButton>
							<SocialButton
								url={"https://www.instagram.com/fachedev/"}
								src={Instagram}
							></SocialButton>
							<SocialButton
								url={
									"https://www.linkedin.com/in/tobiasfacello/"
								}
								src={Linkedin}
							></SocialButton>
							<SocialButton
								url={"https://www.github.com/tobiasfacello"}
								src={Github}
							></SocialButton>
						</Container>
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1280} maxWidth={1439}>
				<Container
					w={"80%"}
					direction={"column"}
					justify={"space-evenly"}
					align={"center"}
				>
					<Text
						variant={"subtitle-fst"}
						p={["zero"]}
						m={["l", "zero", "m", "zero"]}
					>
						About me
					</Text>
					<Text
						variant={"paragraph"}
						m={["zero", "zero", "s", "zero"]}
					>
						I’m Tobías, a guy from Argentina
						<IconFrame src={arIcon}></IconFrame>
						working as developer & designer. Mostly building and
						improving digital experiences.
					</Text>
					<Text
						variant={"paragraph"}
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
							<SocialButton
								url={"https://www.x.com/fachedev"}
								src={Twitter}
							></SocialButton>
							<SocialButton
								url={"https://www.instagram.com/fachedev/"}
								src={Instagram}
							></SocialButton>
							<SocialButton
								url={
									"https://www.linkedin.com/in/tobiasfacello/"
								}
								src={Linkedin}
							></SocialButton>
							<SocialButton
								url={"https://www.github.com/tobiasfacello"}
								src={Github}
							></SocialButton>
						</Container>
					</Container>
				</Container>
			</MediaQuery>

			<MediaQuery minWidth={1440} maxWidth={1800}>
				<Container
					p={["zero", "l", "zero", "l"]}
					direction={"column"}
					justify={"space-evenly"}
					align={"start"}
				>
					<Text
						variant={"subtitle-fst desktop"}
						p={["zero"]}
						m={["l", "zero", "m", "zero"]}
					>
						About me
					</Text>
					<Text
						variant={"paragraph desktop"}
						m={["zero", "zero", "s", "zero"]}
					>
						I’m Tobías, a guy from Argentina
						<IconFrame src={arIcon}></IconFrame>
						working as developer & designer. Mostly building and
						improving digital experiences.
					</Text>
					<Text
						variant={"paragraph desktop"}
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
							<SocialButton
								url={"https://www.x.com/fachedev"}
								src={Twitter}
							></SocialButton>
							<SocialButton
								url={"https://www.instagram.com/fachedev/"}
								src={Instagram}
							></SocialButton>
							<SocialButton
								url={
									"https://www.linkedin.com/in/tobiasfacello/"
								}
								src={Linkedin}
							></SocialButton>
							<SocialButton
								url={"https://www.github.com/tobiasfacello"}
								src={Github}
							></SocialButton>
						</Container>
					</Container>
				</Container>
			</MediaQuery>

			<MediaQuery minWidth={1801}>
				<Container
					p={["zero", "xl", "zero", "xl"]}
					direction={"column"}
					justify={"space-evenly"}
					align={"start"}
				>
					<Text
						variant={"subtitle-fst desktop"}
						p={["zero"]}
						m={["l", "zero", "m", "zero"]}
					>
						About me
					</Text>
					<Text
						variant={"paragraph desktop"}
						m={["zero", "zero", "s", "zero"]}
					>
						I’m Tobías, a guy from Argentina
						<IconFrame src={arIcon}></IconFrame>
						working as developer & designer. Mostly building and
						improving digital experiences.
					</Text>
					<Text
						variant={"paragraph desktop"}
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
							<SocialButton
								url={"https://www.x.com/fachedev"}
								src={Twitter}
							></SocialButton>
							<SocialButton
								url={"https://www.instagram.com/fachedev/"}
								src={Instagram}
							></SocialButton>
							<SocialButton
								url={
									"https://www.linkedin.com/in/tobiasfacello/"
								}
								src={Linkedin}
							></SocialButton>
							<SocialButton
								url={"https://www.github.com/tobiasfacello"}
								src={Github}
							></SocialButton>
						</Container>
					</Container>
				</Container>
			</MediaQuery>
		</StyledAbout>
	);
}
