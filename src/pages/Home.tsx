import Hero from "../components/Containers/Hero";
import Projects from "../components/Containers/Projects";
import Skills from "../components/Containers/Skills";
import Works from "../components/Containers/Works";
import Footer from "../components/Containers/Footer";

function Home() {
	return (
		<>
			<Hero></Hero>
			<Projects></Projects>
			<Skills></Skills>
			<Works></Works>
			<Footer></Footer>
		</>
	);
}

export default Home;
