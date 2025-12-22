import { fetchStrapi } from '../config/strapi';

// Type definitions for Strapi responses
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiItem<T = any> {
  id: number;
  attributes: T;
}

// Strapi v5 format - data is directly in response.data
export interface StrapiItemV5<T = any> extends T {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// Helper function to extract data from Strapi response (handles both v4 and v5)
function extractStrapiData<T>(item: StrapiItem<T> | StrapiItemV5<T> | any): T {
  // Check if it's Strapi v4 format (has attributes)
  if ('attributes' in item && item.attributes) {
    return item.attributes as T;
  }
  // Strapi v5 format - data is already flattened
  // Extract only the fields we need (exclude id, documentId, timestamps)
  const { id, documentId, createdAt, updatedAt, publishedAt, ...attributes } = item;
  return attributes as T;
}

// Helper function to extract array of items
function extractStrapiArray<T>(items: (StrapiItem<T> | StrapiItemV5<T> | any)[]): T[] {
  if (!items || !Array.isArray(items)) return [];
  return items.map((item) => {
    const data = extractStrapiData<T>(item);
    // Preserve id if it exists
    if ('id' in item) {
      return { id: item.id, ...data } as T & { id: number };
    }
    return data;
  });
}

// Hero Section Types
export interface HeroData {
  name: string;
  title: string;
  bio: string;
  availabilityStatus: string;
  isAvailable: boolean;
  cvUrl: string | null;
  profileImage?: {
    url?: string; // Strapi v5 format - direct url
    id?: number;
    name?: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: any;
    hash?: string;
    ext?: string;
    mime?: string;
    size?: number;
    previewUrl?: string | null;
    provider?: string;
    // Strapi v4 format - nested
    data?: {
      attributes: {
        url: string;
      };
    };
  };
  highlights?: Array<{
    id?: number;
    icon: string | null;
    text: string;
  }>;
  socialLinks?: Array<{
    id?: number;
    platform: string;
    url: string;
    icon: string | null;
  }>;
}

// Professional Experience Types
export interface ProfessionalExperience {
  id: number;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  location?: string;
  order: number;
  technologies?: string[];
}

// Education Types
export interface Education {
  id: number;
  degree: string;
  institution: string;
  department?: string;
  graduationDate?: string;
  gpa?: string;
  description?: string;
  order: number;
}

// Core Competency Types
export interface CoreCompetency {
  id: number;
  name: string;
  description: string;
  icon: string;
  order: number;
  certifications?: Certification[];
}

// Certification Types
export interface Certification {
  id: number;
  title: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  description?: string;
  order: number;
}

// Tool Category Types
export interface ToolCategory {
  id: number;
  category: string;
  tools: Array<{
    name: string;
  }>;
  order: number;
}

// Project Types
export interface Project {
  id: number;
  title: string;
  description: string;
  image?: {
    data?: {
      attributes: {
        url: string;
      };
    };
  };
  imageUrl?: string;
  technologies: string[];
  category: 'ml' | 'dl' | 'cv' | 'nlp' | 'autoencoder' | 'gan' | 'generativeai' | 'powerbi' | 'graduation';
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
}

// Research Publication Types
export interface ResearchPublication {
  id: number;
  title: string;
  publisher: string;
  publicationDate: string;
  description: string;
  doi?: string;
  url?: string;
  authors?: string[];
  order: number;
}

// Achievement Types
export interface Achievement {
  id: number;
  number: string;
  label: string;
  description?: string;
  icon?: string;
  order: number;
}

// Contact Information Types
export interface ContactInformation {
  email: string;
  phone?: string;
  location?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  contactMessage?: string;
}

// About Types
export interface AboutData {
  bio: string;
  achievements?: Achievement[];
}

// Soft Skill Types
export interface SoftSkill {
  id: number;
  name: string;
  order: number;
}

// CV Section Types
export interface CVSectionData {
  id: number;
  title: string;
  description: string;
  cvUrl: string;
  previewName: string;
  previewTitle: string;
  previewDescription?: string;
  cvSections?: Array<{
    id?: number;
    label: string;
  }>;
  quickFacts?: Array<{
    id?: number;
    number: string;
    label: string;
  }>;
  order?: number;
  featured?: boolean;
}

// API Service Functions
export const strapiService = {
  // Hero Section
  async getHero(): Promise<HeroData | null> {
    try {
      const response = await fetchStrapi<StrapiResponse<StrapiItemV5<HeroData> | StrapiItem<HeroData> | null>>(
        '/hero?populate=*'
      );
      // For single types, data can be null or an object
      if (!response.data) {
        return null;
      }
      
      // Use helper function to extract data (handles both v4 and v5)
      return extractStrapiData<HeroData>(response.data);
    } catch (error) {
      console.error('Error fetching hero data:', error);
      return null;
    }
  },

  // Professional Experiences
  async getProfessionalExperiences(): Promise<ProfessionalExperience[]> {
    try {
      const response = await fetchStrapi<
        StrapiResponse<(StrapiItem<ProfessionalExperience> | StrapiItemV5<ProfessionalExperience>)[]>
      >('/professional-experiences?sort=order:asc');
      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }
      return extractStrapiArray<ProfessionalExperience>(response.data);
    } catch (error) {
      console.error('Error fetching professional experiences:', error);
      return [];
    }
  },

  // Education
  async getEducations(): Promise<Education[]> {
    try {
      const response = await fetchStrapi<
        StrapiResponse<(StrapiItem<Education> | StrapiItemV5<Education>)[]>
      >('/educations?sort=order:asc');
      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }
      return extractStrapiArray<Education>(response.data);
    } catch (error) {
      console.error('Error fetching educations:', error);
      return [];
    }
  },

  // Core Competencies
  async getCoreCompetencies(): Promise<CoreCompetency[]> {
    try {
      const response = await fetchStrapi<
        StrapiResponse<(StrapiItem<CoreCompetency> | StrapiItemV5<CoreCompetency>)[]>
      >('/core-competencies?populate=*&sort=order:asc');
      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }
      const competencies = extractStrapiArray<CoreCompetency>(response.data);
      console.log('Core competencies fetched:', competencies);
      return competencies;
    } catch (error) {
      console.error('Error fetching core competencies:', error);
      return [];
    }
  },

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    try {
      const response = await fetchStrapi<
        StrapiResponse<(StrapiItem<Certification> | StrapiItemV5<Certification>)[]>
      >('/certifications?populate=*&sort=order:asc');
      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }
      return extractStrapiArray<Certification>(response.data);
    } catch (error) {
      console.error('Error fetching certifications:', error);
      return [];
    }
  },

  // Tool Categories
  async getToolCategories(): Promise<ToolCategory[]> {
    try {
      const response = await fetchStrapi<
        StrapiResponse<(StrapiItem<ToolCategory> | StrapiItemV5<ToolCategory>)[]>
      >('/tool-categories?populate=*&sort=order:asc');
      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }
      return extractStrapiArray<ToolCategory>(response.data);
    } catch (error) {
      console.error('Error fetching tool categories:', error);
      return [];
    }
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    try {
      const response = await fetchStrapi<
        StrapiResponse<(StrapiItem<Project> | StrapiItemV5<Project>)[]>
      >('/projects?populate=*&sort=order:asc');
      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }
      return extractStrapiArray<Project>(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  // Research Publications
  async getResearchPublications(): Promise<ResearchPublication[]> {
    try {
      const response = await fetchStrapi<
        StrapiResponse<(StrapiItem<ResearchPublication> | StrapiItemV5<ResearchPublication>)[]>
      >('/research-publications?sort=order:asc');
      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }
      return extractStrapiArray<ResearchPublication>(response.data);
    } catch (error) {
      console.error('Error fetching research publications:', error);
      return [];
    }
  },

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    try {
      const response = await fetchStrapi<
        StrapiResponse<(StrapiItem<Achievement> | StrapiItemV5<Achievement>)[]>
      >('/achievements?sort=order:asc');
      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }
      return extractStrapiArray<Achievement>(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  },

  // Contact Information
  async getContactInformation(): Promise<ContactInformation | null> {
    try {
      const response = await fetchStrapi<
        StrapiResponse<StrapiItem<ContactInformation> | StrapiItemV5<ContactInformation> | null>
      >('/contact-information?populate=*');
      if (!response.data) {
        return null;
      }
      return extractStrapiData<ContactInformation>(response.data);
    } catch (error) {
      console.error('Error fetching contact information:', error);
      return null;
    }
  },

  // About
  async getAbout(): Promise<AboutData | null> {
    try {
      const response = await fetchStrapi<
        StrapiResponse<StrapiItem<AboutData> | StrapiItemV5<AboutData> | null>
      >('/about?populate[achievements]=*');
      if (!response.data) {
        return null;
      }
      return extractStrapiData<AboutData>(response.data);
    } catch (error) {
      console.error('Error fetching about data:', error);
      return null;
    }
  },

  // Soft Skills
  async getSoftSkills(): Promise<SoftSkill[]> {
    try {
      const response = await fetchStrapi<
        StrapiResponse<(StrapiItem<SoftSkill> | StrapiItemV5<SoftSkill>)[]>
      >('/soft-skills?sort=order:asc');
      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }
      return extractStrapiArray<SoftSkill>(response.data);
    } catch (error) {
      console.error('Error fetching soft skills:', error);
      return [];
    }
  },

  // CV Section (Collection Type)
  async getCVSection(): Promise<CVSectionData | null> {
    try {
      const response = await fetchStrapi<
        StrapiResponse<(StrapiItem<CVSectionData> | StrapiItemV5<CVSectionData>)[]>
      >('/cv-sections?populate=*&sort=order:asc');
      if (!response.data || !Array.isArray(response.data)) {
        return null;
      }
      
      // Get the first (featured or first) CV section
      const cvSections = extractStrapiArray<CVSectionData>(response.data);
      if (cvSections.length === 0) {
        return null;
      }
      
      // Return featured one if exists, otherwise first one
      const featured = cvSections.find(cv => cv.featured);
      return featured || cvSections[0];
    } catch (error) {
      console.error('Error fetching CV section data:', error);
      return null;
    }
  },
};

