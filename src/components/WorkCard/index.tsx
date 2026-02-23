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

//? Types
import { WorkCardProps } from '../../types';

function WorkCard(props: WorkCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<StyledWorkCard
			className={"work-card"}
			href={props.url}
			target="_blank"
			rel="noopener noreferrer"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			$isHovered={isHovered}
			$p={props.p}
			$m={props.m}
		>
			<Container
				w={'60%'}
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
					<Container
						w={'100%'}
						h={'auto'}
						direction={'row'}
						gap={"6px"}
					>
						{props.tags.map((tag: string) => {
							return (
								<PillTag
									key={tag}
									tag={tag}
									p={['4', '8', '4', '8']}
								/>
							);
						})}
					</Container>
					<Text
						w={'90%'}
						variant={'paragraph-work-card'}
						alignment={'start'}
					>
						{props.details}
					</Text>
					<Container
						w={'100%'}
						h={'100%'}
						direction={'column'}
						justify={'flex-end'}
						align={'start'}
					>

						<Button
							title={'Visit page'}
							p={['0', '2', '0', '8']}
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
				<img className="work-logo" src={props.src} alt={`${props.title} logo`} />
			</Container>
		</StyledWorkCard>
	);
}

export default WorkCard;
