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
				m={["36", "0", "20", "0"]}
				justify={"center"}
				align={"center"}
			>
				<Text
					variant={"details-fst"}
					m={["0", "0", "0", "0"]}
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
				m={["0", "0", "36", "0"]}
			>
				<Text
					variant={"details-fst"}
					m={["0", "0", "0", "0"]}
				>
					{currentDate.getFullYear()} © Tobias Facello
				</Text>
			</Container>
		</StyledFooter>
	);
}

export default Footer;
