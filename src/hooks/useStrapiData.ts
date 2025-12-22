import { useState, useEffect } from 'react';
import { strapiService } from '../services/strapi';
import type {
  HeroData,
  ProfessionalExperience,
  Education,
  CoreCompetency,
  ToolCategory,
  Project,
  ResearchPublication,
  Achievement,
  ContactInformation,
  AboutData,
  SoftSkill,
  CVSectionData,
} from '../services/strapi';

// Hook for Hero data
export function useHero() {
  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    strapiService
      .getHero()
      .then((data) => {
        console.log('Hero data from Strapi:', data);
        setData(data);
      })
      .catch((err) => {
        console.error('Error fetching hero:', err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook for Professional Experiences
export function useProfessionalExperiences() {
  const [data, setData] = useState<ProfessionalExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    strapiService
      .getProfessionalExperiences()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook for Education
export function useEducations() {
  const [data, setData] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    strapiService
      .getEducations()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook for Core Competencies
export function useCoreCompetencies() {
  const [data, setData] = useState<CoreCompetency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    strapiService
      .getCoreCompetencies()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook for Tool Categories
export function useToolCategories() {
  const [data, setData] = useState<ToolCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    strapiService
      .getToolCategories()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook for Projects
export function useProjects() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    strapiService
      .getProjects()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook for Research Publications
export function useResearchPublications() {
  const [data, setData] = useState<ResearchPublication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    strapiService
      .getResearchPublications()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook for Achievements
export function useAchievements() {
  const [data, setData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    strapiService
      .getAchievements()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook for Contact Information
export function useContactInformation() {
  const [data, setData] = useState<ContactInformation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    strapiService
      .getContactInformation()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook for About
export function useAbout() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    strapiService
      .getAbout()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook for Soft Skills
export function useSoftSkills() {
  const [data, setData] = useState<SoftSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    strapiService
      .getSoftSkills()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook for CV Section
export function useCVSection() {
  const [data, setData] = useState<CVSectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    strapiService
      .getCVSection()
      .then((data) => {
        console.log('CV Section data from Strapi:', data);
        setData(data);
      })
      .catch((err) => {
        console.error('Error fetching CV section:', err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}


