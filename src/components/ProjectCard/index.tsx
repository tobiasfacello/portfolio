import { useState } from 'react';
import { StyleSheetManager } from 'styled-components';
import { StyledProjectCard } from './styled';

//* Components
import Text from '../Text';
import Container from '../Containers/Container';
import PillTag from '../Pill';

function ProjectCard(props: any) {
	const [isHovered, setIsHovered] = useState(false);

	const filteredProps: string[] = [
		'isHovered',
		'variant',
		'title',
		'details',
		'tag',
		'src',
		'url',
	];

	const handleClick = (url: string) => {
		window.location.href = url;
	};

	return (
		<StyleSheetManager
			shouldForwardProp={(prop) => !filteredProps.includes(prop)}
		>
			<StyledProjectCard
				onClick={() => handleClick(props.url)}
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
						p={['4', '8', '4', '8']}
					/>
				</Container>
				<Container direction={'column'} justify={'center'} align={'end'}>
					<img src={props.src} />
				</Container>
			</StyledProjectCard>
		</StyleSheetManager>
	);
}

export default ProjectCard;
