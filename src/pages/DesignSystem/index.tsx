//! React
import { useEffect, useMemo, useState } from 'react';

//! Router
import { Link } from 'react-router-dom';

//! Lenis
import { useLenis } from 'lenis/react';

//* Registry
import { CATEGORIES, TOTAL_COMPONENTS } from './registry';

//* Styled
import {
	StyledPage,
	StyledShell,
	StyledHeader,
	StyledHeaderRow,
	StyledCount,
	StyledLead,
	StyledSidebar,
	StyledSidebarGroup,
	StyledSidebarTitle,
	StyledSidebarLink,
	StyledSearch,
	StyledContent,
	StyledSection,
	StyledSectionHeading,
	StyledEntry,
	StyledEntryHeader,
	StyledEntryTitleRow,
	StyledEntryTitle,
	StyledExtendsBadge,
	StyledEntryNote,
	StyledPreview,
	StyledEmpty,
	StyledBackLink,
} from './styled';

//* Components
import Text from '../../components/Text';

function DesignSystem() {
	const [query, setQuery] = useState('');
	const lenis = useLenis();

	/**
	 * This page is lazy-loaded and the shell resets scroll on route change, so a
	 * deep link lands at the top before its target exists. Resolve the hash once
	 * the entries are mounted, and hand the scroll to Lenis when it is driving.
	 */
	useEffect(() => {
		const slug = decodeURIComponent(window.location.hash.slice(1));
		if (!slug) return;

		const target = document.getElementById(slug);
		if (!target) return;

		if (lenis) lenis.scrollTo(target, { offset: -24, immediate: true });
		else target.scrollIntoView();
	}, [lenis]);

	const visible = useMemo(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return CATEGORIES;

		return CATEGORIES.map((category) => ({
			...category,
			entries: category.entries.filter(
				(entry) =>
					entry.name.toLowerCase().includes(needle) ||
					entry.slug.includes(needle) ||
					entry.note.toLowerCase().includes(needle),
			),
		})).filter((category) => category.entries.length > 0);
	}, [query]);

	const matchCount = visible.reduce((total, category) => total + category.entries.length, 0);

	// Anchor jumps fight Lenis' own scroll loop, so route them through it and let
	// the URL update without the browser doing its own instant jump.
	const jumpTo = (event: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
		const target = document.getElementById(slug);
		if (!target || !lenis) return;

		event.preventDefault();
		lenis.scrollTo(target, { offset: -24 });
		window.history.replaceState(null, '', `#${slug}`);
	};

	return (
		<StyledPage>
			<StyledHeader>
				<StyledBackLink as={Link} to="/">
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M7.5 2.5 4 6l3.5 3.5" />
					</svg>
					Back to portfolio
				</StyledBackLink>

				<StyledHeaderRow>
					<Text as="h1" variant="subtitle">
						Design System
					</Text>
					<StyledCount>
						{query ? `${matchCount} of ${TOTAL_COMPONENTS}` : `${TOTAL_COMPONENTS} components`}
					</StyledCount>
				</StyledHeaderRow>

				<StyledLead>
					Micro-interactions rebuilt on this project&apos;s own tokens, typography and
					surfaces. Behaviour lives in headless hooks; the visual layer is
					styled-components and every animation runs on GSAP.
				</StyledLead>
			</StyledHeader>

			<StyledShell>
				<StyledSidebar aria-label="Components">
					<StyledSearch
						type="search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Filter components"
						aria-label="Filter components"
					/>

					{visible.map((category) => (
						<StyledSidebarGroup key={category.id}>
							<StyledSidebarTitle>{category.title}</StyledSidebarTitle>
							{category.entries.map((entry) => (
								<StyledSidebarLink
									key={entry.slug}
									href={`#${entry.slug}`}
									onClick={(event) => jumpTo(event, entry.slug)}
								>
									{entry.name}
								</StyledSidebarLink>
							))}
						</StyledSidebarGroup>
					))}
				</StyledSidebar>

				<StyledContent>
					{visible.length === 0 ? (
						<StyledEmpty>No components match “{query}”.</StyledEmpty>
					) : (
						visible.map((category) => (
							<StyledSection key={category.id} id={category.id}>
								<StyledSectionHeading>{category.title}</StyledSectionHeading>

								{category.entries.map((entry) => {
									const Demo = entry.demo;
									return (
										<StyledEntry key={entry.slug} id={entry.slug}>
											<StyledEntryHeader>
												<StyledEntryTitleRow>
													<StyledEntryTitle>{entry.name}</StyledEntryTitle>
													{entry.extends ? (
														<StyledExtendsBadge>extends {entry.extends}</StyledExtendsBadge>
													) : null}
												</StyledEntryTitleRow>
												<StyledEntryNote>{entry.note}</StyledEntryNote>
											</StyledEntryHeader>
											<StyledPreview $align={entry.align}>
												<Demo />
											</StyledPreview>
										</StyledEntry>
									);
								})}
							</StyledSection>
						))
					)}
				</StyledContent>
			</StyledShell>
		</StyledPage>
	);
}

export default DesignSystem;
