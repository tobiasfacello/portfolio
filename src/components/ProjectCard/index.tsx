import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledProjectCard, TechPill, TechPillIcon, TechPillText } from './styled';

//* Components
import Text from '../Text';
import Container from '../Containers/Container';

//* Icon registry
import { iconRegistry } from '../Icon';

//? Hooks
import { useTechPillDegradation } from '../../hooks/usePillDegradation';

//? Types
import { ProjectCardProps } from '../../types';

const techIconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
	'Next.js': iconRegistry.nextJs,
	'TypeScript': iconRegistry.typescript,
	'React': iconRegistry.react,
	'Vite': iconRegistry.vite,
	'Supabase': iconRegistry.supabase,
	'OpenAI': iconRegistry.openAi,
};

function ProjectCard(props: ProjectCardProps) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const { t } = useTranslation('projects');

	const title = t(`${props.slug}.title`);
	const details = t(`${props.slug}.details`);

	const { techIconOnly, cardRef, contentRef, logoRef } = useTechPillDegradation();

	const handleImageLoad = () => setImageLoaded(true);

	return (
		<StyledProjectCard
			className={"project-card"}
			aria-label={title}
			ref={cardRef as React.Ref<HTMLAnchorElement>}
			href={props.url}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Container
				ref={contentRef as React.Ref<HTMLDivElement>}
				direction={'column'}
				justify={'space-between'}
				align={'start'}
				h={'100%'}
				gap={'8px'}
				$css={'flex: 1; min-width: 0;'}
			>
				<Text variant={'subtitle'}>
					{title}
				</Text>
				<Text variant={'label'}>
					{details}
				</Text>
				<Container align={'center'} gap={'8px'} w={'fit-content'} h={'fit-content'}>
					{props.tech.map((tech) => {
						const Icon = techIconMap[tech];
						return (
							<TechPill key={tech} $iconOnly={techIconOnly}>
								{Icon && (
									<TechPillIcon>
										<Icon />
									</TechPillIcon>
								)}
								<TechPillText>{tech}</TechPillText>
							</TechPill>
						);
					})}
				</Container>
			</Container>
			<Container
				ref={logoRef as React.Ref<HTMLDivElement>}
				direction={'column'}
				justify={'center'}
				align={'end'}
				w={'auto'}
				$css={'flex-shrink: 0;'}
			>
				<img
					src={props.src}
					alt={`${title} logo`}
					loading="lazy"
					onLoad={handleImageLoad}
					style={{ opacity: imageLoaded ? undefined : 0 }}
				/>
			</Container>
		</StyledProjectCard>
	);
}

export default ProjectCard;
