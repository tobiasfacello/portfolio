import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledProjectCard } from './styled';

//* Components
import Text from '../Text';
import Container from '../Containers/Container';
import PillTag from '../Pill';
import UnicodeSpinner from '../UnicodeSpinner';

//? Types
import { ProjectCardProps } from '../../types';

const tagSpinnerMap: Record<string, 'braille' | 'diagswipe' | 'breathe'> = {
	'Work in progress': 'braille',
	'V2.0': 'diagswipe',
	Development: 'breathe',
	Design: 'breathe',
};

function ProjectCard(props: ProjectCardProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);
	const { t } = useTranslation('projects');

	const title = t(`${props.slug}.title`);
	const details = t(`${props.slug}.details`);
	const tag = t(`${props.slug}.tag`);
	const enTag = t(`${props.slug}.tag`, { lng: 'en' });
	const spinner = tagSpinnerMap[enTag] || undefined;

	const handleMouseEnter = useCallback(() => setIsHovered(true), []);
	const handleMouseLeave = useCallback(() => setIsHovered(false), []);

	useEffect(() => {
		if (!props.src) return;
		const img = new Image();
		img.src = props.src;
		if (img.complete) {
			setImageLoaded(true);
		} else {
			img.onload = () => setImageLoaded(true);
		}
	}, [props.src]);

	return (
		<StyledProjectCard
			className={"project-card"}
			href={props.url}
			target="_blank"
			rel="noopener noreferrer"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			$isHovered={isHovered}
		>
			<Container direction={'column'} justify={'space-between'} align={'start'}>
				<Text variant={'subtitle-fst'}>
					{title}
				</Text>
				<Text variant={'details-fst'}>
					{details}
				</Text>
				<PillTag
					tag={tag}
					spinnerName={spinner}
					maxW={'140px'}
					p={['4', '8', '4', '6']}
				/>
			</Container>
			<Container direction={'column'} justify={'center'} align={'end'}>
				{!imageLoaded && <UnicodeSpinner name="pulse" />}
				<img
					src={props.src}
					alt={`${title} logo`}
					style={{ opacity: imageLoaded ? undefined : 0, position: imageLoaded ? undefined : 'absolute' }}
				/>
			</Container>
		</StyledProjectCard>
	);
}

export default ProjectCard;
