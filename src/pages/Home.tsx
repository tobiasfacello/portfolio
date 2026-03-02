//! Third-party
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

//* Components
import Header from '../components/Containers/Header';
import Profile from '../components/Containers/Profile';
import About from '../components/Containers/About';
import Projects from '../components/Containers/Projects';
import Skills from '../components/Containers/Skills';
import Works from '../components/Containers/Works';
import ActivityFeed from '../components/Containers/ActivityFeed';
import Footer from '../components/Containers/Footer';

const StyledGrid = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
	padding: 0 12px;

	@media (min-width: 1280px) {
		width: 90%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: auto minmax(462px, auto) auto;
		grid-template-areas:
			'about    profile  projects'
			'skills   works    works'
			'activity activity activity';
		gap: 12px;
		padding: 0;
	}

	@media (min-width: 1440px) {
		grid-template-rows: auto minmax(510px, auto) auto;
	}

	@media (min-width: 1801px) {
		grid-template-rows: auto minmax(530px, auto) auto;
	}
`;

const StyledMain = styled.main`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
	padding-bottom: 72px;

	@media (min-width: 1280px) {
		padding-bottom: 96px;
	}
`;

function Home() {
	const { t } = useTranslation('common');

	return (
		<>
			<a href="#main-content" className="skip-link">
				{t('skipLink')}
			</a>
			<StyledMain id="main-content">
				<h1 className="sr-only">Tobias Facello — Frontend Developer</h1>
				<Header />
				<StyledGrid>
					<Profile />
					<About />
					<Projects />
					<Skills />
					<Works />
					<ActivityFeed />
				</StyledGrid>
				<Footer />
			</StyledMain>
		</>
	);
}

export default Home;
