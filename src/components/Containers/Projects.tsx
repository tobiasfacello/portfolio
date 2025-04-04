import styled from 'styled-components';
import MediaQuery from 'react-responsive';

//* Components
import Container from '../../components/Containers/Container';
import ProjectCard from '../../components/ProjectCard';
import Text from '../../components/Text';

//* Assets
import patternVector from '../../assets/vectors/pattern-vector.svg';
import portfolioVector from '../../assets/vectors/portfolio-vector.svg';
import chatAppVector from '../../assets/vectors/chatapp-vector.svg';
import rpsVector from '../../assets/vectors/rps-vector.svg';

const StyledProjects = styled.div`
	width: 100%;
	height: 100%;
	padding: 0 20px;
	border-top: 1px solid var(--secondary-60);
	background-image: url(${patternVector});
	background-size: auto;
	background-position: center;
	background-repeat: no-repeat;

	@media (min-width: 960px) {
		& {
			background-position: top right;
		}
	}

	@media (min-width: 1280px) {
		& {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			border: none;
		}
	}
`;

function Projects() {
	return (
		<StyledProjects>
			<MediaQuery minWidth={360} maxWidth={767}>
				<Container h={'auto'} w={'70%'} justify={'start'} align={'center'}>
					<Text variant={'subtitle-snd'} m={['36', '0', '36', '0']}>
						PROJECTS
					</Text>
				</Container>
				<Container m={["0", "0", "36", "0"]} direction={'column'} justify={'center'} align={'center'} gap={'12px'}>
					<ProjectCard
						title={'Portfolio'}
						details={'Personal Website'}
						src={portfolioVector}
						url={
							'https://contra.com/p/YeXNEkRN-fache-portfolio-design-and-development'
						}
					/>
					<ProjectCard
						title={'Apxgram'}
						details={'Realtime Chat App'}
						src={chatAppVector}
						url={'https://apxgram-chatapp.onrender.com/'}
					/>
					<ProjectCard
						title={'RPS'}
						details={'Realtime Game'}
						src={rpsVector}
						url={'https://rps-gameapp.onrender.com/'}
					/>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={768} maxWidth={959}>
				<Container h={'100%'} w={'70%'} justify={'start'} align={'center'}>
					<Text variant={'subtitle-snd'} m={['24', '0', '24', '0']}>
						PROJECTS
					</Text>
				</Container>
				<Container direction={'column'} justify={'center'} align={'center'}>
					<ProjectCard
						title={'Portfolio'}
						details={'Personal Website'}
						src={portfolioVector}
						url={
							'https://contra.com/p/YeXNEkRN-fache-portfolio-design-and-development'
						}
					/>
					<ProjectCard
						title={'Apxgram'}
						details={'Realtime Chat App'}
						src={chatAppVector}
						url={'https://apxgram-chatapp.onrender.com/'}
					/>
					<ProjectCard
						title={'RPS'}
						details={'Realtime Game'}
						src={rpsVector}
						url={'https://rps-gameapp.onrender.com/'}
					/>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={960} maxWidth={1279}>
				<Container h={'100%'} w={'70%'} justify={'start'} align={'center'}>
					<Text variant={'subtitle-snd'} m={['24', '0', '24', '0']}>
						PROJECTS
					</Text>
				</Container>
				<Container direction={'column'} justify={'center'} align={'center'}>
					<ProjectCard
						title={'Portfolio'}
						details={'Personal Website'}
						src={portfolioVector}
						url={
							'https://contra.com/p/YeXNEkRN-fache-portfolio-design-and-development'
						}
					/>
					<ProjectCard
						title={'Apxgram'}
						details={'Realtime Chat App'}
						src={chatAppVector}
						url={'https://apxgram-chatapp.onrender.com/'}
					/>
					<ProjectCard
						title={'RPS'}
						details={'Realtime Game'}
						src={rpsVector}
						url={'https://rps-gameapp.onrender.com/'}
					/>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1280} maxWidth={1339}>
				<Container h={'100%'} w={'95%'} justify={'space-between'} align={'center'}>
					<Text variant={'subtitle-snd'} m={['48', '0', '36', '0']}>
						PROJECTS
					</Text>
				</Container>
				<Container h={"100%"} m={['0', '0', '36', '0']} direction={'column'} justify={'center'} align={'center'} gap={"12px"}>
					<ProjectCard
						title={'Portfolio'}
						details={'Personal Website'}
						src={portfolioVector}
						url={
							'https://contra.com/p/YeXNEkRN-fache-portfolio-design-and-development'
						}
					/>
					<ProjectCard
						title={'Apxgram'}
						details={'Realtime Chat App'}
						src={chatAppVector}
						url={'https://apxgram-chatapp.onrender.com/'}
					/>
					<ProjectCard
						title={'RPS'}
						details={'Realtime Game'}
						src={rpsVector}
						url={'https://rps-gameapp.onrender.com/'}
					/>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1340} maxWidth={1439}>
				<Container h={'100%'} w={'95%'} justify={'space-between'} align={'center'}>
					<Text variant={'subtitle-snd'} m={['48', '0', '36', '0']}>
						PROJECTS
					</Text>
				</Container>
				<Container h={"100%"} m={['0', '0', '36', '0']} direction={'column'} justify={'center'} align={'center'} gap={'8px'}>
					<ProjectCard
						title={'Portfolio'}
						details={'Personal Website'}
						src={portfolioVector}
						url={
							'https://contra.com/p/YeXNEkRN-fache-portfolio-design-and-development'
						}
					/>
					<ProjectCard
						title={'Apxgram'}
						details={'Realtime Chat App'}
						src={chatAppVector}
						url={'https://apxgram-chatapp.onrender.com/'}
					/>
					<ProjectCard
						title={'RPS'}
						details={'Realtime Game'}
						src={rpsVector}
						url={'https://rps-gameapp.onrender.com/'}
					/>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1440} maxWidth={1800}>
				<Container h={'100%'} w={'95%'} justify={'space-between'} align={'center'} >
					<Text variant={'subtitle-snd'} m={['48', '0', '36', '0']}>
						PROJECTS
					</Text>
				</Container>
				<Container
					h={"100%"}
					m={['0', '0', '36', '0']}
					direction={'column'}
					justify={'space-between'}
					align={'center'}
					gap={"12px"}
				>
					<ProjectCard
						title={'Portfolio'}
						details={'Personal Website'}
						src={portfolioVector}
						url={
							'https://contra.com/p/YeXNEkRN-fache-portfolio-design-and-development'
						}
					/>
					<ProjectCard
						title={'Apxgram'}
						details={'Realtime Chat App'}
						src={chatAppVector}
						url={'https://apxgram-chatapp.onrender.com/'}
					/>
					<ProjectCard
						title={'RPS'}
						details={'Realtime Game'}
						src={rpsVector}
						url={'https://rps-gameapp.onrender.com/'}
					/>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1801}>
				<Container h={"100%"} w={'70%'} justify={'flex-start'} align={'center'}>
					<Text variant={'subtitle-snd'} m={['48', '0', '36', '0']}>
						PROJECTS
					</Text>
				</Container>
				<Container h={"100%"} m={['0', '0', '36', '0']} direction={'column'} justify={'flex-start'} align={'center'} gap={"12px"}>
					<ProjectCard
						title={'Portfolio'}
						details={'Personal Website'}
						src={portfolioVector}
						url={
							'https://contra.com/p/YeXNEkRN-fache-portfolio-design-and-development'
						}
					/>
					<ProjectCard
						title={'Apxgram'}
						details={'Realtime Chat App'}
						src={chatAppVector}
						url={'https://apxgram-chatapp.onrender.com/'}
					/>
					<ProjectCard
						title={'RPS'}
						details={'Realtime Game'}
						src={rpsVector}
						url={'https://rps-gameapp.onrender.com/'}
					/>
				</Container>
			</MediaQuery>
		</StyledProjects>
	);
}

export default Projects;
