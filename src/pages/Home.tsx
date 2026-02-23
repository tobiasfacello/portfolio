//! Third-party
import styled from 'styled-components';

//* Components
import Header from '../components/Containers/Header';
import Profile from '../components/Containers/Profile';
import About from '../components/Containers/About';
import Projects from '../components/Containers/Projects';
import Skills from '../components/Containers/Skills';
import Works from '../components/Containers/Works';
import Footer from '../components/Containers/Footer';

const StyledGrid = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;

	@media (min-width: 1280px) {
		width: 90%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: auto minmax(462px, auto);
		grid-template-areas:
			'about    profile  projects'
			'skills   works    works';
		border: 1px solid var(--secondary-60);
		border-bottom: none;
	}

	@media (min-width: 1440px) {
		grid-template-rows: auto minmax(510px, auto);
	}

	@media (min-width: 1801px) {
		grid-template-rows: auto minmax(530px, auto);
	}
`;

const StyledMain = styled.main`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

function Home() {
	return (
		<>
			<a href="#main-content" className="skip-link">
				Skip to main content
			</a>
			<StyledMain id="main-content">
				<Header />
				<StyledGrid>
					<Profile />
					<About />
					<Projects />
					<Skills />
					<Works />
				</StyledGrid>
				<Footer />
			</StyledMain>
		</>
	);
}

export default Home;
