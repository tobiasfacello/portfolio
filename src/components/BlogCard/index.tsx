//* Components
import Text from '../Text';
import {
	StyledBlogCard,
	StyledBlogCardContent,
	StyledBlogCardExcerpt,
	StyledBlogCardImage,
} from './styled';

//? Types
import type { BlogCardLayout } from '../../types';

type BlogCardProps = {
	title: string;
	excerpt: string;
	thumbnail: string;
	layout: BlogCardLayout;
};

function BlogCard({ title, excerpt, thumbnail, layout }: BlogCardProps) {
	return (
		<StyledBlogCard $layout={layout}>
			<StyledBlogCardContent $layout={layout}>
				<Text as="h3" variant="subtitle">
					{title}
				</Text>
				<StyledBlogCardExcerpt>{excerpt}</StyledBlogCardExcerpt>
			</StyledBlogCardContent>
			<StyledBlogCardImage $layout={layout}>
				<img src={thumbnail} alt={title} loading="lazy" />
			</StyledBlogCardImage>
		</StyledBlogCard>
	);
}

export default BlogCard;
