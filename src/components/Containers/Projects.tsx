import { lazy, Suspense } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { mq } from '../../config/breakpoints';

//* Components
import Container from '../../components/Containers/Container';
import ProjectCardSkeleton from '../../components/Skeleton/ProjectCardSkeleton';
import Text from '../../components/Text';

const ProjectCard = lazy(() => import('../../components/ProjectCard'));

//? Hooks, Config & Data
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { projectsConfig } from '../../config/responsive';
import { projects } from '../../data/projects';

//* Styles
import { sectionBase } from '../../styles/mixins';

const StyledProjects = styled.section`
	${sectionBase('projects')}
	justify-content: center;
	padding: 0 var(--20);

	${mq.up('desktop-sm')} {
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
					<Text as="h2" variant={'subtitle-sm'}>
						{t('projects.title')}
					</Text>
				</Container>
				<Container
					h={bp.startsWith('desktop') ? '100%' : undefined}
					direction={'column'}
					justify={'center'}
					align={'center'}
					gap={cfg.cardGap}
				>
					{projects.map((project) => (
						<Suspense key={project.slug} fallback={<ProjectCardSkeleton />}>
							<ProjectCard
								slug={project.slug}
								src={project.src}
								url={project.url}
								tech={project.tech}
							/>
						</Suspense>
					))}
				</Container>
			</Container>
		</StyledProjects>
	);
}

export default Projects;
