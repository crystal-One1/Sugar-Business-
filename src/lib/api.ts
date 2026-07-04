/// <reference types="vite/client" />

export const getApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (typeof window !== 'undefined' && window.location) {
    const isClientRemote = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (isClientRemote) {
      return `https://sugar-business-eg.vercel.app${cleanPath}`;
    }
  }
  
  return cleanPath;
};
