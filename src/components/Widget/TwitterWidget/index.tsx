import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

//* Components
import WidgetBase from '../WidgetBase';
import TwitterWidgetSkeleton from '../../Skeleton/TwitterWidgetSkeleton';

//* Styled
import {
	StyledPinnedCard,
	StyledAuthorRow,
	StyledAvatar,
	StyledAuthorInfo,
	StyledAuthorName,
	StyledVerifiedBadge,
	StyledAuthorMeta,
	StyledTweetBody,
	StyledMediaGrid,
	StyledMediaItem,
	StyledStatsRow,
	StyledStat,
	StyledFooterLabel,
	StyledFooterMeta,
} from './styled';
import { StyledWidgetHandle } from '../WidgetBase/styled';

//* Icon registry
import { iconRegistry } from '../../Icon';

//? Hooks
import { usePinnedTweet } from '../../../hooks/usePinnedTweet';
import { useTheme } from '../../../hooks/useTheme';

//? Data
import { TWITTER_HANDLE, TWITTER_URL } from '../../../data/socialFeed';

//* Assets
import profileDark from '../../../assets/images/profile.webp';
import profileLight from '../../../assets/images/profile-light.webp';

function VerifiedSvg() {
	return (
		<svg viewBox="0 0 16 16" fill="currentColor">
			<path d="M8 .5L9.5 2.4l2.4-.6.6 2.4 2.4.6-.6 2.4L15.5 8l-1.2 2.1.6 2.4-2.4.6-.6 2.4-2.4-.6L8 15.5l-1.5-1.9-2.4.6-.6-2.4-2.4-.6.6-2.4L.5 8l1.2-2.1-.6-2.4 2.4-.6.6-2.4 2.4.6L8 .5z" />
			<polyline
				points="5 8 7 10 11 6"
				fill="none"
				stroke="var(--background, white)"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function HeartSvg() {
	return (
		<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M8 13.5s-5-3-5-7a3 3 0 0 1 5-2.2A3 3 0 0 1 13 6.5c0 4-5 7-5 7z" />
		</svg>
	);
}

function RetweetSvg() {
	return (
		<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<polyline points="11 2 14 5 11 8" />
			<path d="M14 5H5a2 2 0 0 0-2 2v1" />
			<polyline points="5 14 2 11 5 8" />
			<path d="M2 11h9a2 2 0 0 0 2-2V8" />
		</svg>
	);
}

function ReplySvg() {
	return (
		<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M14 8a5.5 5.5 0 0 1-7.5 5L2 14l1-3A5.5 5.5 0 1 1 14 8z" />
		</svg>
	);
}

function ViewSvg() {
	return (
		<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
			<circle cx="8" cy="8" r="2" />
		</svg>
	);
}

function getRelativeTimeKey(dateStr: string): { key: string; count: number } {
	const date = new Date(dateStr);
	const now = new Date();
	const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

	if (diffDays <= 0) return { key: 'today', count: 0 };
	if (diffDays === 1) return { key: 'oneDay', count: 1 };
	if (diffDays < 30) return { key: 'daysAgo', count: diffDays };
	if (diffDays < 365) return { key: 'monthsAgo', count: Math.floor(diffDays / 30) };
	return { key: 'yearsAgo', count: Math.floor(diffDays / 365) };
}

function formatRelativeTime(t: TFunction<'home'>, dateStr: string): string {
	const { key, count } = getRelativeTimeKey(dateStr);
	return t(`activity.twitter.timeAgo.${key}`, { count });
}

function formatCompactNumber(n: number): string {
	if (n < 1000) return String(n);
	if (n < 1_000_000) {
		const value = n / 1000;
		return `${value % 1 === 0 ? value : value.toFixed(1)}K`;
	}
	const value = n / 1_000_000;
	return `${value % 1 === 0 ? value : value.toFixed(1)}M`;
}

export default function TwitterWidget() {
	const { t } = useTranslation('home');
	const { tweet, loading, error } = usePinnedTweet();
	const { isDarkMode } = useTheme();

	const fallbackAvatar = isDarkMode ? profileDark : profileLight;
	const avatarSrc = tweet?.author.profilePicture || fallbackAvatar;
	const relativeDate = tweet ? formatRelativeTime(t, tweet.date) : null;
	const hasMedia = tweet ? tweet.media.length > 0 : false;
	const isSingleMedia = tweet ? tweet.media.length === 1 : false;

	return (
		<WidgetBase
			icon={iconRegistry.twitter}
			platformName="Twitter"
			profileUrl={TWITTER_URL}
			loading={loading}
			error={error}
			skeleton={<TwitterWidgetSkeleton />}
			footer={
				tweet && relativeDate
					? (
						<>
							<StyledFooterLabel>{t('activity.twitter.pinnedLabel')}</StyledFooterLabel>
							<StyledFooterMeta>
								{t('activity.twitter.lastActivity', { time: relativeDate })}
							</StyledFooterMeta>
						</>
					)
					: undefined
			}
		>
			<StyledWidgetHandle>{TWITTER_HANDLE}</StyledWidgetHandle>

			{tweet && (
				<StyledPinnedCard
					href={tweet.url}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={t('activity.twitter.openPinned', { defaultValue: 'Open pinned tweet' })}
				>
					<StyledAuthorRow>
						<StyledAvatar>
							<img src={avatarSrc} alt={tweet.author.name} loading="lazy" decoding="async" />
						</StyledAvatar>
						<StyledAuthorInfo>
							<StyledAuthorName>
								<span>{tweet.author.name}</span>
								{tweet.author.isVerified && (
									<StyledVerifiedBadge aria-label="Verified">
										<VerifiedSvg />
									</StyledVerifiedBadge>
								)}
							</StyledAuthorName>
							<StyledAuthorMeta>
								@{tweet.author.userName} · {relativeDate}
							</StyledAuthorMeta>
						</StyledAuthorInfo>
					</StyledAuthorRow>

					<StyledTweetBody>{tweet.text}</StyledTweetBody>

					{hasMedia && (
						<StyledMediaGrid $count={tweet.media.length}>
							{tweet.media.slice(0, 4).map((m, idx) => (
								<StyledMediaItem key={idx} $isSingle={isSingleMedia}>
									{m.type === 'video' ? (
										<video src={m.src} muted playsInline preload="metadata" />
									) : (
										<img src={m.src} alt="" loading="lazy" decoding="async" />
									)}
								</StyledMediaItem>
							))}
						</StyledMediaGrid>
					)}

					<StyledStatsRow>
						<StyledStat>
							<HeartSvg />
							{formatCompactNumber(tweet.stats.likes)}
						</StyledStat>
						<StyledStat>
							<RetweetSvg />
							{formatCompactNumber(tweet.stats.retweets)}
						</StyledStat>
						<StyledStat>
							<ReplySvg />
							{formatCompactNumber(tweet.stats.replies)}
						</StyledStat>
						<StyledStat>
							<ViewSvg />
							{formatCompactNumber(tweet.stats.views)}
						</StyledStat>
					</StyledStatsRow>
				</StyledPinnedCard>
			)}
		</WidgetBase>
	);
}
