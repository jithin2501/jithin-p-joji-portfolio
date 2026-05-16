import Hero from './components/Hero';
import About from './components/About';
import TechStack from './components/TechStack';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Education from './components/Education';

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <TechStack />
        <Experience />
        <Projects />
        <Education />
      </main>
    </>
  );
}