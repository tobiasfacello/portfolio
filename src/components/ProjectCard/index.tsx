import { useState } from 'react';
import { StyleSheetManager } from 'styled-components';
import { StyledProjectCard } from './styled';

//* Components
import Text from '../Text';
import Container from '../Containers/Container';

function ProjectCard(props: any) {
	const [isHovered, setIsHovered] = useState(false);

	const filteredProps: string[] = [
		'isHovered',
		'variant',
		'title',
		'details',
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
				<Container direction={'column'} justify={'flex-start'} align={'start'}>
					<Text variant={'subtitle-fst'} m={['xxxs', 'xs', 'xs', 'xs']}>
						{props.title}
					</Text>
					<Text variant={'details-fst'} m={['zero', 'zero', 'xs', 'xs']}>
						{props.details}
					</Text>
				</Container>
				<Container direction={'column'} justify={'center'} align={'end'}>
					<img src={props.src} />
				</Container>
			</StyledProjectCard>
		</StyleSheetManager>
	);
}

export default ProjectCard;
