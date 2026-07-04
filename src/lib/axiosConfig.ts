/// <reference types="vite/client" />
import axios from 'axios';

// استخدام متغيرات البيئة من Vite
const API_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? `${window.location.protocol}//${window.location.host}/api`
    : '/api'
);

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000, // timeout بعد 15 ثانية
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // السماح بإرسال cookies
});

// Interceptor لإضافة التوكن في الطلبات
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sugar_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔄 [API Request] Sending to:', config.baseURL + config.url, {
      method: config.method?.toUpperCase(),
      data: config.data,
      timestamp: new Date().toISOString()
    });
    return config;
  },
  (error) => {
    console.error('❌ [API Request Error] Failed to prepare request:', error);
    return Promise.reject(error);
  }
);

// Interceptor للتعامل مع الأخطاء والردود
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ [API Response] Received successfully:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  (error) => {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    };

    if (error.response) {
      // الخادم رد برسالة خطأ (4xx, 5xx)
      console.error('❌ [API Server Error]', {
        ...errorDetails,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      // معالجة أخطاء المصادقة
      if (error.response.status === 401) {
        localStorage.removeItem('sugar_token');
        localStorage.removeItem('sugar_current_user');
        window.location.href = '/';
      }
    } else if (error.request) {
      // تم إرسال الطلب لكن لم نحصل على رد (network error)
      console.error('❌ [API Network Error] No response from server:', {
        ...errorDetails,
        message: error.message,
        code: error.code,
      });
      error.message = 'خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت والخادم يعمل بشكل صحيح.';
    } else {
      // حدث خطأ في إعداد الطلب
      console.error('❌ [API Client Error]', {
        ...errorDetails,
        message: error.message,
      });
      error.message = 'حدث خطأ غير متوقع. يرجى المحاولة مجدداً.';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
