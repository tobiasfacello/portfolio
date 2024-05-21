import MediaQuery from "react-responsive";

import Header from "../components/Containers/Header";
import Profile from "../components/Containers/Profile";
import About from "../components/Containers/About";
import Projects from "../components/Containers/Projects";
import Skills from "../components/Containers/Skills";
import Works from "../components/Containers/Works";
import Footer from "../components/Containers/Footer";
import Container from "../components/Containers/Container";

function Home() {
	return (
		<>
			{/* Mobile Layout */}
			<MediaQuery minWidth={375} maxWidth={959}>
				<Container
					w={"100vw"}
					h={"calc(100vh - 64px)"}
					direction={"column"}
				>
					<Header></Header>
					<Profile></Profile>
					<About></About>
				</Container>
				<Projects></Projects>
				<Skills></Skills>
				<Works></Works>
				<Footer></Footer>
			</MediaQuery>
			{/* Tablet Layout */}
			<MediaQuery minWidth={960} maxWidth={1439}>
				<Container
					w={"100vw"}
					h={"calc(100vh - 64px)"}
					direction={"column"}
				>
					<Header></Header>
					<Profile></Profile>
					<About></About>
				</Container>
				<Projects></Projects>
				<Skills></Skills>
				<Works></Works>
				<Footer></Footer>
			</MediaQuery>
			{/* Desktop Layout */}
			<MediaQuery minWidth={1440}>
				<Container
					w={"100vw"}
					h={"calc(90vh - 64px)"}
					direction={"column"}
					justify={"center"}
					align={"center"}
				>
					<Header></Header>
					<Container
						w={"100%"}
						justify={"center"}
						align={"center"}
						style={"border-top: 1px solid var(--secondary-60);"}
					>
						<Container
							w={"90%"}
							justify={"center"}
							align={"center"}
						>
							<About></About>
							<Profile></Profile>
							<Projects></Projects>
						</Container>
					</Container>
				</Container>

				<Container
					w={"100%"}
					h={"60vh"}
					justify={"center"}
					align={"start"}
					style={"border-top: 1px solid var(--secondary-60);"}
				>
					<Container w={"90%"} justify={"center"} align={"center"}>
						<Skills></Skills>
						<Works></Works>
					</Container>
				</Container>
				<Footer></Footer>
			</MediaQuery>
		</>
	);
}

export default Home;
