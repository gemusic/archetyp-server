/**
 * TYPES - LITE VERSION
 * Interfaces minimales sans base de données
 */

export interface ChatMessage {
  id: string;
  visitor_id: string;
  message: string;
  sender: 'user' | 'ai';
  message_type: 'response' | 'payment_link' | 'popup';
  is_first: boolean;
  payment_data?: PaymentData;
  timestamp: string;
}

export interface PaymentData {
  product: PaymentProduct;
  payment_url?: string;
}

export interface PaymentProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  material?: string;
  color?: string;
  configuration?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  is_first?: boolean;
  payment_data?: PaymentData;
}

// In-memory storage pour les messages en attente
export interface MessageQueue {
  [visitorId: string]: ChatMessage[];
}

// Tracking des premiers messages
export interface FirstMessageTracker {
  [visitorId: string]: boolean;
}
