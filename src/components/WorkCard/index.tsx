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

	//TODO: Enable this feature in the future
	const handleClick = (url: string) => {
		window.location.href = url;
	};

	return (
		<StyleSheetManager
			shouldForwardProp={(prop) => !filteredProps.includes(prop)}
		>
			<StyledWorkCard
				onClick={() => handleClick(props.url)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				isHovered={isHovered}
				p={props.p}
				m={props.m}
			>
				<Container
					w={'100%'}
					h={'100%'}
					direction={'column'}
					justify={'space-between'}
					align={'start'}
				>
					<Container
						w={'100%'}
						h={'100%'}
						direction={'column'}
						justify={'space-between'}
						align={'start'}
						gap={"20px"}
					>
						<Text variant={'title'}>
							{props.title}
						</Text>
						<PillTag
							tag={props.tag}
							p={['4', '8', '4', '8']}
						/>
						<Text
							variant={'paragraph work-card'}
							alignment={'start'}
							transform={'scaled-down'}
						>
							{props.details}
						</Text>
						<Container
							w={'100%'}
							h={'50%'}
							direction={'column'}
							justify={'flex-end'}
							align={'start'}
						>

							<Button
								title={'Visit Page'}
								p={['0', '4', '0', '8']}
								url={props.url}
							>
								<IconFrame src={arrowIcon} />
							</Button>
						</Container>
					</Container>
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
