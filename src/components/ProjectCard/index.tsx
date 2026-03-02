import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledProjectCard, TechPill, TechPillIcon, PillWrapper } from './styled';

//* Components
import Text from '../Text';
import Container from '../Containers/Container';
import PillTag from '../Pill';
import UnicodeAnimation from '../UnicodeAnimations';

//* Icon registry
import { iconRegistry } from '../Icon';

//? Hooks
import { usePillDegradation } from '../../hooks/usePillDegradation';

//? Types
import { ProjectCardProps, PillDisplay } from '../../types';

//? Data
import { tagAnimationMap } from '../../data/tagAnimations';

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
	const tag = t(`${props.slug}.tag`);
	const enTag = t(`${props.slug}.tag`, { lng: 'en' });
	const animationName = tagAnimationMap[enTag] || undefined;

	const { level, techIconOnly, ready, cardRef, contentRef, logoRef, measureLayer } = usePillDegradation({
		tag,
		animationName,
	});

	useEffect(() => {
		if (!props.src) return;
		const img = new Image();
		img.src = props.src;
		if (img.complete) {
			setImageLoaded(true);
		} else {
			img.onload = () => setImageLoaded(true);
		}
		return () => { img.onload = null; };
	}, [props.src]);

	// Pill content derived from level — hide text when animation is present
	const pillTag = animationName ? undefined : level === PillDisplay.FULL ? tag : undefined;
	const pillPadding = level === PillDisplay.ICON_ONLY ? ['4', '6', '4', '6'] : ['4', '8', '4', '6'];

	// CSS variables for smooth transitions (inline styles = real transitions, no class swap)
	const pillStyle = useMemo(() => {
		const isHidden = level === PillDisplay.HIDDEN;
		return {
			'--pill-max-w': isHidden ? '0px' : 'max-content',
			'--pill-opacity': isHidden ? '0' : '1',
		} as React.CSSProperties;
	}, [level]);

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
				<Container align={'center'} gap={'8px'} w={'fit-content'} h={'fit-content'}>
					<Text variant={'subtitle'}>
						{title}
					</Text>
					<PillWrapper $ready={ready} style={pillStyle}>
						<PillTag
							tag={pillTag}
							animationName={animationName}
							p={pillPadding}
						/>
					</PillWrapper>
				</Container>
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
								{!techIconOnly && tech}
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
				{!imageLoaded && <UnicodeAnimation name="pulse" />}
				<img
					src={props.src}
					alt={`${title} logo`}
					loading="lazy"
					style={{ opacity: imageLoaded ? undefined : 0, position: imageLoaded ? undefined : 'absolute' }}
				/>
			</Container>
			{measureLayer}
		</StyledProjectCard>
	);
}

export default ProjectCard;
