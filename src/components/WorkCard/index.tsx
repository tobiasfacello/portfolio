import { StyledWorkCard, StyledWorkCardDiv, StyledWorkCardContent, StyledWorkLogo } from './styled';
import { useState, useCallback } from 'react';
import { useNavigate, useViewTransitionState } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

//* Components
import Container from '../Containers/Container';
import Text from '../Text';
import PillTag from '../Pill';
import Button from '../Button';
import IconFrame from '../IconFrame';
import Tooltip from '../Tooltip';
import { iconRegistry } from '../Icon';

//? Types
import { WorkCardProps } from '../../types';
import type { AnimationName } from '../UnicodeAnimations/animations';

//? Data
import { hasDetailPage } from '../../data/works';

const HourglassIcon = () => (
	<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
		<path d="M5 2h6M5 14h6M5 2c0 3 3 5 3 6s-3 3-3 6M11 2c0 3-3 5-3 6s3 3 3 6" />
	</svg>
);

const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg {...props} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
		<path d="M9.5 1.5H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5L9.5 1.5Z" />
		<polyline points="9.5 1.5 9.5 4.5 13 4.5" />
		<line x1="5.5" y1="8" x2="10.5" y2="8" />
		<line x1="5.5" y1="10.5" x2="10.5" y2="10.5" />
	</svg>
);

const tagAnimationMap: Record<string, AnimationName> = {
	Development: 'breathe',
	Design: 'breathe',
	'V2.0': 'diagswipe',
	'Work in progress': 'typing',
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

	const handleDocClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		navigate(`/work/${props.slug}`, { viewTransition: true });
	}, [navigate, props.slug]);

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
							const animationName = tagAnimationMap[enTags[i]] || undefined;
							return (
								<PillTag
									key={tag}
									tag={tag}
									animationName={animationName}
									p={['4', '8', '4', '8']}
								/>
							);
						})}
					</Container>
					<Text
						w={'90%'}
						variant={'body-sm'}
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
						<Container
							w={'auto'}
							h={'auto'}
							direction={'column'}
							gap={'6px'}
						>
							<Button
								variant={'glass'}
								title={t('visitSite', { ns: 'common' })}
								p={['0', '6', '0', '6']}
								{...(isDetail
									? { onClick: handleButtonClick }
									: { url: props.url }
								)}
							>
								<IconFrame Icon={iconRegistry.externalLink} />
							</Button>
							{isDetail ? (
								<Button
									variant={'glass'}
									title={t('viewDocumentation', { ns: 'common' })}
									p={['0', '6', '0', '6']}
									onClick={handleDocClick}
								>
									<IconFrame Icon={DocumentIcon} />
								</Button>
							) : (
								<Tooltip
									text={t('inProgress', { ns: 'common' })}
									position="bottom"
									icon={<HourglassIcon />}
								>
									<Button
										variant={'glass'}
										title={t('viewDocumentation', { ns: 'common' })}
										p={['0', '6', '0', '6']}
										disabled
									>
										<IconFrame Icon={DocumentIcon} />
									</Button>
								</Tooltip>
							)}
						</Container>
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

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleCardClick();
		}
	}, [handleCardClick]);

	if (isDetail) {
		return (
			<StyledWorkCardDiv
				className={"work-card"}
				role="button"
				aria-label={title}
				tabIndex={0}
				onClick={handleCardClick}
				onKeyDown={handleKeyDown}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				$isHovered={isHovered}
				$p={props.p}
				$m={props.m}
			>
				{cardContent}
			</StyledWorkCardDiv>
		);
	}

	return (
		<StyledWorkCard
			className={"work-card"}
			aria-label={title}
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
