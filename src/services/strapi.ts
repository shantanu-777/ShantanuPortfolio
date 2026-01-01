import { fetchStrapi } from '../config/strapi';

// Simple in-memory cache with TTL (Time To Live)
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds (5 minutes default)
}

class StrapiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // Request deduplication - if a request is already in progress, return the same promise
  async fetch<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    // Check cache first
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Check if request is already in progress
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)! as Promise<T>;
    }

    // Start new request
    const promise = fetcher()
      .then((data) => {
        this.set(key, data, ttl);
        this.pendingRequests.delete(key);
        return data;
      })
      .catch((error) => {
        this.pendingRequests.delete(key);
        throw error;
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

const strapiCache = new StrapiCache();

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
  current?: boolean;
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
  // Clear cache (useful for testing or manual refresh)
  clearCache: () => strapiCache.clear(),

  // Hero Section
  async getHero(): Promise<HeroData | null> {
    return strapiCache.fetch('hero', async () => {
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
    });
  },

  // Professional Experiences
  async getProfessionalExperiences(): Promise<ProfessionalExperience[]> {
    return strapiCache.fetch('professional-experiences', async () => {
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
    });
  },

  // Education
  async getEducations(): Promise<Education[]> {
    return strapiCache.fetch('educations', async () => {
      try {
        const response = await fetchStrapi<
          StrapiResponse<(StrapiItem<Education> | StrapiItemV5<Education>)[]>
        >('/educations?sort=order:asc');
        if (!response.data || !Array.isArray(response.data)) {
          return [];
        }
        const educations = extractStrapiArray<Education>(response.data);
        
        // Sort: current first, then by graduationDate descending (most recent first)
        return educations.sort((a, b) => {
          // Current entries first
          if (a.current && !b.current) return -1;
          if (!a.current && b.current) return 1;
          
          // Then sort by graduationDate descending (most recent first)
          if (a.graduationDate && b.graduationDate) {
            const dateA = new Date(a.graduationDate).getTime();
            const dateB = new Date(b.graduationDate).getTime();
            return dateB - dateA; // Descending order
          }
          if (a.graduationDate) return -1;
          if (b.graduationDate) return 1;
          
          // Finally by order
          return b.order - a.order;
        });
      } catch (error) {
        console.error('Error fetching educations:', error);
        return [];
      }
    });
  },

  // Core Competencies
  async getCoreCompetencies(): Promise<CoreCompetency[]> {
    return strapiCache.fetch('core-competencies', async () => {
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
    });
  },

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    return strapiCache.fetch('certifications', async () => {
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
    });
  },

  // Tool Categories
  async getToolCategories(): Promise<ToolCategory[]> {
    return strapiCache.fetch('tool-categories', async () => {
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
    });
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    return strapiCache.fetch('projects', async () => {
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
    });
  },

  // Research Publications
  async getResearchPublications(): Promise<ResearchPublication[]> {
    return strapiCache.fetch('research-publications', async () => {
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
    });
  },

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    return strapiCache.fetch('achievements', async () => {
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
    });
  },

  // Contact Information
  async getContactInformation(): Promise<ContactInformation | null> {
    return strapiCache.fetch('contact-information', async () => {
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
    });
  },

  // About
  async getAbout(): Promise<AboutData | null> {
    return strapiCache.fetch('about', async () => {
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
    });
  },

  // Soft Skills
  async getSoftSkills(): Promise<SoftSkill[]> {
    return strapiCache.fetch('soft-skills', async () => {
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
    });
  },

  // CV Section (Collection Type)
  async getCVSection(): Promise<CVSectionData | null> {
    return strapiCache.fetch('cv-sections', async () => {
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
    });
  },
};

