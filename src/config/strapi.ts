// Strapi API Configuration
export const STRAPI_CONFIG = {
  baseUrl: import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337',
  apiToken: import.meta.env.VITE_STRAPI_API_TOKEN || '',
};

// Helper function to build API URL
export const getStrapiUrl = (endpoint: string): string => {
  const baseUrl = STRAPI_CONFIG.baseUrl.replace(/\/$/, '');
  const apiPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}/api${apiPath}`;
};

// Helper function to get headers
export const getStrapiHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_CONFIG.apiToken) {
    headers['Authorization'] = `Bearer ${STRAPI_CONFIG.apiToken}`;
  }

  return headers;
};

// Generic fetch function for Strapi API
export const fetchStrapi = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const url = getStrapiUrl(endpoint);
  const headers = getStrapiHeaders();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Error fetching from Strapi (${endpoint}):`, error);
    throw error;
  }
};


