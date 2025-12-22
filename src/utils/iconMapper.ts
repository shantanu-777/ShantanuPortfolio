import { 
  Award, 
  Briefcase, 
  Users, 
  Mail, 
  Linkedin, 
  Github,
  Phone,
  MapPin
} from 'lucide-react';

// Map icon names from Strapi to React icon components
export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Briefcase,
  Users,
  Mail,
  Linkedin,
  Github,
  Phone,
  MapPin,
};

export const getIcon = (iconName: string): React.ComponentType<{ className?: string }> => {
  return iconMap[iconName] || Briefcase; // Default to Briefcase if icon not found
};


