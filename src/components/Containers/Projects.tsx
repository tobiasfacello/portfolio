import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

//* Components
import Container from '../../components/Containers/Container';
import ProjectCard from '../../components/ProjectCard';
import Text from '../../components/Text';

//? Hooks, Config & Data
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { projectsConfig } from '../../config/responsive';
import { projects } from '../../data/projects';

//* Styles
import { glassBorder, noisePatternBackground } from '../../styles/mixins';

const StyledProjects = styled.section`
	width: 100%;
	height: 100%;
	padding: 0 var(--20);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	${glassBorder(true)}
	${noisePatternBackground}

	@media (min-width: 1280px) {
		grid-area: projects;
		justify-content: space-between;
	}
`;

function Projects() {
	const bp = useBreakpoint();
	const cfg = projectsConfig[bp];
	const { t } = useTranslation('home');

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
				gap={cfg.outerGap}
			>
				<Container
					h={"auto"}
					w={'100%'}
					justify={"flex-start"}
					align={'center'}
				>
					<Text as="h2" variant={'subtitle-snd'}>
						{t('projects.title')}
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
							key={project.slug}
							slug={project.slug}
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
