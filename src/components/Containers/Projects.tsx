import styled from 'styled-components';
import MediaQuery from 'react-responsive';

//* Components
import Container from '../../components/Containers/Container';
import ProjectCard from '../../components/ProjectCard';
import Text from '../../components/Text';

//* Assets
import patternVector from '../../assets/vectors/pattern-vector.svg';
import facheVector from '../../assets/vectors/fache.svg';
import facheAIVector from '../../assets/vectors/facheai.svg';
import centryBoardVector from '../../assets/vectors/centryboard.svg';

const StyledProjects = styled.div`
	width: 100%;
	height: 100%;
	padding: 0 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
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
			background-position: center;
			justify-content: space-between;
			border: none;
			border-left: 1px solid var(--secondary-60);
		}
	}
`;

function Projects() {
	return (
		<StyledProjects>
			<MediaQuery minWidth={360} maxWidth={767}>
				<Container
					h={"80%"}
					w={"100%"}
					maxW={"500px"}
					m={["36", "0", "36", "0"]}
					direction={"column"}
					justify={"center"}
					align={"center"}
					gap={"36px"}>

					<Container w={'100%'} justify={'flex-start'} align={'center'}>
						<Text variant={'subtitle-snd'} >
							PROJECTS
						</Text>
					</Container>
					<Container direction={'column'} justify={'center'} align={'center'} gap={'12px'}>
						<ProjectCard
							title={'CentryBoard'}
							details={'Productivity Booster App'}
							tag={"🛠️ Work in progress"}

							src={centryBoardVector}
							url={
								'https://centryboard.site'
							}
						/>
						<ProjectCard
							title={'fache.AI'}
							details={'AI Assistant App'}
							tag={"🛠️ Work in progress"}
							src={facheAIVector}
							url={'https://fache-ai-agent.vercel.app/'}
						/>
						<ProjectCard
							title={'fache.'}
							details={'Personal Website'}
							tag={"🚀 V2.0"}
							src={facheVector}
							url={'https://fache.tech'}
						/>
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={768} maxWidth={959}>
				<Container h={"80%"}
					w={"80%"}
					m={["36", "0", "36", "0"]}
					direction={"column"}
					justify={"center"}
					align={"center"}
					gap={"36px"}>
					<Container h={'100%'} w={'100%'} justify={'flex-start'} align={'center'}>
						<Text variant={'subtitle-snd'}>
							PROJECTS
						</Text>
					</Container>
					<Container direction={'column'} justify={'center'} align={'center'} gap={'12px'}>
						<ProjectCard
							title={'CentryBoard'}
							details={'Productivity Booster App'}
							tag={"🛠️ Work in progress"}

							src={centryBoardVector}
							url={
								'https://centryboard.site'
							}
						/>
						<ProjectCard
							title={'fache.AI'}
							details={'AI Assistant App'}
							tag={"🛠️ Work in progress"}
							src={facheAIVector}
							url={'https://fache-ai-agent.vercel.app/'}
						/>
						<ProjectCard
							title={'fache.'}
							details={'Personal Website'}
							tag={"🚀 V2.0"}
							src={facheVector}
							url={'https://fache.tech'}
						/>
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={960} maxWidth={1279}>
				<Container h={"100%"}
					w={"80%"}
					m={["36", "0", "36", "0"]}
					direction={"column"}
					justify={"center"}
					align={"center"}
					gap={"36px"}>
					<Container h={'100%'} w={'100%'} justify={'flex-start'} align={'center'}>
						<Text variant={'subtitle-snd'}>
							PROJECTS
						</Text>
					</Container>
					<Container direction={'column'} justify={'center'} align={'center'} gap={"12px"}>
						<ProjectCard
							title={'CentryBoard'}
							details={'Productivity Booster App'}
							tag={"🛠️ Work in progress"}

							src={centryBoardVector}
							url={
								'https://centryboard.site'
							}
						/>
						<ProjectCard
							title={'fache.AI'}
							details={'AI Assistant App'}
							tag={"🛠️ Work in progress"}
							src={facheAIVector}
							url={'https://fache-ai-agent.vercel.app/'}
						/>
						<ProjectCard
							title={'fache.'}
							details={'Personal Website'}
							tag={"🚀 V2.0"}
							src={facheVector}
							url={'https://fache.tech'}
						/>
					</Container>
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
						title={'CentryBoard'}
						details={'Productivity Booster App'}
						tag={"🛠️ Work in progress"}

						src={centryBoardVector}
						url={
							'https://centryboard.site'
						}
					/>
					<ProjectCard
						title={'fache.AI'}
						details={'AI Assistant App'}
						tag={"🛠️ Work in progress"}
						src={facheAIVector}
						url={'https://fache-ai-agent.vercel.app/'}
					/>
					<ProjectCard
						title={'fache.'}
						details={'Personal Website'}
						tag={"🚀 V2.0"}
						src={facheVector}
						url={'https://fache.tech'}
					/>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1340} maxWidth={1439}>
				<Container h={'100%'} w={'95%'} justify={'space-between'} align={'center'}>
					<Text variant={'subtitle-snd'} m={['48', '0', '36', '0']}>
						PROJECTS
					</Text>
				</Container>
				<Container h={"100%"} m={['0', '0', '36', '0']} direction={'column'} justify={'center'} align={'center'} gap={'12px'}>
					<ProjectCard
						title={'CentryBoard'}
						details={'Productivity Booster App'}
						tag={"🛠️ Work in progress"}

						src={centryBoardVector}
						url={
							'https://centryboard.site'
						}
					/>
					<ProjectCard
						title={'fache.AI'}
						details={'AI Assistant App'}
						tag={"🛠️ Work in progress"}
						src={facheAIVector}
						url={'https://fache-ai-agent.vercel.app/'}
					/>
					<ProjectCard
						title={'fache.'}
						details={'Personal Website'}
						tag={"🚀 V2.0"}
						src={facheVector}
						url={'https://fache.tech'}
					/>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1440} maxWidth={1800}>
				<Container w={"75%"} h={"100%"} minH={"510px"} m={['36', '0', '36', '0']} direction={"column"} justify={"center"} align={"center"} gap={"36px"}>
					<Container h={'100%'} w={'100%'} justify={'space-between'} align={'center'} >
						<Text variant={'subtitle-snd'}>
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
							title={'CentryBoard'}
							details={'Productivity Booster App'}
							tag={"🛠️ Work in progress"}

							src={centryBoardVector}
							url={
								'https://centryboard.site'
							}
						/>
						<ProjectCard
							title={'fache.AI'}
							details={'AI Assistant App'}
							tag={"🛠️ Work in progress"}
							src={facheAIVector}
							url={'https://fache-ai-agent.vercel.app/'}
						/>
						<ProjectCard
							title={'fache.'}
							details={'Personal Website'}
							tag={"🚀 V2.0"}
							src={facheVector}
							url={'https://fache.tech'}
						/>
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1801}>
				<Container w={"75%"} h={"100%"} minH={"570px"} m={['36', '0', '36', '0']} direction={"column"} justify={"center"} align={"center"} gap={"36px"}>
					<Container h={"auto"} w={'100%'} justify={'flex-start'} align={'center'}>
						<Text variant={'subtitle-snd'}>
							PROJECTS
						</Text>
					</Container>
					<Container h={"max-content"} direction={'column'} justify={'center'} align={'center'} gap={"20px"}>
						<ProjectCard
							title={'CentryBoard'}
							details={'Productivity Booster App'}
							tag={"🛠️ Work in progress"}
							src={centryBoardVector}
							url={
								'https://centryboard.site/'
							}
						/>
						<ProjectCard
							title={'fache.AI'}
							details={'AI Assistant App'}
							tag={"🛠️ Work in progress"}
							src={facheAIVector}
							url={'https://fache-ai-agent.vercel.app/'}
						/>
						<ProjectCard
							title={'fache.'}
							details={'Personal Website'}
							tag={"🚀 V2.0"}
							src={facheVector}
							url={'https://fache.tech'}
						/>
					</Container>
				</Container>
			</MediaQuery>
		</StyledProjects >
	);
}

export default Projects;
