import { useEffect, useRef } from 'react';
import { User } from '../types';
import { getApiUrl } from './api';

export const trackEvent = async (user: User | null, type: string, data: any = {}) => {
  if (!user) return;

  try {
    await fetch(getApiUrl('/api/tracking/event'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userPhone: user.phone,
        userIdCode: user.identificationCode,
        type,
        ...data
      })
    });
  } catch (err) {
    console.warn('Tracking failed:', err);
  }
};

export const useTracking = (user: User | null, activePage: string) => {
  const lastPage = useRef<string>(activePage);

  // Track Page View
  useEffect(() => {
    if (user && activePage) {
      trackEvent(user, 'page_view', {
        category: activePage,
        targetTitle: `Page: ${activePage}`
      });
      lastPage.current = activePage;
    }
  }, [user, activePage]);

  // Track Heartbeat (Engagement time)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      trackEvent(user, 'heartbeat', {
        category: lastPage.current,
        duration: 30 // 30 seconds chunks
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);
};
