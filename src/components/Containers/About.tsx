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

	@media (min-width: 1280px) {
		& {			
			height: 100%;
			border-right: 1px solid var(--secondary-60);
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
					m={['36', '0', '36', '0']}
					maxW={"500px"}
					direction={"column"}
					justify={"space-between"}
					align={"center"}
					gap={"24px"}
				>
					<Container
						h={"auto"}
						direction={"column"}
						justify={"center"}
						align={"start"}
					>
						<Text
							variant={"subtitle-snd"}
						>
							ABOUT ME
						</Text>
					</Container>
					<Container
						display={"flex"}
						direction={"column"}
						justify={"space-between"}
						align={"flex-start"}
						gap={"12px"}
					>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							I’m Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.
						</Text>
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={768} maxWidth={959}>
				<Container
					w={"80%"}
					m={['36', '0', '36', '0']}
					direction={"column"}
					justify={"space-between"}
					align={"center"}
					gap={"24px"}
				>
					<Container
						h={"auto"}
						direction={"column"}
						justify={"center"}
						align={"flex-start"}
					>

						<Text
							variant={"subtitle-snd"}
						>
							ABOUT ME
						</Text>
					</Container>
					<Container
						display={"flex"}
						direction={"column"}
						justify={"space-between"}
						align={"flex-start"}
						gap={"12px"}
					>

						<Text
							variant={"paragraph"}
							alignment={"left"}

						>
							I’m Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}

						>
							Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}

						>
							Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}

						>
							I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.
						</Text>
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={960} maxWidth={1279}>
				<Container
					w={"80%"}
					m={['36', '0', '36', '0']}
					direction={"column"}
					justify={"space-between"}
					align={"center"}
					gap={"24px"}
				>
					<Container
						h={"auto"}
						direction={"column"}
						justify={"center"}
						align={"flex-start"}
					>
						<Text
							variant={"subtitle-snd"}
							alignment={"left"}
						>
							ABOUT ME
						</Text>
					</Container>
					<Container
						display={"flex"}
						direction={"column"}
						justify={"space-between"}
						align={"flex-start"}
						gap={"12px"}
					>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							I’m Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.
						</Text>
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1280} maxWidth={1339}>
				<Container
					w={"100%"} h={"100%"} minH={"450px"} m={['36', '0', '36', '0']} direction={"column"} justify={"space-between"} align={"center"} gap={"36px"}>
					<Container
						h={"auto"}
						direction={"column"}
						justify={"center"}
						align={"flex-start"}
					>
						<Text
							variant={"subtitle-snd"}
							alignment={"left"}
						>
							ABOUT ME
						</Text>
					</Container>
					<Container
						display={"flex"}
						direction={"column"}
						justify={"space-between"}
						align={"flex-start"}
						gap={"20px"}
					>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							I’m Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.
						</Text>
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1340} maxWidth={1439}>
				<Container w={"100%"} h={"100%"} minH={"450px"} m={['36', '0', '36', '0']} direction={"column"} justify={"space-between"} align={"center"} gap={"36px"}>
					<Container
						h={"auto"}
						direction={"column"}
						justify={"center"}
						align={"flex-start"}
					>
						<Text
							variant={"subtitle-snd"}
						>
							ABOUT ME
						</Text>
					</Container>
					<Container
						display={"flex"}
						direction={"column"}
						justify={"space-between"}
						align={"flex-start"}
						gap={"20px"}
					>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							I’m Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.
						</Text>
						<Text
							variant={"paragraph"}
							alignment={"left"}
						>
							I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.
						</Text>
					</Container>
				</Container>
			</MediaQuery>

			<MediaQuery minWidth={1440} maxWidth={1800}>
				<Container w={"100%"} h={"100%"} minH={"490px"} m={['36', '0', '36', '0']} direction={"column"} justify={"space-between"} align={"center"} gap={"36px"}>
					<Container
						w={"100%"}
						h={"100%"}
						direction={"column"}
						justify={"space-between"}
						align={"flex-start"}
					>
						<Text
							variant={"subtitle-snd"}
						>
							ABOUT ME
						</Text>
					</Container>
					<Container
						display={"flex"}
						direction={"column"}
						justify={"space-between"}
						align={"flex-start"}
						gap={"20px"}
					>
						<Text
							variant={"paragraph desktop"}
							alignment={"left"}
						>
							I’m Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.
						</Text>
						<Text
							variant={"paragraph desktop"}
							alignment={"left"}
						>
							Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.
						</Text>
						<Text
							variant={"paragraph desktop"}
							alignment={"left"}
						>
							Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.
						</Text>
						<Text
							variant={"paragraph desktop"}
							alignment={"left"}
						>
							I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.
						</Text>

					</Container>
				</Container>
			</MediaQuery>

			<MediaQuery minWidth={1801}>
				<Container w={"100%"} h={"100%"} minH={"530px"} m={['36', '0', '36', '0']} direction={"column"} justify={"space-between"} align={"center"} gap={"36px"}>

					<Container
						h={"auto"}
						w={"80%"}
						direction={"column"}
						justify={"center"}
						align={"flex-start"}
					>
						<Text variant={"subtitle-snd"}>
							ABOUT ME
						</Text>
					</Container>
					<Container
						w={"80%"}
						display={"flex"}
						direction={"column"}
						justify={"space-between"}
						align={"flex-start"}
						gap={"20px"}
					>
						<Text
							variant={"paragraph desktop"}
							alignment={"left"}
						>
							I’m Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.
						</Text>
						<Text
							variant={"paragraph desktop"}
							alignment={"left"}
						>
							Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.
						</Text>
						<Text
							variant={"paragraph desktop"}
							alignment={"left"}
						>
							Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.
						</Text>
						<Text
							variant={"paragraph desktop"}
							alignment={"left"}
						>
							I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.
						</Text>
					</Container>
				</Container>
			</MediaQuery>
		</StyledAbout>
	);
}
