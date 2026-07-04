/// <reference types="vite/client" />
import axiosInstance from './axiosConfig';

export const getApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const baseURL = import.meta.env.VITE_API_URL;
  
  // في بيئة التطوير المحلي
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // إذا تم تحديد VITE_API_URL، استخدمه
    if (baseURL) {
      return `${baseURL}${cleanPath}`;
    }
    
    // في بيئة الإنتاج على Vercel، استخدم نفس الدومين
    if (!isLocalhost) {
      return `${window.location.protocol}//${window.location.host}${cleanPath}`;
    }
  }
  
  // في بيئة التطوير المحلي، استخدم الرابط المحلي
  return cleanPath;
};

// دالة مساعدة للطلبات
export const apiCall = {
  get: (path: string, config?: any) => axiosInstance.get(getApiUrl(path), config),
  post: (path: string, data?: any, config?: any) => axiosInstance.post(getApiUrl(path), data, config),
  put: (path: string, data?: any, config?: any) => axiosInstance.put(getApiUrl(path), data, config),
  delete: (path: string, config?: any) => axiosInstance.delete(getApiUrl(path), config),
  patch: (path: string, data?: any, config?: any) => axiosInstance.patch(getApiUrl(path), data, config),
};

export default axiosInstance;
