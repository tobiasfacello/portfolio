import styled from "styled-components";

//* Components
import Container from "./Container";
import AsciiProfile from "../AsciiProfile";
import SocialButton from "../SocialButton";
import Text from "../Text";

//* Assets
import profilePicture from "../../assets/images/profile.png";
import Twitter from "../../assets/icons/Twitter.svg";
import Threads from "../../assets/icons/Threads.svg";
import Instagram from "../../assets/icons/Instagram.svg";
import Linkedin from "../../assets/icons/Linkedin.svg";
import Github from "../../assets/icons/Github.svg";
import Contra from "../../assets/icons/Contra.svg";

const StyledProfile = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	margin-top: 48px;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 0 20px;
	gap: 36px;
	order: -1;

	@media (min-width: 1280px) {
		grid-area: profile;
		order: unset;
		justify-content: center;
		margin: 36px 0;
		min-height: 450px;
	}
`;

export default function Profile() {
	return (
		<StyledProfile>
			<AsciiProfile src={profilePicture} />
			<Container
				w={"100%"}
				h={"auto"}
				direction={"column"}
				justify={"space-between"}
				align={"center"}
				gap={"24px"}
			>
				<Text
					as="h2"
					variant={"subtitle-snd"}
				>
					FIND ME AT
				</Text>
				<Container
					justify={"center"}
					align={"center"}
					gap={"8px"}
				>
					<SocialButton
						url={"https://www.x.com/fachebits"}
						src={Twitter}
						alt="Twitter"
					/>
					<SocialButton
						url={"https://www.threads.net/@fache.bits"}
						src={Threads}
						alt="Threads"
					/>
					<SocialButton
						url={"https://www.instagram.com/fache.bits/"}
						src={Instagram}
						alt="Instagram"
					/>
					<SocialButton
						url={
							"https://www.linkedin.com/in/tobiasfacello/"
						}
						src={Linkedin}
						alt="LinkedIn"
					/>
					<SocialButton
						url={"https://www.github.com/tobiasfacello"}
						src={Github}
						alt="GitHub"
					/>
					<SocialButton
						url={"https://contra.com/tobiasfacello"}
						src={Contra}
						alt="Contra"
					/>
				</Container>
			</Container>
		</StyledProfile>
	);
}
