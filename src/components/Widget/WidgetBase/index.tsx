import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

//* Components
import Text from '../../Text';
import Button from '../../Button';

//* Styled
import {
	StyledWidgetCard,
	StyledWidgetHeader,
	StyledWidgetPlatform,
	StyledWidgetIcon,
	StyledWidgetContent,
} from './styled';

type WidgetBaseProps = {
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	platformName: string;
	profileUrl: string;
	children: ReactNode;
	loading?: boolean;
	error?: string | null;
};

export default function WidgetBase(props: WidgetBaseProps) {
	const { t } = useTranslation('home');

	return (
		<StyledWidgetCard className="widget-card">
			<StyledWidgetHeader>
				<StyledWidgetPlatform>
					<StyledWidgetIcon>
						<props.icon />
					</StyledWidgetIcon>
					<Text as="h3" variant="subtitle-sm">
						{props.platformName}
					</Text>
				</StyledWidgetPlatform>
				{!props.loading && !props.error && (
					<Button
						variant="glass"
						title={t('activity.viewProfile')}
						url={props.profileUrl}
						p={['4', '8', '4', '8']}
					/>
				)}
			</StyledWidgetHeader>
			<StyledWidgetContent>
				{props.loading ? (
					<Text variant="label">{t('activity.loading')}</Text>
				) : props.error ? (
					<Text variant="label">{t('activity.error')}</Text>
				) : (
					props.children
				)}
			</StyledWidgetContent>
		</StyledWidgetCard>
	);
}
