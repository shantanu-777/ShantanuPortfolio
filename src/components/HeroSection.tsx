import React from 'react';
import { motion } from 'motion/react';
import { Download, Mail, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useHero } from '../hooks/useStrapiData';
import { getIcon } from '../utils/iconMapper';
import { STRAPI_CONFIG } from '../config/strapi';

export function HeroSection() {
  const { data: heroData, loading, error } = useHero();

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const viewMyWork = () => {
    window.open('https://github.com/shantanu-777', '_blank');
  };

  const downloadCV = () => {
    window.open('https://drive.google.com/drive/folders/1bxevV1JNWkEtm1ozgLzLwPAlIFeWkNPU?usp=drive_link', '_blank');
  };
  
  // Get profile image URL - handle both Strapi v4 and v5 formats
  const getProfileImageUrl = (): string | null => {
    if (!heroData?.profileImage) return null;
    
    // Strapi v5 format - profileImage is directly an object with url
    if (heroData.profileImage.url) {
      return `${STRAPI_CONFIG.baseUrl}${heroData.profileImage.url}`;
    }
    
    // Strapi v4 format - nested in data.attributes
    if (heroData.profileImage.data?.attributes?.url) {
      return `${STRAPI_CONFIG.baseUrl}${heroData.profileImage.data.attributes.url}`;
    }
    
    return null;
  };
  
  const profileImageUrl = getProfileImageUrl();

  // Map highlights with icons - only from Strapi, no fallback
  const highlights = heroData?.highlights?.map(h => ({
    icon: getIcon(h.icon || 'Briefcase'),
    text: h.text
  })) || [];

  // Show loading state
  if (loading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no data
  if (!heroData) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center">
            <p className="text-muted-foreground">No hero data available. Please add hero information in Strapi.</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state (but still try to display if partial data exists)
  if (error) {
    console.error('Error loading hero data from Strapi:', error);
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Enhanced Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            {/* Professional Badge */}
            {heroData.isAvailable && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 mb-6"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">{heroData.availabilityStatus || ''}</span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 leading-tight"
            >
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {heroData.name || ''}
              </span>
            </motion.h1>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6"
            >
              {heroData.title || ''}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl"
            >
              {heroData.bio || ''}
            </motion.p>

            {/* Professional Highlights */}
            {highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10"
              >
                {highlights.map((highlight, index) => {
                  const IconComponent = highlight.icon;
                  return (
                    <div 
                      key={index}
                      className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-lg px-4 py-2 border"
                    >
                      <IconComponent className="w-4 h-4 text-primary" />
                      <span className="text-sm">{highlight.text}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                onClick={viewMyWork}
                size="lg"
                className="group"
              >
                View My Work
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={downloadCV}
                variant="outline"
                size="lg"
                className="group"
              >
                <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Download CV
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={scrollToContact}
                className="group"
              >
                <Mail className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Get In Touch
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:w-1/2 flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative"
            >
              {/* Main Profile Image */}
              {profileImageUrl ? (
                <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] rounded-3xl overflow-hidden border-4 border-background shadow-2xl relative">
                  <img
                    src={profileImageUrl}
                    alt={`${heroData.name || ''} - ${heroData.title || ''}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] rounded-3xl overflow-hidden border-4 border-background shadow-2xl relative bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">No profile image</p>
                </div>
              )}
              
              {/* Floating Achievement Badge */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-6 -right-6 bg-background border-4 border-primary/20 rounded-2xl p-4 shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-xs">AI Expert</div>
                </div>
              </motion.div>
              
              {/* Floating Stats */}
              <motion.div
                animate={{
                  y: [0, 8, 0],
                  rotate: [0, -2, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-6 -left-6 bg-background border-4 border-accent/20 rounded-2xl p-4 shadow-xl"
              >
                <div className="text-center">
                  <div className="text-lg mb-1">100+</div>
                  <div className="text-xs">Projects</div>
                </div>
              </motion.div>

              {/* Tech Stack Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2"
              >
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">Python</Badge>
                  <Badge variant="secondary" className="text-xs">TensorFlow</Badge>
                  <Badge variant="secondary" className="text-xs">PyTorch</Badge>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.8 }}
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
              >
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">Scikit-Learn</Badge>
                  <Badge variant="outline" className="text-xs">MLOps</Badge>
                  <Badge variant="outline" className="text-xs">Flask</Badge>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-muted-foreground/30 rounded-full mt-2"
            />
          </motion.div>
          <div className="text-xs text-muted-foreground mt-2 text-center">Scroll to explore</div>
        </motion.div>
      </div>
    </section>
  );
}