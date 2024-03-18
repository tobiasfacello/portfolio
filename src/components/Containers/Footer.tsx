import styled from "styled-components";

//* Components
import Container from "./Container";
import Text from "../Text";

const StyledFooter = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 0 20px;
	border-top: 1px solid var(--secondary);

	& .projects__title {
		width: 100%;
		display: flex;
		justify-content: start;
		align-items: center;
	}
`;

function Footer() {
	return (
		<StyledFooter>
			<Container
				w={"80%"}
				m={["l", "zero", "s", "zero"]}
				justify={"center"}
				align={"center"}
			>
				<Text
					variant={"details-fst"}
					m={["zero", "zero", "zero", "zero"]}
				>
					Have an interesting, stupid or crazy idea you'd like to
					build? <u>Let's talk.</u>
				</Text>
			</Container>
			<Container
				direction={"column"}
				justify={"center"}
				align={"center"}
				m={["zero", "zero", "l", "zero"]}
			>
				<Text
					variant={"details-fst"}
					m={["zero", "zero", "zero", "zero"]}
				>
					2024 © Tobias Facello
				</Text>
			</Container>
		</StyledFooter>
	);
}

export default Footer;
