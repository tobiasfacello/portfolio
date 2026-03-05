# Blog Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a blog section to the portfolio with 3 static mock blog posts using a reusable `BlogCard` component with `vertical`, `horizontal`, and `horizontal-reverse` layout variants.

**Architecture:** Single `BlogCard` component with `$layout` transient prop controlling flexbox direction. Section container (`Blog.tsx`) follows `ActivityFeed` pattern: `sectionBase('blog')` mixin, responsive grid via `blogConfig`, mounted in `Home.tsx` grid. Mock data hardcoded as a constant array.

**Tech Stack:** React 19, TypeScript, styled-components (transient `$` props), i18next translations, `glassCard(true)` mixin, CSS `line-clamp` for excerpt truncation.

---

### Task 1: Add types for BlogCard

**Files:**
- Modify: `src/types/index.ts:212` (append after last type)

**Step 1: Add BlogCard types**

Add at end of file (after `LinkedInProfile` type, line 211):

```typescript
export type BlogCardLayout = 'vertical' | 'horizontal' | 'horizontal-reverse';

export type BlogPostMock = {
	title: string;
	excerpt: string;
	thumbnail: string;
	layout: BlogCardLayout;
};
```

**Step 2: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat(blog): add BlogCardLayout and BlogPostMock types"
```

---

### Task 2: Add blog responsive config

**Files:**
- Modify: `src/config/responsive.ts:167` (append after `gitHubCalendarConfig`)

**Step 1: Add blogConfig**

Append at end of `src/config/responsive.ts`:

```typescript
// ── Blog ────────────────────────────────────────────────

interface BlogConfig {
	outerW: string;
	outerMaxW?: string;
	outerGap: string;
	gridColumns: number;
	gridGap: string;
}

const desktopBlog: BlogConfig = { outerW: '100%', outerGap: '24px', gridColumns: 3, gridGap: '12px' };

export const blogConfig: Record<Breakpoint, BlogConfig> = fillBreakpoints({
	'mobile-sm': { outerW: '100%', outerMaxW: '500px', outerGap: '24px', gridColumns: 1, gridGap: '12px' },
	'mobile-lg': { outerW: '80%', outerGap: '24px', gridColumns: 1, gridGap: '12px' },
	tablet: { outerW: '80%', outerGap: '24px', gridColumns: 3, gridGap: '12px' },
	'desktop-sm': desktopBlog,
}, { outerW: '100%', outerGap: '24px', gridColumns: 1, gridGap: '12px' });
```

**Step 2: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/config/responsive.ts
git commit -m "feat(blog): add responsive blog grid config"
```

---

### Task 3: Add blog translations

**Files:**
- Modify: `src/i18n/locales/es/home.json` (add `blog` key)
- Modify: `src/i18n/locales/en/home.json` (add `blog` key)
- Modify: `src/i18n/locales/pt/home.json` (add `blog` key)

**Step 1: Add blog translations to all 3 locales**

Add a `"blog"` key at root level of each `home.json`. Example for `es`:

```json
"blog": {
  "title": "BLOG",
  "posts": [
    {
      "title": "Construyendo interfaces con glassmorphism",
      "excerpt": "El glassmorphism se ha consolidado como una tendencia de diseño que combina transparencia, blur y bordes sutiles para crear interfaces modernas. En este artículo exploramos cómo implementarlo con CSS y styled-components..."
    },
    {
      "title": "Animaciones performantes con GSAP y React",
      "excerpt": "GSAP es una de las librerías de animación más potentes del ecosistema web. Integrarla con React requiere entender el ciclo de vida de los componentes y cómo manejar las referencias del DOM correctamente..."
    },
    {
      "title": "Sistemas de diseño escalables en TypeScript",
      "excerpt": "Un buen sistema de diseño no solo define colores y tipografías, sino que establece contratos tipados entre diseño y desarrollo. Exploramos cómo TypeScript nos ayuda a mantener la consistencia..."
    }
  ]
}
```

For `en`:

```json
"blog": {
  "title": "BLOG",
  "posts": [
    {
      "title": "Building interfaces with glassmorphism",
      "excerpt": "Glassmorphism has established itself as a design trend that combines transparency, blur and subtle borders to create modern interfaces. In this article we explore how to implement it with CSS and styled-components..."
    },
    {
      "title": "Performant animations with GSAP and React",
      "excerpt": "GSAP is one of the most powerful animation libraries in the web ecosystem. Integrating it with React requires understanding component lifecycle and how to handle DOM references correctly..."
    },
    {
      "title": "Scalable design systems in TypeScript",
      "excerpt": "A good design system doesn't just define colors and typography, it establishes typed contracts between design and development. We explore how TypeScript helps us maintain consistency..."
    }
  ]
}
```

For `pt`:

```json
"blog": {
  "title": "BLOG",
  "posts": [
    {
      "title": "Construindo interfaces com glassmorphism",
      "excerpt": "O glassmorphism se consolidou como uma tendência de design que combina transparência, blur e bordas sutis para criar interfaces modernas. Neste artigo exploramos como implementá-lo com CSS e styled-components..."
    },
    {
      "title": "Animações performáticas com GSAP e React",
      "excerpt": "GSAP é uma das bibliotecas de animação mais poderosas do ecossistema web. Integrá-la com React requer entender o ciclo de vida dos componentes e como lidar com referências do DOM corretamente..."
    },
    {
      "title": "Sistemas de design escaláveis em TypeScript",
      "excerpt": "Um bom sistema de design não define apenas cores e tipografias, mas estabelece contratos tipados entre design e desenvolvimento. Exploramos como TypeScript nos ajuda a manter a consistência..."
    }
  ]
}
```

**Step 2: Commit**

```bash
git add src/i18n/locales/es/home.json src/i18n/locales/en/home.json src/i18n/locales/pt/home.json
git commit -m "feat(blog): add blog translations for es, en, pt"
```

---

### Task 4: Create BlogCard styled components

**Files:**
- Create: `src/components/BlogCard/styled.tsx`

**Step 1: Create styled.tsx**

```tsx
import styled, { css } from 'styled-components';
import { glassCard } from '../../styles/mixins';
import type { BlogCardLayout } from '../../types';

const layoutDirection = (layout: BlogCardLayout) => {
	if (layout === 'vertical') return 'column';
	if (layout === 'horizontal-reverse') return 'row-reverse';
	return 'row';
};

export const StyledBlogCard = styled.article<{ $layout: BlogCardLayout }>`
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: ${(props) => layoutDirection(props.$layout)};
	gap: var(--12);
	padding: var(--12);
	${glassCard(true)}
	overflow: hidden;

	&:hover {
		transform: translateY(-2px);
	}
`;

export const StyledBlogCardContent = styled.div<{ $layout: BlogCardLayout }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: var(--8);
	${(props) =>
		props.$layout !== 'vertical' &&
		css`
			flex: 1;
			min-width: 0;
		`}
`;

export const StyledBlogCardExcerpt = styled.p`
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-body-sm);
	line-height: 1.5;
	color: var(--text);
	opacity: var(--opacity-medium);
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
`;

export const StyledBlogCardImage = styled.div<{ $layout: BlogCardLayout }>`
	flex-shrink: 0;
	overflow: hidden;
	border-radius: var(--radius-md);

	${(props) =>
		props.$layout === 'vertical'
			? css`
					width: 100%;
					aspect-ratio: 4/3;
				`
			: css`
					width: 40%;
					aspect-ratio: 3/4;
				`}

	& > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 300ms ease-in-out;
	}

	${StyledBlogCard}:hover & > img {
		transform: scale(1.03);
	}
`;
```

**Step 2: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/BlogCard/styled.tsx
git commit -m "feat(blog): create BlogCard styled components"
```

---

### Task 5: Create BlogCard component

**Files:**
- Create: `src/components/BlogCard/index.tsx`

**Step 1: Create index.tsx**

```tsx
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
```

**Step 2: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/BlogCard/index.tsx
git commit -m "feat(blog): create BlogCard component with layout variants"
```

---

### Task 6: Create placeholder images

**Files:**
- Create: `src/assets/images/blog-placeholder-1.webp`
- Create: `src/assets/images/blog-placeholder-2.webp`
- Create: `src/assets/images/blog-placeholder-3.webp`

**Step 1: Generate solid-color placeholder images**

Use ImageMagick (or similar CLI) to create minimal placeholder images. If not available, create simple SVG data URIs inline in the mock data instead.

Option A — ImageMagick:
```bash
convert -size 800x600 xc:'#1a1a2e' src/assets/images/blog-placeholder-1.webp
convert -size 600x800 xc:'#16213e' src/assets/images/blog-placeholder-2.webp
convert -size 600x800 xc:'#0f3460' src/assets/images/blog-placeholder-3.webp
```

Option B — If ImageMagick unavailable, use inline SVG data URIs in Task 7 mock data:
```typescript
const PLACEHOLDER_1 = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect fill="%231a1a2e" width="800" height="600"/></svg>';
```

**Step 2: Commit (if Option A)**

```bash
git add src/assets/images/blog-placeholder-*.webp
git commit -m "feat(blog): add placeholder images for blog posts"
```

---

### Task 7: Create Blog section container

**Files:**
- Create: `src/components/Containers/Blog.tsx`

**Step 1: Create Blog.tsx**

Follow `ActivityFeed.tsx` pattern exactly:

```tsx
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

//* Components
import Container from './Container';
import Text from '../Text';
import BlogCard from '../BlogCard';

//? Hooks & Config
import { useBreakpoint, isMobile } from '../../hooks/useBreakpoint';
import { blogConfig } from '../../config/responsive';

//* Styles
import { sectionBase } from '../../styles/mixins';

//? Types
import type { BlogCardLayout } from '../../types';

//* Assets — placeholder images
import placeholder1 from '../../assets/images/blog-placeholder-1.webp';
import placeholder2 from '../../assets/images/blog-placeholder-2.webp';
import placeholder3 from '../../assets/images/blog-placeholder-3.webp';

const StyledBlog = styled.section`
	${sectionBase('blog')}
	justify-content: space-between;
	padding: var(--20) var(--12);
`;

const StyledBlogGrid = styled.div<{ $columns: number; $gap: string }>`
	width: 100%;
	display: grid;
	grid-template-columns: repeat(${(props) => props.$columns}, 1fr);
	gap: ${(props) => props.$gap};
`;

const CARD_LAYOUTS: BlogCardLayout[] = ['horizontal', 'vertical', 'horizontal-reverse'];
const THUMBNAILS = [placeholder1, placeholder2, placeholder3];

export default function Blog() {
	const bp = useBreakpoint();
	const cfg = blogConfig[bp];
	const { t } = useTranslation('home');

	const posts = t('blog.posts', { returnObjects: true }) as Array<{
		title: string;
		excerpt: string;
	}>;

	return (
		<StyledBlog>
			<Container
				w={cfg.outerW}
				maxW={cfg.outerMaxW}
				direction="column"
				justify="space-between"
				align={isMobile(bp) ? 'center' : 'start'}
				gap={cfg.outerGap}
			>
				<Text as="h2" variant="subtitle-sm" style={isMobile(bp) ? { alignSelf: 'flex-start' } : undefined}>
					{t('blog.title')}
				</Text>
				<StyledBlogGrid $columns={cfg.gridColumns} $gap={cfg.gridGap}>
					{posts.map((post, i) => (
						<BlogCard
							key={i}
							title={post.title}
							excerpt={post.excerpt}
							thumbnail={THUMBNAILS[i]}
							layout={CARD_LAYOUTS[i]}
						/>
					))}
				</StyledBlogGrid>
			</Container>
		</StyledBlog>
	);
}
```

NOTE: If placeholder images were created as SVG data URIs (Task 6 Option B), replace imports with inline constants.

**Step 2: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/Containers/Blog.tsx
git commit -m "feat(blog): create Blog section container with mock data"
```

---

### Task 8: Mount Blog in Home.tsx and update grid

**Files:**
- Modify: `src/pages/Home.tsx`

**Step 1: Add Blog import**

After the `ActivityFeed` import (line 16), add:

```typescript
import Blog from '../components/Containers/Blog';
```

**Step 2: Add Blog to JSX**

After `<ActivityFeed />` (line 82), add:

```tsx
<Blog />
```

**Step 3: Update StyledGrid grid-template-areas**

In the `StyledGrid` styled-component, update grid areas to include `blog`:

For `mq.up('desktop-sm')` (line 32-36):
```css
grid-template-areas:
  'about    profile  projects'
  'skills   works    works'
  'activity activity activity'
  'blog     blog     blog';
```

Also update `grid-template-rows` to add another `auto`:
```css
grid-template-rows: auto minmax(462px, auto) auto auto;
```

Similarly update the `desktop-lg` and `desktop-xl` overrides to include the extra `auto` row.

**Step 4: Verify it compiles and renders**

Run: `npm run dev`
Open in browser, verify the blog section appears below activity.

**Step 5: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat(blog): mount Blog section in Home grid layout"
```

---

### Task 9: Visual verification and polish

**Step 1: Check all breakpoints**

Open browser dev tools, resize through:
- Mobile (360px, 768px)
- Tablet (960px)
- Desktop (1280px, 1440px, 1801px)

Verify:
- Grid collapses to 1 column on mobile
- 3 columns on tablet+
- Cards show correct layouts (horizontal, vertical, horizontal-reverse)
- Glass effect and hover animations work
- Text truncation shows 3 lines + ellipsis
- Images maintain correct aspect ratios (4:3 vertical, 3:4 horizontal)

**Step 2: Fix any visual issues found**

Adjust padding, gaps, or sizing as needed.

**Step 3: Run lint**

Run: `npm run lint`
Expected: 0 warnings, 0 errors

**Step 4: Run build**

Run: `npm run build`
Expected: Successful build with no errors

**Step 5: Final commit if any polish needed**

```bash
git add -A
git commit -m "style(blog): visual polish and responsive adjustments"
```
