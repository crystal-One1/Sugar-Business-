export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // string or React element identifier
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface User {
  phone: string;
  name: string;
  nationalId: string;
  password?: string; // stored for local mock verification
  role?: 'admin' | 'user' | 'supervisor2';
  approved?: boolean;
  allowedGovs?: string[];
  username?: string;
  identificationCode?: string;
  email?: string; // Optional for alerts
  whatsappEnabled?: boolean; // Default setting
  emailEnabled?: boolean; // Default setting
  followedProductIds?: string[]; // IDs of products user is tracking
  favoriteProductIds?: string[]; // IDs of favorited products (wishlist)
  notifications?: PriceAlertNotification[];
  isBlocked?: boolean;
  isInactive?: boolean;
  lastLoginTimestamp?: string;
}

export interface PriceAlertNotification {
  id: string;
  productId: string;
  productTitle: string;
  type: 'price_drop' | 'returns_drop';
  oldValue: number;
  newValue: number;
  timestamp: string;
  read: boolean;
}

export interface FlashSale {
  id: string;
  govId: string;
  title: string;
  badge?: string;
  description: string;
  endsAt: string;
  ctaText?: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  userPhone: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  returns?: number; // Investment returns (e.g., 40%)
  description: string;
  photoUrl: string;
  providerName: string; // Shop or provider name (secret, only shown to logged-in users)
  governorate?: string; // Governorate location
  category?: string; // Product category (e.g., real estate, commercial)
  isPinned?: boolean;
  status?: 'available' | 'preorder' | 'completed'; // Investment availability status
  createdAt: string;
  audience?: 'all' | 'members'; // Target audience (all = general public, members = logged-in members)
  reviews?: ProductReview[];
}

export interface ShopOrder {
  id: string;
  productId: string;
  productTitle: string;
  price: number;
  userPhone: string;
  userName: string;
  userAddress: string;
  paymentMethod: 'online' | 'cash';
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  processedByName?: string; // Who approved/rejected it
  createdAt: string;
}

export interface RecruitmentRequest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  about?: string;
  nationalId?: string;
  workType?: string;
  photoUrl?: string; // From upload or fallback
  cvUrl?: string; // From upload or fallback
  status: 'pending' | 'approved' | 'rejected';
  processedByName?: string;
  createdAt: string;
}

export interface ServiceAdditionRequest {
  id: string;
  name: string;
  phone: string;
  serviceName: string;
  sector: string;
  region: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  processedByName?: string;
  createdAt: string;
}

export interface PasswordResetRequest {
  id: string;
  phone: string;
  name: string;
  nationalId: string;
  status: 'pending' | 'approved' | 'rejected';
  processedByName?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userPhone: string;
  type: 'deposit' | 'withdrawal' | 'profit' | 'investment';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface TrackingEvent {
  id: string;
  userPhone: string;
  userIdCode: string;
  type: 'page_view' | 'item_click' | 'heartbeat' | 'conversion';
  targetId?: string; // Product ID, Service ID, etc.
  targetTitle?: string;
  category?: string; // 'shop', 'services', 'dashboard', etc.
  duration?: number; // seconds spent
  timestamp: string;
}

export interface UserStats {
  userPhone: string;
  userIdCode: string;
  name: string;
  totalTimeSpent: number; // minutes
  lastActive: string;
  mostViewedCategory: string;
  mostInterestedItems: { id: string; title: string; count: number }[];
  pathHistory: { type: string; title: string; timestamp: string }[];
}

