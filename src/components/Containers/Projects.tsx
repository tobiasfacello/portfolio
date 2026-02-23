import styled from 'styled-components';

//* Components
import Container from '../../components/Containers/Container';
import ProjectCard from '../../components/ProjectCard';
import Text from '../../components/Text';

//? Hooks, Config & Data
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { projectsConfig } from '../../config/responsive';
import { projects } from '../../data/projects';

//* Styles
import { noisePatternBackground } from '../../styles/mixins';

const StyledProjects = styled.section`
	width: 100%;
	height: 100%;
	padding: 0 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-top: 1px solid var(--secondary-60);
	${noisePatternBackground}

	@media (min-width: 1280px) {
		grid-area: projects;
		justify-content: space-between;
		border-top: none;
		border-left: 1px solid var(--secondary-60);
	}
`;

function Projects() {
	const bp = useBreakpoint();
	const cfg = projectsConfig[bp];

	return (
		<StyledProjects>
			<Container
				w={cfg.outerW}
				maxW={cfg.outerMaxW}
				h={cfg.outerH}
				minH={cfg.outerMinH}
				m={['36', '0', '36', '0']}
				direction={"column"}
				justify={cfg.outerJustify}
				align={"center"}
				gap={"36px"}
			>
				<Container
					h={cfg.titleH}
					w={'100%'}
					justify={cfg.titleJustify}
					align={'center'}
				>
					<Text as="h2" variant={'subtitle-snd'}>
						PROJECTS
					</Text>
				</Container>
				<Container
					h={bp.startsWith('desktop') ? '100%' : undefined}
					direction={'column'}
					justify={bp.startsWith('desktop') ? 'center' : 'center'}
					align={'center'}
					gap={cfg.cardGap}
				>
					{projects.map((project) => (
						<ProjectCard
							key={project.title}
							title={project.title}
							details={project.details}
							tag={project.tag}
							src={project.src}
							url={project.url}
						/>
					))}
				</Container>
			</Container>
		</StyledProjects>
	);
}

export default Projects;
