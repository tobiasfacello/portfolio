import MediaQuery from 'react-responsive';

import Header from '../components/Containers/Header';
import Profile from '../components/Containers/Profile';
import About from '../components/Containers/About';
import Projects from '../components/Containers/Projects';
import Skills from '../components/Containers/Skills';
import Works from '../components/Containers/Works';
import Footer from '../components/Containers/Footer';
import Container from '../components/Containers/Container';

function Home() {
	return (
		<>
			{/* Mobile Layout */}
			<MediaQuery minWidth={360} maxWidth={959}>
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
			</MediaQuery>

			{/* Tablet Layout */}
			<MediaQuery minWidth={960} maxWidth={1279}>
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
			</MediaQuery>

			{/* Desktop Layout */}
			<MediaQuery minWidth={1280} maxWidth={1439}>
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
						style={'border-top: 1px solid var(--secondary-60);'}
					>
						<Container
							w={'90%'}
							h={"100%"}
							justify={'center'}
							align={'center'}
							style={`
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
					h={'60vh'}
					justify={'center'}
					align={'start'}
					style={'border-top: 1px solid var(--secondary-60);'}
				>
					<Container w={'90%'} justify={'center'} align={'center'}>
						<Skills />
						<Works />
					</Container>
				</Container>
				<Footer />
			</MediaQuery>
			<MediaQuery minWidth={1440} maxWidth={1800}>
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
						justify={'center'}
						align={'center'}
						style={'border-top: 1px solid var(--secondary-60);'}
					>
						<Container
							w={'90%'}
							h={"100%"}
							minH={"585px"}
							maxH={"585px"}
							justify={'center'}
							align={'center'}
							style={`
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
					h={'60vh'}
					justify={'center'}
					align={'start'}
					style={'border-top: 1px solid var(--secondary-60);'}
				>
					<Container w={'90%'} justify={'center'} align={'center'}>
						<Skills />
						<Works />
					</Container>
				</Container>
				<Footer />
			</MediaQuery>
			<MediaQuery minWidth={1801}>
				<Container
					w={'100%'}
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
						style={'border-top: 1px solid var(--secondary-60);'}
					>
						<Container
							w={'90%'}
							h={"fit-content"}
							justify={'center'}
							align={'center'}
							style={`
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
					h={'55vh'}
					justify={'center'}
					align={'start'}
					style={'border-top: 1px solid var(--secondary-60);'}
				>
					<Container w={'90%'} justify={'center'} align={'center'}>
						<Skills />
						<Works />
					</Container>
				</Container>
				<Footer />
			</MediaQuery>
		</>
	);
}

export default Home;
