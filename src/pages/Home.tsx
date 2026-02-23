import Header from '../components/Containers/Header';
import Profile from '../components/Containers/Profile';
import About from '../components/Containers/About';
import Projects from '../components/Containers/Projects';
import Skills from '../components/Containers/Skills';
import Works from '../components/Containers/Works';
import Footer from '../components/Containers/Footer';
import Container from '../components/Containers/Container';

//? Hooks & Config
import { useBreakpoint } from '../hooks/useBreakpoint';
import { homeConfig } from '../config/responsive';

function Home() {
	const bp = useBreakpoint();
	const cfg = homeConfig[bp];

	if (!cfg.isDesktopLayout) {
		return (
			<>
				<a href="#main-content" className="skip-link">
					Skip to main content
				</a>
				<main id="main-content">
					<Container
						w={'100%'}
						h={'100%'}
						direction={'column'}
					>
						<Header />
						<Profile />
						<About />
					</Container>
					<Projects />
					<Skills />
					<Works />
					<Footer />
				</main>
			</>
		);
	}

	return (
		<>
			<a href="#main-content" className="skip-link">
				Skip to main content
			</a>
			<main id="main-content">
				<Container
					w={'100%'}
					h={'100%'}
					direction={'column'}
					justify={'center'}
					align={'center'}
				>
					<Header />
					<Container
						w={'100%'}
						h={'100%'}
						justify={'center'}
						align={'center'}
						$css={'border-top: 1px solid var(--secondary-60);'}
					>
						<Container
							w={'90%'}
							h={cfg.innerH || '100%'}
							justify={'center'}
							align={'center'}
							$css={`
								border-left: 1px solid var(--secondary-60);
								border-right: 1px solid var(--secondary-60);
							`}
						>
							<About />
							<Profile />
							<Projects />
						</Container>
					</Container>
				</Container>

				<Container
					w={'100%'}
					h={cfg.skillsWorkH}
					minH={cfg.skillsWorkMinH}
					justify={'center'}
					align={cfg.skillsWorkAlign}
					$css={'border-top: 1px solid var(--secondary-60);'}
				>
					<Container w={'90%'} h={'100%'} justify={'center'} align={'center'}>
						<Skills flex={1} />
						<Works flex={2} />
					</Container>
				</Container>
				<Footer />
			</main>
		</>
	);
}

export default Home;
