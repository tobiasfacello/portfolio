import { useRef, useEffect } from "react";
import styled from "styled-components";

//* Components
import Container from "./Container";
import AsciiLogo from "../AsciiLogo";

//? Context
import { useSplash } from "../../context/SplashContext";

const StyledHeader = styled.header`
	position: relative;
	width: 100%;
`;

function Header() {
	const { isSplashComplete, headerLogoRef } = useSplash();
	const containerRef = useRef<HTMLDivElement>(null);

	// Expose the container ref for splash logo position measurement
	useEffect(() => {
		headerLogoRef.current = containerRef.current;
	}, [headerLogoRef]);

	return (
		<StyledHeader>
			<Container
				w={"100%"}
				justify={"center"}
				align={"center"}
			>
				<div ref={containerRef}>
					{isSplashComplete && <AsciiLogo skipAnimation={true} />}
				</div>
			</Container>
		</StyledHeader>
	);
}

export default Header;
