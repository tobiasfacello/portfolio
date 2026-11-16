import { memo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

//* Components
import Text from '../../Text';
import Button from '../../Button';
import WidgetSkeleton from '../../Skeleton/WidgetSkeleton';

//? Analytics
import { trackEvent } from '../../../lib/analytics';

//* Styled
import {
	StyledWidgetCard,
	StyledWidgetHeader,
	StyledWidgetPlatform,
	StyledWidgetIcon,
	StyledWidgetContent,
	StyledErrorState,
	StyledWidgetFooter,
} from './styled';

type WidgetBaseProps = {
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	platformName: string;
	profileUrl: string;
	children: ReactNode;
	loading?: boolean;
	error?: string | null;
	onRetry?: () => void;
	skeleton?: ReactNode;
	footer?: ReactNode;
};

const HEADER_BUTTON_PADDING = ['4', '8', '4', '8'];
const RETRY_BUTTON_PADDING = ['4', '12', '4', '12'];

type WidgetHeaderProps = Pick<WidgetBaseProps, 'icon' | 'platformName' | 'profileUrl'> & {
	showProfileLink: boolean;
};

// Memoized: its props are stable per widget, so when a widget re-renders for
// its own content (data arriving, a theme-dependent image) the header — the
// profile button and the platform icon — is skipped.
const WidgetHeader = memo(function WidgetHeader({ icon: Icon, platformName, profileUrl, showProfileLink }: WidgetHeaderProps) {
	const { t } = useTranslation('home');

	return (
		<StyledWidgetHeader>
			<StyledWidgetPlatform>
				<StyledWidgetIcon>
					<Icon />
				</StyledWidgetIcon>
				<Text as="h3" variant="subtitle-sm">
					{platformName}
				</Text>
			</StyledWidgetPlatform>
			{showProfileLink && (
				<Button
					variant="glass"
					title={t('activity.viewProfile')}
					url={profileUrl}
					p={HEADER_BUTTON_PADDING}
					onClick={() => trackEvent({ name: 'social_click', data: { platform: platformName.toLowerCase(), source: 'widget' } })}
				/>
			)}
		</StyledWidgetHeader>
	);
});

export default function WidgetBase(props: WidgetBaseProps) {
	const { t } = useTranslation('home');

	return (
		<StyledWidgetCard className="widget-card">
			<WidgetHeader
				icon={props.icon}
				platformName={props.platformName}
				profileUrl={props.profileUrl}
				showProfileLink={!props.loading && !props.error}
			/>
			<StyledWidgetContent>
				{props.loading ? (
					props.skeleton ?? <WidgetSkeleton />
				) : props.error ? (
					<StyledErrorState>
						<Text variant="label">{t('activity.error')}</Text>
						{props.onRetry && (
							<Button
								variant="glass"
								title={t('activity.retry', 'Reintentar')}
								onClick={props.onRetry}
								p={RETRY_BUTTON_PADDING}
							/>
						)}
					</StyledErrorState>
				) : (
					<>
						{props.children}
						{props.footer && <StyledWidgetFooter>{props.footer}</StyledWidgetFooter>}
					</>
				)}
			</StyledWidgetContent>
		</StyledWidgetCard>
	);
}
