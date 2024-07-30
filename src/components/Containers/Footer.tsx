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
	border-top: 1px solid var(--secondary-60);

	& a {
		color: var(--text);
	}
`;

function Footer() {
	const currentDate = new Date();

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
					Have an interesting idea you'd like to build?{" "}
					<a href="https://cal.com/tobiasfacello">
						<u>Let's talk.</u>
					</a>
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
					{currentDate.getFullYear()} © Tobias Facello
				</Text>
			</Container>
		</StyledFooter>
	);
}

export default Footer;
