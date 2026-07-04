import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, FlashSale, Product, ShopOrder, RecruitmentRequest, ServiceAdditionRequest, PasswordResetRequest, Transaction } from './types';
import { getApiUrl } from './lib/api';
import { DEFAULT_TRANSLATIONS, DEFAULT_SERVICE_PROVIDERS } from './data_defaults';

export interface ServiceProvider {
  id: string;
  govId: string;
  name: string;
  serviceName: string;
  serviceType: string;
  photoUrl: string;
  extraPhotos?: string[];
  address: string;
  phone: string;
  websiteUrl?: string;
  locationUrl?: string;
  description: string;
  workingHours: string;
  audience?: 'all' | 'members'; // Target audience (all = general public, members = logged-in members)
}

export interface Settings {
  whatsappNumber: string;
  bannerText: string;
  showNotification: boolean;
}

interface CMSContextType {
  settings: Settings;
  translations: Record<string, string>;
  providers: ServiceProvider[];
  users: User[];
  flashSales: FlashSale[];
  products: Product[];
  orders: ShopOrder[];
  recruitmentRequests: RecruitmentRequest[];
  serviceAdditionRequests: ServiceAdditionRequest[];
  passwordResetRequests: PasswordResetRequest[];
  transactions: Transaction[];
  loading: boolean;
  t: (key: string, defaultValue: string) => string;
  updateTranslation: (key: string, value: string) => Promise<boolean>;
  updateConfig: (config: Partial<Settings>) => Promise<boolean>;
  approveUser: (targetPhone: string, approved: boolean, allowedGovs: string[], role?: string, isBlocked?: boolean, isInactive?: boolean) => Promise<boolean>;
  submitTrackingEvent: (
    type: 'page_view' | 'item_click' | 'heartbeat' | 'conversion',
    targetId?: string,
    targetTitle?: string,
    category?: string,
    duration?: number
  ) => Promise<boolean>;
  addAdmin: (phone: string, name: string, nationalId?: string, password?: string, role?: string, username?: string, identificationCode?: string) => Promise<boolean>;
  saveProvider: (provider: Partial<ServiceProvider>) => Promise<boolean>;
  deleteProvider: (id: string) => Promise<boolean>;
  saveFlashSale: (sale: Partial<FlashSale>) => Promise<boolean>;
  deleteFlashSale: (id: string) => Promise<boolean>;
  saveProduct: (product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  submitOrder: (productId: string, userAddress: string, paymentMethod: 'online' | 'cash') => Promise<boolean>;
  processOrder: (orderId: string, status: 'approved' | 'rejected' | 'delivered') => Promise<boolean>;
  submitRecruitment: (data: Partial<RecruitmentRequest>) => Promise<boolean>;
  processRecruitment: (requestId: string, status: 'approved' | 'rejected') => Promise<boolean>;
  submitServiceAddition: (data: Partial<ServiceAdditionRequest>) => Promise<boolean>;
  processServiceAddition: (requestId: string, status: 'approved' | 'rejected') => Promise<boolean>;
  submitPasswordReset: (data: { phone: string, nationalId: string, name: string }) => Promise<boolean>;
  processPasswordReset: (requestId: string, status: 'approved' | 'rejected', newPassword?: string) => Promise<{ success: boolean, message: string }>;
  saveTransaction: (transaction: Partial<Transaction>) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  toggleFollowProduct: (productId: string) => Promise<boolean>;
  toggleFavoriteProduct: (productId: string) => Promise<boolean>;
  submitProductReview: (productId: string, userName: string, rating: number, comment: string) => Promise<{ success: boolean, message: string }>;
  updateAlertProfile: (data: { email?: string, whatsappEnabled?: boolean, emailEnabled?: boolean }) => Promise<boolean>;
  markNotificationsRead: () => Promise<boolean>;
  submitFeedback: (rating: number, comment: string, context?: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean, message: string }>;
  refreshData: () => Promise<void>;
  isEditModeEnabled: boolean;
  setEditModeEnabled: (enabled: boolean) => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode, currentUser: User | null }> = ({ children, currentUser }) => {
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('sugar_admin_editable');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const setEditModeEnabled = useCallback((enabled: boolean) => {
    setIsEditModeEnabled(enabled);
    try {
      localStorage.setItem('sugar_admin_editable', String(enabled));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'supervisor2';
  const resolvedEditMode = isAdmin && isEditModeEnabled;

  // Local Storage Caching Utilities for instant startup and Stale-While-Revalidate behavior
  const getCache = useCallback(<T,>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(`sugar_cms_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.warn(`Error reading cache for ${key}:`, err);
      return defaultValue;
    }
  }, []);

  const setCache = useCallback((key: string, data: any): void => {
    try {
      localStorage.setItem(`sugar_cms_${key}`, JSON.stringify(data));
    } catch (err) {
      console.warn(`Error writing cache for ${key}:`, err);
    }
  }, []);

  const [settings, setSettings] = useState<Settings>(() => getCache('settings', {
    whatsappNumber: "201022334455",
    bannerText: "تنبيه هام ومبشر لشهر مايو 2026: تم تفعيل باقات العوائد السنوية الهيكلية بنسبة 40% لأول 100 مستثمر جديد في مصر!",
    showNotification: true
  }));
  const [translations, setTranslations] = useState<Record<string, string>>(() => getCache('translations', DEFAULT_TRANSLATIONS));
  const [providers, setProviders] = useState<ServiceProvider[]>(() => getCache('providers', DEFAULT_SERVICE_PROVIDERS));
  const [users, setUsers] = useState<User[]>(() => getCache('users', []));
  const [flashSales, setFlashSales] = useState<FlashSale[]>(() => getCache('flashSales', []));
  const [products, setProducts] = useState<Product[]>(() => getCache('products', []));
  const [orders, setOrders] = useState<ShopOrder[]>(() => getCache('orders', []));
  const [recruitmentRequests, setRecruitmentRequests] = useState<RecruitmentRequest[]>(() => getCache('recruitmentRequests', []));
  const [serviceAdditionRequests, setServiceAdditionRequests] = useState<ServiceAdditionRequest[]>(() => getCache('serviceAdditionRequests', []));
  const [passwordResetRequests, setPasswordResetRequests] = useState<PasswordResetRequest[]>(() => getCache('passwordResetRequests', []));
  const [transactions, setTransactions] = useState<Transaction[]>(() => getCache('transactions', []));
  
  // Skip loading block entirely if we already have valid cached CMS data
  const [loading, setLoading] = useState(() => {
    try {
      const hasCache = localStorage.getItem('sugar_cms_cached') === 'true';
      return !hasCache;
    } catch {
      return true;
    }
  });

  const refreshData = useCallback(async (retryCount = 0) => {
    try {
      console.log(`Refreshing data from /api/app-data (attempt ${retryCount + 1})...`);
      const res = await fetch(getApiUrl('/api/app-data'));
      
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success) {
            if (data.settings) { setSettings(data.settings); setCache('settings', data.settings); }
            if (data.translations) { setTranslations(data.translations); setCache('translations', data.translations); }
            if (data.providers) { setProviders(data.providers); setCache('providers', data.providers); }
            if (data.users) { setUsers(data.users); setCache('users', data.users); }
            if (data.flashSales) { setFlashSales(data.flashSales); setCache('flashSales', data.flashSales); }
            if (data.products) { setProducts(data.products || []); setCache('products', data.products || []); }
            if (data.orders) { setOrders(data.orders || []); setCache('orders', data.orders || []); }
            if (data.recruitmentRequests) { setRecruitmentRequests(data.recruitmentRequests || []); setCache('recruitmentRequests', data.recruitmentRequests || []); }
            if (data.serviceAdditionRequests) { setServiceAdditionRequests(data.serviceAdditionRequests || []); setCache('serviceAdditionRequests', data.serviceAdditionRequests || []); }
            if (data.passwordResetRequests) { setPasswordResetRequests(data.passwordResetRequests || []); setCache('passwordResetRequests', data.passwordResetRequests || []); }
            if (data.transactions) { setTransactions(data.transactions || []); setCache('transactions', data.transactions || []); }
            
            try {
              localStorage.setItem('sugar_cms_cached', 'true');
            } catch {}
          }
        } else {
          console.warn("Expected JSON response from backend but received non-JSON payload (likely HTML fallback). Content-Type:", contentType);
          // If we get HTML instead of JSON for an API call, the server might still be booting its routes
          if (retryCount < 3) {
            console.log("Retrying in 2 seconds...");
            setTimeout(() => refreshData(retryCount + 1), 2000);
          }
        }
      } else {
        if (retryCount >= 3) {
          console.error("Server returned an error for /api/app-data:", res.status, res.statusText);
        } else {
          console.warn(`Server returned status ${res.status} for /api/app-data. Retrying in background...`);
        }
        if (retryCount < 3) {
          setTimeout(() => refreshData(retryCount + 1), 2000);
        }
      }
    } catch (err: any) {
      const isConnectionError = err instanceof TypeError || (err.message && (err.message.includes('fetch') || err.message.includes('NetworkError') || err.message.includes('type')));
      if (isConnectionError) {
        if (retryCount >= 4) {
          console.warn("Could not retrieve current app state from the backend (exhausted max retries):", err.message || err);
          console.warn("This is expected if the server is still compiling or undergoing a cold start.");
        } else {
          console.info(`Sync check with Express backend (attempt ${retryCount + 1}) was offline. Retrying...`);
        }
        // Implement exponential backoff for network errors during startup
        if (retryCount < 5) {
          const delay = Math.pow(2, retryCount) * 1000;
          console.log(`Scheduling offline data-sync retry ${retryCount + 2} in ${delay}ms...`);
          setTimeout(() => refreshData(retryCount + 1), delay);
        }
      } else {
        console.warn("Notice: Syncing CMS states encountered an unexpected response, retrying...", err.message || err);
      }
    } finally {
      setLoading(false);
    }
  }, [setCache, getCache]);

  // Web Image preloading strategy to warm browser HTTP cache and memory cache
  useEffect(() => {
    if (loading) return;

    // Collect all URLs to preload
    const urlsToPreload: string[] = [];

    providers.forEach(p => {
      if (p.photoUrl) urlsToPreload.push(p.photoUrl);
      if (p.extraPhotos && Array.isArray(p.extraPhotos)) {
        p.extraPhotos.forEach(url => {
          if (url) urlsToPreload.push(url);
        });
      }
    });

    products.forEach(p => {
      if (p.photoUrl) urlsToPreload.push(p.photoUrl);
    });

    flashSales.forEach(s => {
      if (s.photoUrl) urlsToPreload.push(s.photoUrl);
    });

    // Deduplicate
    const uniqueUrls = Array.from(new Set(urlsToPreload));

    const loadImg = (url: string) => {
      const img = new Image();
      img.src = url;
    };

    // Preload incrementally using idle callbacks or background timeouts to prevent main thread blocking
    uniqueUrls.forEach(url => {
      try {
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => loadImg(url));
        } else {
          setTimeout(() => loadImg(url), 100);
        }
      } catch (err) {
        console.warn("Failed to schedule image preload:", err);
      }
    });
  }, [providers, products, flashSales, loading]);

  // Fetch at boot
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Real-time synchronization: Poll server state every 10 seconds to propagate translations & changes to all users simultaneously
  useEffect(() => {
    const handle = setInterval(() => {
      refreshData();
    }, 10000);
    return () => clearInterval(handle);
  }, [refreshData]);

  const t = (key: string, defaultValue: string): string => {
    return translations[key] !== undefined ? translations[key] : defaultValue;
  };

  const updateTranslation = async (key: string, value: string): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    try {
      const res = await fetch(getApiUrl('/api/settings/update-translation'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, key, value })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTranslations(data.translations);
          return true;
        }
      }
    } catch (err) {
      console.error("Error setting translation:", err);
    }
    return false;
  };

  const updateConfig = async (config: Partial<Settings>): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    try {
      const res = await fetch(getApiUrl('/api/settings/update-config'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, ...config })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSettings(data.settings);
          return true;
        }
      }
    } catch (err) {
      console.error("Error setting config:", err);
    }
    return false;
  };

  const approveUser = async (targetPhone: string, approved: boolean, allowedGovs: string[], role?: string, isBlocked?: boolean, isInactive?: boolean): Promise<boolean> => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'supervisor2')) return false;
    try {
      const res = await fetch(getApiUrl('/api/users/approve'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, targetUserPhone: targetPhone, approved, allowedGovs, role, isBlocked, isInactive })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
          return true;
        }
      }
    } catch (err) {
      console.error("Error approving user:", err);
    }
    return false;
  };

  const submitTrackingEvent = async (
    type: 'page_view' | 'item_click' | 'heartbeat' | 'conversion',
    targetId?: string,
    targetTitle?: string,
    category?: string,
    duration?: number
  ): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('/api/tracking/event'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPhone: currentUser?.phone || 'Guest',
          userIdCode: currentUser?.identificationCode || 'GUEST-CODE',
          type,
          targetId,
          targetTitle,
          category,
          duration: duration || 0
        })
      });
      return res.ok;
    } catch (err) {
      console.warn("Error background submitting tracking event:", err);
      return false;
    }
  };

  const addAdmin = async (phone: string, name: string, nationalId?: string, password?: string, role?: string, username?: string, identificationCode?: string): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    try {
      const res = await fetch(getApiUrl('/api/users/add-admin'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, phone, name, nationalId, password, role, username, identificationCode })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
          return true;
        }
      }
    } catch (err) {
      console.error("Error adding admin:", err);
    }
    return false;
  };

  const saveProvider = async (provider: Partial<ServiceProvider>): Promise<boolean> => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'supervisor2')) return false;
    try {
      const res = await fetch(getApiUrl('/api/providers/save'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, provider })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProviders(data.providers);
          return true;
        }
      }
    } catch (err) {
      console.error("Error saving provider:", err);
    }
    return false;
  };

  const deleteProvider = async (id: string): Promise<boolean> => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'supervisor2')) return false;
    try {
      const res = await fetch(getApiUrl('/api/providers/delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, providerId: id })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProviders(data.providers);
          return true;
        }
      }
    } catch (err) {
      console.error("Error deleting provider:", err);
    }
    return false;
  };

  const saveFlashSale = async (sale: Partial<FlashSale>): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    try {
      const res = await fetch(getApiUrl('/api/flash-sales/save'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, sale })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setFlashSales(data.flashSales);
          return true;
        }
      }
    } catch (err) {
      console.error("Error saving flash sale:", err);
    }
    return false;
  };

  const deleteFlashSale = async (id: string): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    try {
      const res = await fetch(getApiUrl('/api/flash-sales/delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, saleId: id })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setFlashSales(data.flashSales);
          return true;
        }
      }
    } catch (err) {
      console.error("Error deleting flash sale:", err);
    }
    return false;
  };

  const saveProduct = async (product: Partial<Product>): Promise<boolean> => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'supervisor2')) return false;
    try {
      const res = await fetch(getApiUrl('/api/shop/products/save'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, product })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
          return true;
        }
      }
    } catch (err) {
      console.error("Error saving product:", err);
    }
    return false;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'supervisor2')) return false;
    try {
      const res = await fetch(getApiUrl('/api/shop/products/delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, productId: id })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
          return true;
        }
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
    return false;
  };

  const submitOrder = async (productId: string, userAddress: string, paymentMethod: 'online' | 'cash'): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const res = await fetch(getApiUrl('/api/shop/orders/submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPhone: currentUser.phone, productId, userAddress, paymentMethod })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
          return true;
        }
      }
    } catch (err) {
      console.error("Error submitting order:", err);
    }
    return false;
  };

  const processOrder = async (orderId: string, status: 'approved' | 'rejected' | 'delivered'): Promise<boolean> => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'supervisor2')) return false;
    try {
      const res = await fetch(getApiUrl('/api/shop/orders/process'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, orderId, status })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
          return true;
        }
      }
    } catch (err) {
      console.error("Error processing order:", err);
    }
    return false;
  };

  const submitRecruitment = async (data: Partial<RecruitmentRequest>): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('/api/recruitment/submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          setRecruitmentRequests(d.recruitmentRequests);
          return true;
        }
      }
    } catch (err) {
      console.error("Error submitting recruitment:", err);
    }
    return false;
  };

  const processRecruitment = async (requestId: string, status: 'approved' | 'rejected'): Promise<boolean> => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'supervisor2')) return false;
    try {
      const res = await fetch(getApiUrl('/api/recruitment/process'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, requestId, status })
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          setRecruitmentRequests(d.recruitmentRequests);
          return true;
        }
      }
    } catch (err) {
      console.error("Error processing recruitment:", err);
    }
    return false;
  };

  const submitServiceAddition = async (data: Partial<ServiceAdditionRequest>): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('/api/service-requests/submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          setServiceAdditionRequests(d.serviceAdditionRequests);
          return true;
        }
      }
    } catch (err) {
      console.error("Error submitting service addition:", err);
    }
    return false;
  };

  const processServiceAddition = async (requestId: string, status: 'approved' | 'rejected'): Promise<boolean> => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'supervisor2')) return false;
    try {
      const res = await fetch(getApiUrl('/api/service-requests/process'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, requestId, status })
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          setServiceAdditionRequests(d.serviceAdditionRequests);
          return true;
        }
      }
    } catch (err) {
      console.error("Error processing service addition:", err);
    }
    return false;
  };

  const submitPasswordReset = async (data: { phone: string, nationalId: string, name: string }): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('/api/users/password-reset-request'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          refreshData();
          return true;
        }
      }
    } catch (err) {
      console.error("Error submitting reset request:", err);
    }
    return false;
  };

  const processPasswordReset = async (requestId: string, status: 'approved' | 'rejected', newPassword?: string): Promise<{ success: boolean, message: string }> => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'supervisor2')) return { success: false, message: 'صلاحية غير كافية' };
    try {
      const res = await fetch(getApiUrl('/api/users/process-password-reset'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, requestId, status, newPassword })
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setPasswordResetRequests(d.passwordResetRequests);
        return { success: true, message: d.message };
      }
      return { success: false, message: d.message || 'فشلت معالجة الطلب' };
    } catch (err) {
      console.error("Error processing password reset:", err);
      return { success: false, message: 'حدث خطأ فني' };
    }
  };

  const saveTransaction = async (transaction: Partial<Transaction>): Promise<boolean> => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'supervisor2')) return false;
    try {
      const res = await fetch(getApiUrl('/api/transactions/save'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, transaction })
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          setTransactions(d.transactions);
          return true;
        }
      }
    } catch (err) {
      console.error("Error saving transaction:", err);
    }
    return false;
  };

  const deleteTransaction = async (id: string): Promise<boolean> => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'supervisor2')) return false;
    try {
      const res = await fetch(getApiUrl('/api/transactions/delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPhone: currentUser.phone, transactionId: id })
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          setTransactions(d.transactions);
          return true;
        }
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
    return false;
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean, message: string }> => {
    if (!currentUser) return { success: false, message: 'يجب تسجيل الدخول أولاً' };
    try {
      const res = await fetch(getApiUrl('/api/users/change-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPhone: currentUser.phone, oldPassword, newPassword })
      });
      const d = await res.json();
      if (res.ok && d.success) {
        return { success: true, message: d.message };
      }
      return { success: false, message: d.message || 'فشل تغيير كلمة المرور' };
    } catch (err) {
      console.error("Error changing password:", err);
      return { success: false, message: 'حدث خطأ فني' };
    }
  };

  const toggleFollowProduct = async (productId: string): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const res = await fetch(getApiUrl('/api/users/toggle-follow'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPhone: currentUser.phone, productId })
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          refreshData();
          return true;
        }
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
    return false;
  };

  const toggleFavoriteProduct = async (productId: string): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const res = await fetch(getApiUrl('/api/users/toggle-favorite'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPhone: currentUser.phone, productId })
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          refreshData();
          return true;
        }
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
    return false;
  };

  const submitProductReview = async (productId: string, userName: string, rating: number, comment: string): Promise<{ success: boolean, message: string }> => {
    try {
      const res = await fetch(getApiUrl('/api/shop/products/review'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userName,
          userPhone: currentUser?.phone || '',
          rating,
          comment
        })
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          refreshData();
          return { success: true, message: d.message };
        }
        return { success: false, message: d.message || 'فشل إرسال التقييم' };
      }
      return { success: false, message: 'فشل إرسال التقييم بسبب خطأ فني بالخادم' };
    } catch (err) {
      console.error("Error submitting review:", err);
      return { success: false, message: 'حدث خطأ غير متوقع بالشبكة' };
    }
  };

  const updateAlertProfile = async (data: { email?: string, whatsappEnabled?: boolean, emailEnabled?: boolean }): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const res = await fetch(getApiUrl('/api/users/update-alert-profile'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPhone: currentUser.phone, ...data })
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          refreshData();
          return true;
        }
      }
    } catch (err) {
      console.error("Error updating alert profile:", err);
    }
    return false;
  };

  const markNotificationsRead = async (): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const res = await fetch(getApiUrl('/api/users/notifications/read'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPhone: currentUser.phone })
      });
      if (res.ok) {
        refreshData();
        return true;
      }
    } catch (err) {
      console.error("Error marking alerts as read:", err);
    }
    return false;
  };

  const submitFeedback = async (rating: number, comment: string, context?: string): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('/api/feedback'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userPhone: currentUser?.phone || 'Guest',
          username: currentUser?.username || 'Guest User',
          rating, 
          comment,
          context: context || 'General Inquiry'
        })
      });
      return res.ok;
    } catch (err) {
      console.error("Error submitting feedback:", err);
      return false;
    }
  };

  return (
    <CMSContext.Provider value={{
      settings,
      translations,
      providers,
      users,
      flashSales,
      products,
      orders,
      recruitmentRequests,
      serviceAdditionRequests,
      passwordResetRequests,
      transactions,
      loading,
      t,
      updateTranslation,
      updateConfig,
      approveUser,
      addAdmin,
      saveProvider,
      deleteProvider,
      saveFlashSale,
      deleteFlashSale,
      saveProduct,
      deleteProduct,
      submitOrder,
      processOrder,
      submitRecruitment,
      processRecruitment,
      submitServiceAddition,
      processServiceAddition,
      submitPasswordReset,
      processPasswordReset,
      saveTransaction,
      deleteTransaction,
      toggleFollowProduct,
      toggleFavoriteProduct,
      submitProductReview,
      updateAlertProfile,
      markNotificationsRead,
      submitFeedback,
      changePassword,
      refreshData,
      submitTrackingEvent,
      isEditModeEnabled: resolvedEditMode,
      setEditModeEnabled
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
