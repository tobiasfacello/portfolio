import styled from "styled-components";
import MediaQuery from "react-responsive";

//* Components
import Container from "./Container";
import Text from "../../components/Text";

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
			height: 100%;
			padding: 0 15px;
			border-right: 1px solid var(--secondary-60);
		}
	}

	@media (min-width: 1440px) {
		& {
			padding: 0 20px;
		}
	}

	@media (min-width: 1800px) {
		& {
			padding: 0 19px;
		}
	}
`;

export default function About() {
	return (
		<StyledAbout>
			<MediaQuery minWidth={360} maxWidth={767}>
				<Container
					h={"100%"}
					w={"100%"}
					maxW={"500px"}
					direction={"column"}
					justify={"space-evenly"}
					align={"center"}
				>
					<Container
						h={"auto"}
						direction={"column"}
						justify={"center"}
						align={"start"}
					>
						<Text
							variant={"subtitle-snd"}
							p={["0"]}
							m={["48", "0", "36", "0"]}
							alignment={"left"}
						>
							ABOUT ME
						</Text>
					</Container>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						I’m Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "36", "0"]}
						alignment={"left"}
					>
						I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.
					</Text>

				</Container>
			</MediaQuery>
			<MediaQuery minWidth={768} maxWidth={959}>
				<Container
					w={"80%"}
					direction={"column"}
					justify={"space-evenly"}
					align={"flex-start"}
				>
					<Text
						variant={"subtitle-snd"}
						p={["0"]}
						m={["48", "0", "36", "0"]}
					>
						ABOUT ME
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}

					>
						I’m Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}

					>
						Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}

					>
						Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "36", "0"]}
						alignment={"left"}

					>
						I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.
					</Text>

				</Container>
			</MediaQuery>
			<MediaQuery minWidth={960} maxWidth={1279}>
				<Container
					w={"80%"}
					direction={"column"}
					justify={"space-evenly"}
					align={"flex-start"}
				>
					<Text
						variant={"subtitle-snd"}
						p={["0"]}
						alignment={"left"}
						m={["48", "0", "36", "0"]}
					>
						ABOUT ME
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						I’m Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "36", "0"]}
						alignment={"left"}
					>
						I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.
					</Text>

				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1280} maxWidth={1339}>
				<Container
					w={"90%"}
					direction={"column"}
					justify={"space-between"}
					align={"flex-start"}
				>
					<Text
						variant={"subtitle-snd"}
						p={["0"]}
						m={["48", "0", "36", "0"]}
						alignment={"left"}
					>
						ABOUT ME
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						I’m Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "36", "0"]}
						alignment={"left"}
					>
						I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.
					</Text>

				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1340} maxWidth={1439}>
				<Container
					w={"85%"}
					h={"100%"}
					direction={"column"}
					justify={"space-between"}
					align={"flex-start"}
				>
					<Text
						variant={"subtitle-snd"}
						p={["0"]}
						m={["48", "0", "36", "0"]}
					>
						ABOUT ME
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						I’m Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.
					</Text>
					<Text
						variant={"paragraph"}
						m={["0", "0", "36", "0"]}
						alignment={"left"}
					>
						I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.
					</Text>

				</Container>
			</MediaQuery>

			<MediaQuery minWidth={1440} maxWidth={1800}>
				<Container
					w={"80%"}
					direction={"column"}
					justify={"space-between"}
					align={"flex-start"}
				>
					<Text
						variant={"subtitle-snd"}
						p={["0"]}
						m={["48", "0", "24", "0"]}
					>
						ABOUT ME
					</Text>
					<Text
						variant={"paragraph desktop"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						I’m Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.
					</Text>
					<Text
						variant={"paragraph desktop"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.
					</Text>
					<Text
						variant={"paragraph desktop"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.
					</Text>
					<Text
						variant={"paragraph desktop"}
						m={["0", "0", "36", "0"]}
						alignment={"left"}
					>
						I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.
					</Text>

				</Container>
			</MediaQuery>

			<MediaQuery minWidth={1801}>
				<Container
					w={"75%"}
					direction={"column"}
					justify={"space-between"}
					align={"start"}
				>
					<Text
						variant={"subtitle-snd"}
						p={["0"]}
						m={["48", "0", "36", "0"]}
					>
						ABOUT ME
					</Text>
					<Text
						variant={"paragraph desktop"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						I’m Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.
					</Text>
					<Text
						variant={"paragraph desktop"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.
					</Text>
					<Text
						variant={"paragraph desktop"}
						m={["0", "0", "12", "0"]}
						alignment={"left"}
					>
						Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.
					</Text>
					<Text
						variant={"paragraph desktop"}
						m={["0", "0", "36", "0"]}
						alignment={"left"}
					>
						I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.
					</Text>
				</Container>
			</MediaQuery>
		</StyledAbout>
	);
}
