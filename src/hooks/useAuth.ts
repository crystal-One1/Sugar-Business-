import { useState, useCallback } from 'react';
import axiosInstance from '../lib/axiosConfig';

interface LoginCredentials {
  phone: string;
  password: string;
}

interface RegisterData {
  name: string;
  phone: string;
  nationalId: string;
  password: string;
  identificationCode?: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: any;
  token?: string;
  pending?: boolean;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log('📤 Attempting login with phone:', credentials.phone);
      
      const response = await axiosInstance.post('/api/users/login', {
        phone: credentials.phone.trim(),
        password: credentials.password,
      });

      if (response.data.success) {
        // Save token if provided
        if (response.data.token) {
          localStorage.setItem('sugar_token', response.data.token);
        }
        
        // Save user
        localStorage.setItem('sugar_current_user', JSON.stringify(response.data.user));
        console.log('✅ Login successful');
        return response.data;
      } else {
        setError(response.data.message || 'Login failed');
        return response.data;
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);

      let errorMessage = 'حدث خطأ في الاتصال بالخادم';

      if (err.response?.status === 401) {
        errorMessage = 'بيانات الدخول غير صحيحة';
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'بيانات غير صحيحة';
      } else if (err.response?.status === 500) {
        errorMessage = 'خطأ في الخادم. يرجى المحاولة لاحقاً';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'انتهت مهلة الاتصال. الخادم قد لا يستجيب';
      } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        errorMessage = 'خطأ في الاتصال بالشبكة. تأكد من اتصالك بالإنترنت';
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'لا يمكن الاتصال بالخادم. تأكد من أن الخادم يعمل';
      }

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log('📤 Attempting registration with phone:', data.phone);

      const response = await axiosInstance.post('/api/users/register', {
        name: data.name.trim(),
        phone: data.phone.trim(),
        nationalId: data.nationalId.trim(),
        password: data.password,
        identificationCode: data.identificationCode?.trim() || '',
      });

      if (response.data.success) {
        // Save user if not pending
        if (!response.data.pending && response.data.user) {
          localStorage.setItem('sugar_current_user', JSON.stringify(response.data.user));
        }
        console.log('✅ Registration successful');
        return response.data;
      } else {
        setError(response.data.message || 'Registration failed');
        return response.data;
      }
    } catch (err: any) {
      console.error('❌ Registration error:', err);

      let errorMessage = 'حدث خطأ في الاتصال بالخادم';

      if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'بيانات غير صحيحة';
      } else if (err.response?.status === 409) {
        errorMessage = 'هذا الهاتف مسجل بالفعل';
      } else if (err.response?.status === 500) {
        errorMessage = 'خطأ في الخادم. يرجى المحاولة لاحقاً';
      } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        errorMessage = 'خطأ في الاتصال بالشبكة. تأكد من اتصالك بالإنترنت';
      }

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sugar_token');
    localStorage.removeItem('sugar_current_user');
  }, []);

  return {
    loading,
    error,
    setError,
    login,
    register,
    logout,
  };
};
