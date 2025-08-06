/**
 * SmartBizFlow HR Portal - API Service
 * Handles all API communication with the backend server
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data && response.data.token) {
      this.token = response.data.token;
      localStorage.setItem('authToken', this.token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse<any>> {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });

    if (response.data) {
      this.token = null;
      localStorage.removeItem('authToken');
    }

    return response;
  }

  // Employee methods
  async getEmployees(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: string;
  }): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.status) queryParams.append('status', params.status);

    const endpoint = `/employees${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<PaginatedResponse<any>>(endpoint);
  }

  async createEmployee(employeeData: any): Promise<ApiResponse<any>> {
    return this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  }

  async updateEmployee(id: string, employeeData: any): Promise<ApiResponse<any>> {
    return this.request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  }

  async deleteEmployee(id: string): Promise<ApiResponse<any>> {
    return this.request(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Attendance methods
  async getAttendance(params?: {
    employeeId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.status) queryParams.append('status', params.status);

    const endpoint = `/attendance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<any[]>(endpoint);
  }

  async checkIn(employeeId: string): Promise<ApiResponse<any>> {
    return this.request('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({ employeeId }),
    });
  }

  async checkOut(employeeId: string): Promise<ApiResponse<any>> {
    return this.request('/attendance/check-out', {
      method: 'POST',
      body: JSON.stringify({ employeeId }),
    });
  }

  // Leave methods
  async getLeaves(params?: {
    employeeId?: string;
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const endpoint = `/leaves${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<any[]>(endpoint);
  }

  async createLeave(leaveData: any): Promise<ApiResponse<any>> {
    return this.request('/leaves', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    });
  }

  async approveLeave(id: string, status: string, notes?: string): Promise<ApiResponse<any>> {
    return this.request(`/leaves/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Training methods
  async getTrainingCourses(params?: {
    category?: string;
    level?: string;
    status?: string;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.level) queryParams.append('level', params.level);
    if (params?.status) queryParams.append('status', params.status);

    const endpoint = `/training/courses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<any[]>(endpoint);
  }

  async enrollInCourse(employeeId: string, courseId: string): Promise<ApiResponse<any>> {
    return this.request('/training/enroll', {
      method: 'POST',
      body: JSON.stringify({ employeeId, courseId }),
    });
  }

  // Dashboard methods
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request('/dashboard/stats');
  }

  // File upload
  async uploadFile(file: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return { data };
    } catch (error) {
      console.error('File upload failed:', error);
      return { error: error instanceof Error ? error.message : 'Upload failed' };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return { data };
    } catch (error) {
      console.error('Health check failed:', error);
      return { error: error instanceof Error ? error.message : 'Health check failed' };
    }
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
