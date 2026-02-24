import { StyledWorkCard, StyledWorkCardDiv, StyledWorkCardContent, StyledWorkLogo } from './styled';
import { useState, useCallback } from 'react';
import { useNavigate, useViewTransitionState } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

//? Hooks
import { useTooltipAnimation } from '../../hooks/useTooltipAnimation';

//* Assets
import ArrowIcon from '../../assets/icons/arrow-right-circle.svg?react';

//* Components
import Container from '../Containers/Container';
import Text from '../Text';
import PillTag from '../Pill';
import Button from '../Button';
import IconFrame from '../IconFrame';

//* Styled (Tooltip)
import {
	StyledTooltip,
	StyledTooltipBridge,
	StyledTooltipContent,
	StyledTooltipIcon,
} from '../Tooltip/styled';

//? Types
import { WorkCardProps } from '../../types';

//? Data
import { hasDetailPage } from '../../data/works';

const DocumentIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
		<path d="M9.5 1.5H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5L9.5 1.5Z" />
		<polyline points="9.5 1.5 9.5 4.5 13 4.5" />
		<line x1="5.5" y1="8" x2="10.5" y2="8" />
		<line x1="5.5" y1="10.5" x2="10.5" y2="10.5" />
	</svg>
);

const tagSpinnerMap: Record<string, 'braille' | 'diagswipe' | 'breathe'> = {
	Development: 'breathe',
	Design: 'breathe',
	'Work in progress': 'braille',
	'V2.0': 'diagswipe',
};

function WorkCard(props: WorkCardProps) {
	const [isHovered, setIsHovered] = useState(false);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const title = t(`${props.slug}.title`, { ns: 'works' });
	const tags = t(`${props.slug}.tags`, { ns: 'works', returnObjects: true }) as string[];
	const details = t(`${props.slug}.details`, { ns: 'works' });
	const enTags = t(`${props.slug}.tags`, { ns: 'works', lng: 'en', returnObjects: true }) as string[];

	const isDetail = hasDetailPage({ slug: props.slug, url: props.url, showcaseUrl: props.showcaseUrl, Logo: props.Logo });
	const isTransitioning = useViewTransitionState(`/work/${props.slug}`);
	const tooltipRef = useTooltipAnimation(isHovered, 'top');

	const handleMouseEnter = useCallback(() => setIsHovered(true), []);
	const handleMouseLeave = useCallback(() => setIsHovered(false), []);

	const handleCardClick = useCallback(() => {
		if (isDetail) {
			navigate(`/work/${props.slug}`, { viewTransition: true });
		}
	}, [isDetail, navigate, props.slug]);

	const handleButtonClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		window.open(props.url, '_blank', 'noopener,noreferrer');
	}, [props.url]);

	const cardContent = (
		<StyledWorkCardContent>
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
						{title}
					</Text>
					<Container
						w={'100%'}
						h={'auto'}
						direction={'row'}
						gap={"6px"}
					>
						{tags.map((tag: string, i: number) => {
							const spinner = tagSpinnerMap[enTags[i]] || undefined;
							return (
								<PillTag
									key={tag}
									tag={tag}
									spinnerName={spinner}
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
						{details}
					</Text>
					<Container
						w={'100%'}
						h={'100%'}
						direction={'column'}
						justify={'flex-end'}
						align={'start'}
					>
						<Button
							title={t('visitSite', { ns: 'common' })}
							p={['0', '2', '0', '8']}
							{...(isDetail
								? { onClick: handleButtonClick }
								: { url: props.url }
							)}
						>
							<IconFrame Icon={ArrowIcon} />
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
				<StyledWorkLogo
					aria-hidden="true"
					style={isTransitioning ? { viewTransitionName: 'work-hero' } : undefined}
				>
					<props.Logo />
				</StyledWorkLogo>
			</Container>
		</StyledWorkCardContent>
	);

	if (isDetail) {
		return (
			<StyledWorkCardDiv
				className={"work-card"}
				onClick={handleCardClick}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				$isHovered={isHovered}
				$p={props.p}
				$m={props.m}
			>
				{cardContent}
				<StyledTooltip ref={tooltipRef} $position="top" $clickable role="tooltip">
					<StyledTooltipBridge $position="top" />
					<StyledTooltipContent>
						<StyledTooltipIcon><DocumentIcon /></StyledTooltipIcon>
						{t('viewCaseStudy', { ns: 'common' })}
					</StyledTooltipContent>
				</StyledTooltip>
			</StyledWorkCardDiv>
		);
	}

	return (
		<StyledWorkCard
			className={"work-card"}
			href={props.url}
			target="_blank"
			rel="noopener noreferrer"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			$isHovered={isHovered}
			$p={props.p}
			$m={props.m}
		>
			{cardContent}
		</StyledWorkCard>
	);
}

export default WorkCard;
