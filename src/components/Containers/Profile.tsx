import styled from "styled-components";

//* Components
import Container from "./Container";
import ImageFrame from "../ImageFrame";
import SocialButton from "../SocialButton";
import Text from "../Text";

//* Assets
import profilePicture from "../../assets/images/profile.jpg";
import Twitter from "../../assets/icons/Twitter.svg";
import Threads from "../../assets/icons/Threads.svg";
import Instagram from "../../assets/icons/Instagram.svg";
import Linkedin from "../../assets/icons/Linkedin.svg";
import Github from "../../assets/icons/Github.svg";
import Contra from "../../assets/icons/Contra.svg";

const StyledProfile = styled.div<{}>`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 0 20px;
`;

export default function Profile() {
	return (
		<StyledProfile>
			<ImageFrame
				src={profilePicture}
				p={["0"]}
				m={["48", "0", "36", "0"]}
			/>
			<Container
				w={"100%"}
				h={"auto"}
				direction={"column"}
				justify={"space-between"}
				align={"center"}
			>
				<Text
					variant={"subtitle-snd"}
					m={["0", "0", "24", "0"]}
				>
					FIND ME AT
				</Text>
				<Container
					justify={"center"}
					align={"center"}
					gap={"8px"}
				>
					<SocialButton
						url={"https://www.x.com/fachedev"}
						src={Twitter}
					/>
					<SocialButton
						url={"https://www.threads.net/@fache.dev"}
						src={Threads}
					/>
					<SocialButton
						url={"https://www.instagram.com/fache.dev/"}
						src={Instagram}
					/>
					<SocialButton
						url={
							"https://www.linkedin.com/in/tobiasfacello/"
						}
						src={Linkedin}
					/>
					<SocialButton
						url={"https://www.github.com/tobiasfacello"}
						src={Github}
					/>
					<SocialButton
						url={"https://contra.com/tobiasfacello"}
						src={Contra}
					/>
				</Container>
			</Container>
		</StyledProfile>
	);
}
