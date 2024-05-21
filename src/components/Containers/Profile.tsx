import styled from "styled-components";

//* Components
import ImageFrame from "../ImageFrame";

//* Assets
import profilePicture from "../../assets/images/profile.jpg";

const StyledProfile = styled.div<{}>`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 0 20px;
`;

export default function About() {
	return (
		<StyledProfile>
			<ImageFrame
				src={profilePicture}
				p={["zero"]}
				m={["zero", "zero", "zero", "zero"]}
			></ImageFrame>
		</StyledProfile>
	);
}
