//* Components
import Text from '../Text';
import {
	StyledBlogCard,
	StyledBlogCardContent,
	StyledBlogCardExcerpt,
	StyledBlogCardImageWrapper,
	StyledBlogCardTags,
	StyledBlogTag,
} from './styled';

//? Types
import type { BlogCardProps } from '../../types';

function BlogCard({ title, excerpt, thumbnail, tags }: BlogCardProps) {
	return (
		<StyledBlogCard>
			<StyledBlogCardContent>
				<Text as="h3" variant="body">
					{title}
				</Text>
				<StyledBlogCardExcerpt>{excerpt}</StyledBlogCardExcerpt>
			</StyledBlogCardContent>
			<StyledBlogCardImageWrapper>
				<img src={thumbnail} alt={title} loading="lazy" />
				<StyledBlogCardTags>
					{tags.map((tag) => (
						<StyledBlogTag key={tag}>{tag}</StyledBlogTag>
					))}
				</StyledBlogCardTags>
			</StyledBlogCardImageWrapper>
		</StyledBlogCard>
	);
}

export default BlogCard;
