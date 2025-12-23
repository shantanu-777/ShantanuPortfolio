import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { Badge } from './ui/badge';
import { Menu, X } from 'lucide-react';
import { useHero } from '../hooks/useStrapiData';
import { STRAPI_CONFIG } from '../config/strapi';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

interface HeaderProps {
  activeSection: string;
}

export function Header({ activeSection }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: heroData } = useHero();

  // Get initials from name
  const getInitials = (name: string | undefined): string => {
    if (!name) return 'SM';
    // Extract first letters of first and last name
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Extract just the name (remove "Hi, I'm" prefix if present)
  const getName = (): string => {
    if (!heroData?.name) return 'Shantanu Modhave';
    // Remove "Hi, I'm" or similar prefixes
    const name = heroData.name.replace(/^(Hi,?\s*I'?m\s*)/i, '').trim();
    return name || 'Shantanu Modhave';
  };

  const displayName = getName();
  const initials = getInitials(displayName);
  const title = heroData?.title || 'AI & ML Engineer';
  
  // Get profile image URL
  const getProfileImageUrl = (): string | null => {
    if (!heroData?.profileImage) return null;
    if (heroData.profileImage.url) {
      return `${STRAPI_CONFIG.baseUrl}${heroData.profileImage.url}`;
    }
    if (heroData.profileImage.data?.attributes?.url) {
      return `${STRAPI_CONFIG.baseUrl}${heroData.profileImage.data.attributes.url}`;
    }
    return null;
  };

  const profileImageUrl = getProfileImageUrl();

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'CV', href: '#cv' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => scrollToSection('#home')}
          >
            {profileImageUrl ? (
              <Avatar className="w-10 h-10">
                <AvatarImage src={profileImageUrl} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-lg text-primary-foreground font-semibold">{initials}</span>
              </div>
            )}
            <div>
              <div className="text-lg tracking-tight font-semibold">{displayName}</div>
              <div className="text-xs text-muted-foreground">{title}</div>
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => scrollToSection(item.href)}
                className={`relative transition-all duration-300 hover:bg-muted/50 ${
                  activeSection === item.href.slice(1) 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
                {activeSection === item.href.slice(1) && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Button>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {/* Status Badge */}
            {heroData?.isAvailable && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="hidden sm:block"
              >
                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {heroData.availabilityStatus || 'Available'}
                </Badge>
              </motion.div>
            )}

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-9 h-9 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 pb-4 border-t border-border/50"
          >
            <div className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => scrollToSection(item.href)}
                  className={`justify-start transition-all duration-300 ${
                    activeSection === item.href.slice(1) 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.name}
                  {activeSection === item.href.slice(1) && (
                    <motion.div
                      layoutId="activeMobileSection"
                      className="ml-2 w-2 h-2 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Button>
              ))}
              
              {/* Mobile Status */}
              {heroData?.isAvailable && (
                <div className="pt-2 px-3">
                  <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {heroData.availabilityStatus || 'Available for opportunities'}
                  </Badge>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}