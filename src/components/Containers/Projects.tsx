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
			justify-content: center;
			border: none;
			border-left: 1px solid var(--secondary-60);
			border-right: 1px solid var(--secondary-60);
		}
	}
`;

function Projects() {
	return (
		<StyledProjects>
			<MediaQuery minWidth={360} maxWidth={767}>
				<Container h={'auto'} w={'70%'} justify={'start'} align={'center'}>
					<Text variant={'subtitle-snd'} m={['m', 'zero', 'm', 'zero']}>
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
			<MediaQuery minWidth={768} maxWidth={959}>
				<Container h={'auto'} w={'70%'} justify={'start'} align={'center'}>
					<Text variant={'subtitle-snd'} m={['m', 'zero', 'm', 'zero']}>
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
				<Container h={'auto'} w={'70%'} justify={'start'} align={'center'}>
					<Text variant={'subtitle-snd'} m={['m', 'zero', 'm', 'zero']}>
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
				<Container h={'auto'} w={'95%'} justify={'start'} align={'center'}>
					<Text variant={'subtitle-snd'} m={['s', 'zero', 's', 'zero']}>
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
			<MediaQuery minWidth={1340} maxWidth={1439}>
				<Container h={'auto'} w={'95%'} justify={'start'} align={'center'}>
					<Text variant={'subtitle-snd'} m={['xl', 'zero', 'l', 'zero']}>
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
			<MediaQuery minWidth={1440} maxWidth={1800}>
				<Container h={'auto'} w={'95%'} justify={'start'} align={'center'}>
					<Text variant={'subtitle-snd'} m={['xl', 'zero', 'l', 'zero']}>
						PROJECTS
					</Text>
				</Container>
				<Container
					direction={'column'}
					justify={'space-evenly'}
					align={'center'}
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
				<Container w={'70%'} justify={'start'} align={'center'}>
					<Text variant={'subtitle-snd'} m={['xl', 'zero', 'l', 'zero']}>
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
		</StyledProjects>
	);
}

export default Projects;
