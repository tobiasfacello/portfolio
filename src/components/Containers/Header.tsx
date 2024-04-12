import styled from "styled-components";

//* Components
import Container from "./Container";
import Logo from "../Logo";

const StyledHeader = styled.div``;

function Header() {
	return (
		<StyledHeader>
			<Container
				w={"100%"}
				m={["xs", "zero", "xs", "zero"]}
				justify={"center"}
				align={"center"}
			>
				<Logo>FACHE.</Logo>
			</Container>
		</StyledHeader>
	);
}

export default Header;
