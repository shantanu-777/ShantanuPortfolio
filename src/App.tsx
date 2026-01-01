import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CVSection } from './components/CVSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { strapiService } from './services/strapi';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  // Prefetch all data on initial load for instant navigation
  useEffect(() => {
    // Prefetch all data in parallel to cache it
    Promise.all([
      strapiService.getHero(),
      strapiService.getAbout(),
      strapiService.getProjects(),
      strapiService.getProfessionalExperiences(),
      strapiService.getEducations(),
      strapiService.getCoreCompetencies(),
      strapiService.getToolCategories(),
      strapiService.getAchievements(),
      strapiService.getContactInformation(),
      strapiService.getSoftSkills(),
      strapiService.getResearchPublications(),
      strapiService.getCVSection(),
    ]).catch((error) => {
      console.error('Error prefetching data:', error);
    });
  }, []);

  useEffect(() => {
    // Throttle scroll handler for better performance
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ['home', 'about', 'projects', 'cv', 'contact'];
          const scrollPosition = window.scrollY + 100;

          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header activeSection={activeSection} />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <CVSection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}