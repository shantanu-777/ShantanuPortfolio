import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Brain, Eye, MessageSquare, BarChart3, Settings, Database, PieChart, FlaskConical, Award, GraduationCap, MapPin, Calendar, Briefcase } from 'lucide-react';
import { 
  useAbout, 
  useAchievements, 
  useProfessionalExperiences, 
  useEducations, 
  useCoreCompetencies, 
  useToolCategories, 
  useResearchPublications,
  useSoftSkills
} from '../hooks/useStrapiData';
import { getIcon } from '../utils/iconMapper';
import { STRAPI_CONFIG } from '../config/strapi';
import { ProfessionalExperience } from '../services/strapi';

export function AboutSection() {
  // Fetch data from Strapi
  const { data: aboutData } = useAbout();
  const { data: achievements } = useAchievements();
  const { data: professionalExperiences } = useProfessionalExperiences();
  const { data: educations } = useEducations();
  const { data: coreCompetencies } = useCoreCompetencies();
  const { data: toolCategories } = useToolCategories();
  const { data: researchPublications } = useResearchPublications();
  const { data: softSkills } = useSoftSkills();

  // Debug logging
  console.log('About data from Strapi:', aboutData);
  console.log('Professional experiences:', professionalExperiences);
  console.log('Educations:', educations);
  console.log('Core competencies:', coreCompetencies);
  console.log('Tool categories:', toolCategories);
  console.log('Research publications:', researchPublications);

  // Map icon names to icon components
  const iconMap: Record<string, any> = {
    Brain,
    Eye,
    MessageSquare,
    Database,
    Settings,
    PieChart,
    FlaskConical,
  };

  // Transform core competencies from Strapi - flatten to individual certification cards
  type CertificationCard = {
    certification: string | null;
    competencyName: string;
    icon: any;
    description: string;
  };

  const certificationCards: CertificationCard[] = coreCompetencies.flatMap((comp): CertificationCard[] => {
    // Handle certifications - could be array or single object
    let certTitles: string[] = [];
    if (comp.certifications) {
      if (Array.isArray(comp.certifications)) {
        certTitles = comp.certifications.map((cert: any) => 
          typeof cert === 'object' && cert !== null && cert.title ? cert.title : String(cert)
        ).filter(Boolean);
      } else if (typeof comp.certifications === 'object' && comp.certifications !== null) {
        const certObj = comp.certifications as any;
        if (certObj.title) {
          certTitles = [certObj.title].filter(Boolean);
        }
      }
    }
    
    const icon = iconMap[comp.icon] || Brain;
    
    // Create one card per certification
    if (certTitles.length > 0) {
      return certTitles.map((cert): CertificationCard => ({
        certification: cert,
        competencyName: comp.name,
        icon: icon,
        description: comp.description
      }));
    }
    
    // If no certifications, still create one card to show the competency
    return [{
      certification: null,
      competencyName: comp.name,
      icon: icon,
      description: comp.description
    }];
  });

  // State for modal
  const [selectedExperience, setSelectedExperience] = useState<(ProfessionalExperience & { period?: string }) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Transform and sort professional experiences from Strapi (descending by date - most recent first) - no fallback data
  const professionalJourney = [...professionalExperiences]
    .sort((a, b) => {
      // Sort by startDate descending (most recent first)
      // If isCurrent is true, prioritize it
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateB - dateA; // Descending order
    })
    .map(exp => ({
      ...exp,
      period: exp.isCurrent 
        ? `${new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – Present`
        : `${new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – ${exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}`,
    } as ProfessionalExperience & { period: string }));

  // Transform tool categories from Strapi - no fallback data
  const tools = toolCategories.map(cat => ({
    category: cat.category,
    items: cat.tools?.map(tool => tool.name) || []
  }));

  // Use achievements from Strapi only - no fallback data
  const displayAchievements = achievements;

  // Use bio from Strapi only - no fallback data
  const bio = aboutData?.bio || '';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {bio}
          </p>
        </motion.div>

        {/* Achievements Stats - Ultra Compact */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12 max-w-2xl mx-auto"
        >
          {displayAchievements.map((achievement, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="text-center p-3 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="text-xl md:text-2xl mb-0.5 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {achievement.number}
                  </div>
                  <div className="text-sm mb-0.5">{achievement.label}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{achievement.description}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Row 1: Professional Journey | Tools & Technologies */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Professional Journey Timeline - Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-full flex flex-col"
          >
            <Card className="h-full flex flex-col">
              <CardContent className="p-8 flex flex-col flex-1 min-h-0">
                <h3 className="text-2xl mb-8">Professional Journey</h3>
                <div className="relative flex-1 min-h-0 overflow-hidden">
                  {/* Timeline vertical line - chain design */}
                  <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/60 to-primary/30 opacity-40"></div>
                  
                  <div className="space-y-6 overflow-y-auto max-h-full pr-2 custom-scrollbar">
                    {professionalJourney.map((job, index) => {
                      const isLast = index === professionalJourney.length - 1;
                      return (
                        <motion.div
                          key={job.id || index}
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.15 }}
                          viewport={{ once: true }}
                          className="relative pl-20"
                        >
                          {/* Timeline connector chain - horizontal line connecting to vertical */}
                          {!isLast && (
                            <div className="absolute left-8 top-8 w-12 h-0.5 bg-primary/40"></div>
                          )}
                          
                          {/* Timeline dot/chain link */}
                          <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-lg ring-2 ring-primary/20 z-10">
                            {job.isCurrent && (
                              <div className="absolute inset-0 rounded-full bg-primary animate-pulse"></div>
                            )}
                          </div>
                          
                          {/* Clickable card */}
                          <div 
                            onClick={() => {
                              setSelectedExperience(job);
                              setIsModalOpen(true);
                            }}
                            className="bg-secondary/30 rounded-lg p-6 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                              <h4 className="text-lg text-foreground font-semibold group-hover:text-primary transition-colors">
                                {job.title} @ {job.company}
                              </h4>
                              <Badge variant={job.isCurrent ? "default" : "secondary"} className="w-fit mt-2 md:mt-0">
                                {(job as ProfessionalExperience & { period?: string }).period || 
                                  (job.isCurrent 
                                    ? `${new Date(job.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – Present`
                                    : `${new Date(job.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – ${job.endDate ? new Date(job.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}`)
                                }
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {job.description}
                            </p>
                            {job.technologies && Array.isArray(job.technologies) && job.technologies.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {job.technologies.slice(0, 3).map((tech, techIndex) => (
                                  <Badge key={techIndex} variant="outline" className="text-xs">
                                    {typeof tech === 'string' ? tech : String(tech)}
                                  </Badge>
                                ))}
                                {job.technologies.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{job.technologies.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                            <div className="mt-3 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to view full details →
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Experience Details Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    {selectedExperience && (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-2xl flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-primary" />
                            {selectedExperience.title}
                          </DialogTitle>
                          <DialogDescription className="text-lg mt-2">
                            {selectedExperience.company}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 mt-4">
                          {/* Period and Location */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {selectedExperience.period || 
                                  (selectedExperience.isCurrent 
                                    ? `${new Date(selectedExperience.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – Present`
                                    : `${new Date(selectedExperience.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – ${selectedExperience.endDate ? new Date(selectedExperience.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}`)
                                }
                              </span>
                            </div>
                            {selectedExperience.location && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{selectedExperience.location}</span>
                              </div>
                            )}
                            {selectedExperience.isCurrent && (
                              <Badge variant="default" className="ml-auto">
                                Current Position
                              </Badge>
                            )}
                          </div>
                          
                          {/* Description */}
                          <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                              {selectedExperience.description}
                            </p>
                          </div>
                          
                          {/* Technologies */}
                          {selectedExperience.technologies && Array.isArray(selectedExperience.technologies) && selectedExperience.technologies.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-3">Technologies Used</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedExperience.technologies.map((tech, techIndex) => (
                                  <Badge key={techIndex} variant="secondary" className="text-sm py-1.5 px-3">
                                    {typeof tech === 'string' ? tech : String(tech)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tools & Technologies - Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-full flex flex-col"
          >
            <Card className="h-full flex flex-col">
              <CardContent className="p-8 flex flex-col flex-1 min-h-0">
                <h3 className="text-2xl mb-8">Tools & Technologies</h3>
                <div className="relative flex-1 min-h-0 overflow-hidden">
                  <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-6">
                      {tools.map((category, categoryIndex) => (
                        <motion.div
                          key={category.category}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <h4 className="text-sm mb-3 text-muted-foreground uppercase tracking-wide">
                            {category.category}
                          </h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {category.items.map((tool) => (
                              <Badge 
                                key={tool}
                                variant="secondary" 
                                className="text-xs px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                              >
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Row 2: Core Competencies & Certifications | Research & Publications */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Core Competencies with Certifications - Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl">Core Competencies & Certifications</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {certificationCards.map((card, index) => (
                    <motion.div
                      key={`${card.competencyName}-${card.certification || 'no-cert'}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                      className="group"
                    >
                      <div className="relative p-4 rounded-xl border border-border/50 hover:border-primary/30 bg-gradient-to-br from-card to-secondary/30 hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col">
                        <div className="flex flex-col items-center space-y-3 flex-1">
                          {/* Icon - Highlighted at top */}
                          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <card.icon className="w-6 h-6 text-primary-foreground" />
                          </div>
                          
                          {/* Certification - Highlighted in middle */}
                          <div className="flex-1 flex items-center justify-center w-full">
                            {card.certification ? (
                              <p className="text-sm font-semibold text-foreground text-center leading-tight px-2">
                                {card.certification}
                              </p>
                            ) : (
                              <p className="text-xs text-muted-foreground/50 text-center">
                                No certification
                              </p>
                            )}
                          </div>
                          
                          {/* Competency name - Less highlighted at bottom */}
                          <div className="mt-auto pt-2 w-full border-t border-border/30">
                            <p className="text-xs text-muted-foreground/60 text-center leading-tight">
                              {card.competencyName}
                            </p>
                          </div>
                        </div>
                        
                        {/* Subtle hover effect overlay */}
                        <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Research & Publications - Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 h-full">
              <CardContent className="p-8">
                <h3 className="text-2xl mb-6">Research & Publications</h3>
                <div className="space-y-6">
                  {researchPublications.length > 0 ? (
                    researchPublications.map((pub, index) => (
                      <div key={index}>
                        <h4 className="text-lg mb-2">• {pub.title}</h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          <strong>{pub.publisher}, {pub.publicationDate ? new Date(pub.publicationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}</strong>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {pub.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No research publications available. Please add publications in Strapi.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Education - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-6 h-6 text-primary" />
                <h3 className="text-2xl">Education</h3>
              </div>
              <div className="space-y-6">
                {educations.length > 0 ? (
                  educations.map((edu, index) => (
                    <div key={index}>
                      <h4 className="text-lg mb-1 font-semibold">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        {edu.institution}{edu.department ? `, ${edu.department}` : ''}
                      </p>
                      {edu.graduationDate && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Graduated: {new Date(edu.graduationDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                      )}
                      {edu.gpa && (
                        <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>
                      )}
                      {edu.description && (
                        <p className="text-sm text-muted-foreground mt-2">{edu.description}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No education information available. Please add education in Strapi.</p>
                )}
                <div className="pt-2">
                  <h5 className="text-md mb-3 font-medium">Soft Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {softSkills.length > 0 ? (
                      softSkills.map((skill) => (
                        <Badge key={skill.id} variant="outline" className="text-xs">
                          {skill.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No soft skills available. Please add soft skills in Strapi.</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}