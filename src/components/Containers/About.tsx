import styled from "styled-components";

//* Components
import Container from "./Container";
import Text from "../../components/Text";

//? Hooks & Config
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { aboutConfig } from "../../config/responsive";

const StyledAbout = styled.section`
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

const paragraphs = [
	"I'm Fache, a Fullstack Developer with +3 years collaborating with design and development teams to create high-impact digital experiences.",
	"Currently working with TypeScript, Next.js, and PostgreSQL, always exploring new and improved techniques and tools.",
	"Passionate about building applications that not only solve problems but also deliver smooth and engaging user experiences.",
	"I've been part of teams dedicated to developing high-quality, high-performance, and adaptable products.",
];

export default function About() {
	const bp = useBreakpoint();
	const cfg = aboutConfig[bp];

	return (
		<StyledAbout>
			<Container
				w={cfg.outerW}
				maxW={cfg.outerMaxW}
				h={cfg.outerH}
				minH={cfg.outerMinH}
				m={['36', '0', '36', '0']}
				direction={"column"}
				justify={"space-between"}
				align={"center"}
				gap={cfg.outerGap}
			>
				<Container
					w={cfg.innerW}
					h={"auto"}
					direction={"column"}
					justify={"center"}
					align={"flex-start"}
				>
					<Text
						as="h2"
						variant={"subtitle-snd"}
						alignment={cfg.titleAlign}
					>
						ABOUT ME
					</Text>
				</Container>
				<Container
					w={cfg.innerW}
					display={"flex"}
					direction={"column"}
					justify={"space-between"}
					align={"flex-start"}
					gap={cfg.paragraphGap}
				>
					{paragraphs.map((text) => (
						<Text
							key={text.slice(0, 20)}
							variant={cfg.paragraphVariant}
							alignment={"left"}
						>
							{text}
						</Text>
					))}
				</Container>
			</Container>
		</StyledAbout>
	);
}
