import { StyleSheetManager } from 'styled-components';
import { StyledWorkCard } from './styled';
import { useState } from 'react';

//* Assets
import arrowIcon from '../../assets/icons/arrow-right-circle.svg';

//* Components
import Container from '../Containers/Container';
import Text from '../Text';
import PillTag from '../Pill';
import Button from '../Button';
import IconFrame from '../IconFrame';

function WorkCard(props: any) {
	const [isHovered, setIsHovered] = useState(false);

	const filteredProps: string[] = [
		'isHovered',
		'p',
		'm',
		'variant',
		'title',
		'tag',
		'details',
		'showcaseUrl',
		'url',
		'src',
	];

	const handleClick = (url: string) => {
		window.location.href = url;
	};

	return (
		<StyleSheetManager
			shouldForwardProp={(prop) => !filteredProps.includes(prop)}
		>
			<StyledWorkCard
				onClick={() => handleClick(props.showcaseUrl)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				isHovered={isHovered}
				p={props.p}
				m={props.m}
			>
				<Container
					w={'60%'}
					direction={'column'}
					justify={'flex-start'}
					align={'start'}
				>
					<Text variant={'title'} m={['xs', 'zero', 'zero', 's']}>
						{props.title}
					</Text>
					<PillTag
						tag={props.tag}
						m={['xs', 'zero', 'zero', 's']}
						p={['xxxs', 'xxs', 'xxxs', 'xxs']}
					></PillTag>
					<Text
						variant={'paragraph work-card'}
						alignment={'start'}
						transform={'scaled-down'}
						m={['s', 'zero', 'zero', 's']}
					>
						{props.details}
					</Text>
					<Button
						title={'Visit Page'}
						m={['s', 'zero', 'zero', 's']}
						p={['zero', 'xxxs', 'zero', 'xxs']}
						url={props.url}
					>
						<IconFrame src={arrowIcon} />
					</Button>
				</Container>
				<Container
					w={'40%'}
					direction={'column'}
					justify={'center'}
					align={'end'}
				>
					<img className="work-logo" src={props.src} />
				</Container>
			</StyledWorkCard>
		</StyleSheetManager>
	);
}

export default WorkCard;
