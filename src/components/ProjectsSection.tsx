import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useProjects } from '../hooks/useStrapiData';
import { Project as StrapiProject } from '../services/strapi';
import { STRAPI_CONFIG } from '../config/strapi';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  category: 'ml' | 'dl' | 'cv' | 'nlp' | 'autoencoder' | 'gan' | 'generativeai' | 'powerbi' | 'graduation';
  liveUrl?: string;
  featured?: boolean;
  order?: number;
}

export function ProjectsSection() {
  const { data: strapiProjects, loading, error } = useProjects();

  // Debug logging
  console.log('Projects from Strapi:', strapiProjects);
  console.log('Loading:', loading);
  console.log('Error:', error);

  // Helper function to map Strapi category to frontend category
  const mapCategory = (strapiCategory: string): Project['category'] => {
    const categoryMap: Record<string, Project['category']> = {
      'ML': 'ml',
      'DS': 'dl',
      'CV': 'cv',
      'NLP': 'nlp',
      'autoencoder': 'autoencoder',
      'generative Ai': 'generativeai',
      'generativeai': 'generativeai',
      'power Bi': 'powerbi',
      'powerbi': 'powerbi',
      'graduation': 'graduation',
      'gan': 'gan',
      // Also handle lowercase versions
      'ml': 'ml',
      'dl': 'dl',
      'cv': 'cv',
      'nlp': 'nlp',
    };
    return categoryMap[strapiCategory] || 'ml'; // Default to 'ml' if unknown
  };

  // Helper function to extract image URL from Strapi
  const getImageUrl = (project: StrapiProject): string => {
    // Check if imageUrl is already set (direct URL)
    if (project.imageUrl) {
      return project.imageUrl.startsWith('http') 
        ? project.imageUrl 
        : `${STRAPI_CONFIG.baseUrl}${project.imageUrl}`;
    }
    
    // Check Strapi v5 format - direct url (with type assertion for flexibility)
    const image = project.image as any;
    if (image?.url) {
      return `${STRAPI_CONFIG.baseUrl}${image.url}`;
    }
    
    // Check Strapi v4 format - nested in data.attributes
    if (project.image?.data?.attributes?.url) {
      return `${STRAPI_CONFIG.baseUrl}${project.image.data.attributes.url}`;
    }
    
    // Fallback to a default image
    return 'https://images.unsplash.com/photo-1684610529682-553625a1ffed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBkYXRhJTIwdmlzdWFsaXphdGlvbnxlbnwxfHx8fDE3NTYyODk0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
  };

  // Map Strapi projects to component format
  const projects: Project[] = strapiProjects.map((project) => ({
    id: project.id.toString(),
    title: project.title,
    description: project.description,
    image: getImageUrl(project),
    technologies: Array.isArray(project.technologies) ? project.technologies : [],
    githubUrl: project.githubUrl,
    category: mapCategory(project.category as string),
    liveUrl: project.liveUrl,
    featured: project.featured ?? false,
    order: project.order ?? 0,
  }));

  console.log('Mapped projects:', projects);

  // No fallback data - only use Strapi projects
  const displayProjects = projects;

  console.log('Display projects count:', displayProjects.length);
  console.log('Using Strapi data:', strapiProjects.length > 0);

  // Show loading state
  if (loading) {
    return (
      <section id="projects" className="py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no projects
  if (!loading && displayProjects.length === 0) {
    return (
      <section id="projects" className="py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">No projects available. Please add projects in Strapi.</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state (but still display projects if available)
  if (error) {
    console.error('Error loading projects from Strapi:', error);
  }

  const categories = [
    { id: 'all', label: 'All Projects', count: displayProjects.length },
    { id: 'ml', label: 'ML', count: displayProjects.filter(p => p.category === 'ml').length },
    { id: 'dl', label: 'DL', count: displayProjects.filter(p => p.category === 'dl').length },
    { id: 'cv', label: 'CV', count: displayProjects.filter(p => p.category === 'cv').length },
    { id: 'nlp', label: 'NLP', count: displayProjects.filter(p => p.category === 'nlp').length },
    { id: 'autoencoder', label: 'AutoEncoder', count: displayProjects.filter(p => p.category === 'autoencoder').length },
    { id: 'gan', label: 'GAN', count: displayProjects.filter(p => p.category === 'gan').length },
    { id: 'generativeai', label: 'Generative AI', count: displayProjects.filter(p => p.category === 'generativeai').length },
    { id: 'powerbi', label: 'PowerBI', count: displayProjects.filter(p => p.category === 'powerbi').length },
    { id: 'graduation', label: 'Graduation', count: displayProjects.filter(p => p.category === 'graduation').length }
  ];

  const categoryRepositories = {
    ml: 'https://github.com/shantanu-777/ML-Projects',
    dl: 'https://github.com/shantanu-777/DL-Projects',
    cv: 'https://github.com/shantanu-777/CV-Projects',
    nlp: 'https://github.com/shantanu-777/NLP-Projects',
    autoencoder: 'https://github.com/shantanu-777/AutoEncoder-Projects',
    gan: 'https://github.com/shantanu-777/GAN-Projects',
    generativeai: 'https://github.com/shantanu-777/Generative-AI-Projects',
    powerbi: 'https://github.com/shantanu-777/PowerBI-Projects',
    graduation: 'https://github.com/shantanu-777/Leader-Graduation-Project'
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/20">
        <div className="relative overflow-hidden">
          <ImageWithFallback
            src={project.image}
            alt={project.title}
            className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <CardContent className="flex-1 p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="text-xs uppercase tracking-wide">
              {project.category.toUpperCase()}
            </Badge>
          </div>
          
          <h3 className="text-xl mb-3 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          
          <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs px-2 py-1 hover:bg-primary hover:text-primary-foreground transition-colors">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{project.technologies.length - 4} more
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0 flex gap-3">
          <Button variant="outline" size="sm" className="flex-1 group/btn" asChild>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
              Code
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  const ViewMoreButton = ({ category }: { category: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="col-span-full flex justify-center mt-8"
    >
      <Button variant="outline" size="lg" className="group" asChild>
        <a 
          href={categoryRepositories[category as keyof typeof categoryRepositories]} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Github className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
          View More {category.toUpperCase()} Projects
          <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
      </Button>
    </motion.div>
  );

  const AllProjectsButton = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="col-span-full flex justify-center mt-8"
    >
      <Button variant="default" size="lg" className="group" asChild>
        <a 
          href="https://github.com/shantanu-777/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Github className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
          View All My Projects
          <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
      </Button>
    </motion.div>
  );

  return (
    <section id="projects" className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Showcasing 100+ AI & ML projects across machine learning, deep learning, computer vision, 
            natural language processing, generative AI, and business intelligence. Each project demonstrates 
            hands-on implementation with real-world applications.
          </p>
        </motion.div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-16 bg-muted/50 p-1 h-auto">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-sm font-medium py-3 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <div className="flex flex-col items-center gap-1">
                  <span>{category.label}</span>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {category.count}
                  </Badge>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjects.slice(0, 12).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              <AllProjectsButton />
            </div>
          </TabsContent>

          {['ml', 'dl', 'cv', 'nlp', 'autoencoder', 'gan', 'generativeai', 'powerbi', 'graduation'].map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayProjects
                  .filter((project) => project.category === category)
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                <ViewMoreButton category={category} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}