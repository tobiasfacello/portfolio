//! Third-party
import { useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { mq } from '../config/breakpoints';

//? Hooks
import { useStaggerReveal } from '../hooks/useStaggerReveal';

//* Components
import Profile from '../components/Containers/Profile';
import About from '../components/Containers/About';
import Projects from '../components/Containers/Projects';
import Skills from '../components/Containers/Skills';
import Works from '../components/Containers/Works';
import ActivityFeed from '../components/Containers/ActivityFeed';
import Blog from '../components/Containers/Blog';
import Footer from '../components/Containers/Footer';

const StyledGrid = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
	padding: 0 12px;

	${mq.up('desktop-sm')} {
		width: 90%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: auto auto minmax(462px, auto) auto;
		grid-template-areas:
			'about    profile  projects'
			'activity activity activity'
			'skills   works    works'
			'blog     blog     blog';
		gap: 12px;
		padding: 0;
	}

	${mq.up('desktop-lg')} {
		grid-template-rows: auto auto minmax(510px, auto) auto;
	}

	${mq.up('desktop-xl')} {
		grid-template-rows: auto auto minmax(530px, auto) auto;
	}
`;

const StyledMain = styled.main`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
	padding-bottom: 72px;

	${mq.up('desktop-sm')} {
		padding-bottom: 96px;
	}
`;

function Home() {
	const { t } = useTranslation('common');
	const gridRef = useRef<HTMLDivElement>(null);
	const footerRef = useRef<HTMLElement>(null);

	useStaggerReveal(gridRef, footerRef);

	return (
		<>
			<a href="#main-content" className="skip-link">
				{t('skipLink')}
			</a>
			<StyledMain id="main-content">
				<h1 className="sr-only">Tobias Facello — Frontend Developer</h1>
				<StyledGrid ref={gridRef}>
					<Profile />
					<About />
					<Projects />
					<ActivityFeed />
					<Skills />
					<Works />
					<Blog />
				</StyledGrid>
				<Footer ref={footerRef} />
			</StyledMain>
		</>
	);
}

export default Home;
