import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Header        from './components/Header';
import Hero          from './components/sections/Hero';
import About         from './components/sections/About';
import Skills        from './components/sections/Skills';
import Projects      from './components/sections/Projects';
import Experience    from './components/sections/Experience';
import Contact       from './components/sections/Contact';
import Events        from './components/sections/Events';
import Footer        from './components/Footer';
import ScrollTop     from './components/ScrollTop';

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Header />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
          <Events />
        </main>
        <Footer />
        <ScrollTop />
      </ThemeProvider>
    </LanguageProvider>
  );
}
