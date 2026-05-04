import { useTranslation } from 'react-i18next';

//* Components
import Text from '../Text';
import Button from '../Button';
import IconFrame from '../IconFrame';
import ShinyLabel from '../ShinyLabel';
import { iconRegistry } from '../Icon';
import {
	StyledBlogCard,
	StyledBlogCardContent,
	StyledBlogCardExcerpt,
	StyledBlogCardImageWrapper,
	StyledBlogCardReadButtonWrapper,
	StyledBlogCardStatusWrapper,
} from './styled';

//? Types
import type { BlogCardProps } from '../../types';

function BlogCard({ title, excerpt, thumbnail, status, url }: BlogCardProps) {
	const { t } = useTranslation('home');
	const isInProgress = status === 'in-progress';

	return (
		<StyledBlogCard>
			{!isInProgress && (
				<StyledBlogCardContent>
					<Text as="h3" variant="body">
						{title}
					</Text>
					<StyledBlogCardExcerpt>{excerpt}</StyledBlogCardExcerpt>
				</StyledBlogCardContent>
			)}
			<StyledBlogCardImageWrapper>
				<img src={thumbnail} alt="" loading="lazy" decoding="async" width="400" height="300" />
				{isInProgress ? (
					<StyledBlogCardStatusWrapper>
						<ShinyLabel label={t('blog.inProgress')} icon="penLine" />
					</StyledBlogCardStatusWrapper>
				) : (
					<StyledBlogCardReadButtonWrapper>
						<Button
							variant="glass"
							title={t('blog.readPost')}
							p={['6', '8', '6', '8']}
							{...(url ? { url } : {})}
						>
							<IconFrame Icon={iconRegistry.arrowUpRight} />
						</Button>
					</StyledBlogCardReadButtonWrapper>
				)}
			</StyledBlogCardImageWrapper>
		</StyledBlogCard>
	);
}

export default BlogCard;
