import { API_BASE_URL } from '@/config/constants';
import { useAuth } from '@/contexts/AuthContext';

/**
 * API Service Layer
 * Tự động thêm Firebase ID token vào header Authorization
 */

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Lấy auth token từ Firebase và thêm vào headers
   */
  private async getAuthHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Lấy token từ auth context hoặc AsyncStorage
    try {
      // Import động để tránh circular dependency
      const { auth } = await import('@/config/firebase');
      const user = auth.currentUser;
      
      if (user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }

    return headers;
  }

  /**
   * Xử lý response và errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Có lỗi xảy ra',
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    return this.handleResponse<T>(response);
  }
}

export const apiService = new ApiService();

// Export các API functions cụ thể (có thể mở rộng sau)
export const api = {
  // Ví dụ: User APIs
  getUserProfile: () => apiService.get('/user/profile'),
  updateUserProfile: (data: any) => apiService.put('/user/profile', data),

  // Ví dụ: Product APIs
  getProducts: (params?: any) => apiService.get('/products'),
  getProductById: (id: string) => apiService.get(`/products/${id}`),

  // Ví dụ: Cart APIs
  getCart: () => apiService.get('/cart'),
  addToCart: (data: any) => apiService.post('/cart', data),
  updateCartItem: (id: string, data: any) => apiService.put(`/cart/${id}`, data),
  removeFromCart: (id: string) => apiService.delete(`/cart/${id}`),

  // Ví dụ: Order APIs
  getOrders: () => apiService.get('/orders'),
  createOrder: (data: any) => apiService.post('/orders', data),
};
