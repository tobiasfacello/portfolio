import { useState, useEffect } from 'react';
import { StyleSheetManager } from 'styled-components';
import { StyledProjectCard } from './styled';

//* Components
import Text from '../Text';
import Container from '../Containers/Container';
import PillTag from '../Pill';
import UnicodeSpinner from '../UnicodeSpinner';

function ProjectCard(props: any) {
	const [isHovered, setIsHovered] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);

	const filteredProps: string[] = [
		'isHovered',
		'variant',
		'title',
		'details',
		'tag',
		'src',
		'url',
	];

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
		<StyleSheetManager
			shouldForwardProp={(prop) => !filteredProps.includes(prop)}
		>
			<StyledProjectCard
				className={"project-card"}
				href={props.url}
				target="_blank"
				rel="noopener noreferrer"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				isHovered={isHovered}
			>
				<Container direction={'column'} justify={'space-between'} align={'start'}>
					<Text variant={'subtitle-fst'}>
						{props.title}
					</Text>
					<Text variant={'details-fst'}>
						{props.details}
					</Text>
					<PillTag
						tag={props.tag}
						maxW={'140px'}
						p={['4', '8', '4', '6']}
					/>
				</Container>
				<Container direction={'column'} justify={'center'} align={'end'}>
					{!imageLoaded && <UnicodeSpinner name="pulse" />}
					<img
						src={props.src}
						alt={`${props.title} logo`}
						style={{ opacity: imageLoaded ? undefined : 0, position: imageLoaded ? undefined : 'absolute' }}
					/>
				</Container>
			</StyledProjectCard>
		</StyleSheetManager>
	);
}

export default ProjectCard;
