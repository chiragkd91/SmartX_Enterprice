/**
 * SmartBizFlow - Global Search Service
 * Handles cross-module search functionality
 */

interface SearchResult {
  id: string;
  type: 'employee' | 'customer' | 'lead' | 'product' | 'order' | 'invoice' | 'asset' | 'ticket' | 'document';
  title: string;
  description: string;
  url: string;
  score: number;
  metadata: Record<string, any>;
  highlightedText?: string;
}

interface SearchFilters {
  modules?: string[];
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  category?: string;
  assignedTo?: string;
}

interface SearchOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'date' | 'name';
  sortOrder?: 'asc' | 'desc';
}

class SearchService {
  private baseUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

  // Global search across all modules
  async globalSearch(
    query: string,
    filters?: SearchFilters,
    options?: SearchOptions
  ): Promise<{ results: SearchResult[]; total: number; suggestions: string[] }> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters?.modules) params.append('modules', filters.modules.join(','));
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
    
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.sortOrder) params.append('sortOrder', options.sortOrder);

    const response = await fetch(`${this.baseUrl}/search?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Search failed');
    }

    return response.json();
  }

  // Search within specific module
  async moduleSearch(
    module: string,
    query: string,
    filters?: Record<string, any>,
    options?: SearchOptions
  ): Promise<{ results: SearchResult[]; total: number }> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.sortOrder) params.append('sortOrder', options.sortOrder);

    const response = await fetch(`${this.baseUrl}/search/${module}?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error(`Module search failed: ${module}`);
    }

    return response.json();
  }

  // Get search suggestions
  async getSuggestions(query: string, module?: string): Promise<string[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (module) params.append('module', module);

    const response = await fetch(`${this.baseUrl}/search/suggestions?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  }

  // Get recent searches
  async getRecentSearches(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/search/recent`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  }

  // Save search query
  async saveSearch(query: string, filters?: SearchFilters): Promise<void> {
    const response = await fetch(`${this.baseUrl}/search/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ query, filters })
    });

    if (!response.ok) {
      throw new Error('Failed to save search');
    }
  }

  // Get saved searches
  async getSavedSearches(): Promise<Array<{
    id: string;
    name: string;
    query: string;
    filters?: SearchFilters;
    createdAt: string;
  }>> {
    const response = await fetch(`${this.baseUrl}/search/saved`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  }

  // Delete saved search
  async deleteSavedSearch(searchId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/search/saved/${searchId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete saved search');
    }
  }

  // Advanced search with multiple criteria
  async advancedSearch(criteria: {
    query?: string;
    modules?: string[];
    dateRange?: { from: string; to: string };
    status?: string[];
    assignedTo?: string[];
    tags?: string[];
    customFields?: Record<string, any>;
  }, options?: SearchOptions): Promise<{ results: SearchResult[]; total: number }> {
    const response = await fetch(`${this.baseUrl}/search/advanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ criteria, options })
    });

    if (!response.ok) {
      throw new Error('Advanced search failed');
    }

    return response.json();
  }

  // Search with filters
  async searchWithFilters(
    query: string,
    filters: {
      status?: string[];
      dateRange?: { from: string; to: string };
      assignedTo?: string[];
      priority?: string[];
      category?: string[];
    },
    options?: SearchOptions
  ): Promise<{ results: SearchResult[]; total: number }> {
    const response = await fetch(`${this.baseUrl}/search/filters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ query, filters, options })
    });

    if (!response.ok) {
      throw new Error('Filtered search failed');
    }

    return response.json();
  }

  // Get search statistics
  async getSearchStats(): Promise<{
    totalSearches: number;
    popularQueries: Array<{ query: string; count: number }>;
    searchByModule: Record<string, number>;
    recentActivity: Array<{ query: string; timestamp: string }>;
  }> {
    const response = await fetch(`${this.baseUrl}/search/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get search statistics');
    }

    return response.json();
  }

  // Highlight search terms in text
  highlightText(text: string, query: string): string {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Extract searchable text from result
  extractSearchableText(result: SearchResult): string {
    return `${result.title} ${result.description} ${Object.values(result.metadata).join(' ')}`.toLowerCase();
  }

  // Get search result URL
  getResultUrl(result: SearchResult): string {
    const baseUrl = window.location.origin;
    
    switch (result.type) {
      case 'employee':
        return `${baseUrl}/hr/employees/${result.id}`;
      case 'customer':
        return `${baseUrl}/crm/customers/${result.id}`;
      case 'lead':
        return `${baseUrl}/crm/leads/${result.id}`;
      case 'product':
        return `${baseUrl}/erp/products/${result.id}`;
      case 'order':
        return `${baseUrl}/erp/orders/${result.id}`;
      case 'invoice':
        return `${baseUrl}/erp/invoices/${result.id}`;
      case 'asset':
        return `${baseUrl}/assets/management/${result.id}`;
      case 'ticket':
        return `${baseUrl}/assets/support/${result.id}`;
      case 'document':
        return `${baseUrl}/files/${result.id}`;
      default:
        return `${baseUrl}/search/${result.id}`;
    }
  }

  // Get module icon
  getModuleIcon(type: string): string {
    switch (type) {
      case 'employee': return '👤';
      case 'customer': return '🏢';
      case 'lead': return '🎯';
      case 'product': return '📦';
      case 'order': return '📋';
      case 'invoice': return '🧾';
      case 'asset': return '💻';
      case 'ticket': return '🎫';
      case 'document': return '📄';
      default: return '🔍';
    }
  }

  // Get module name
  getModuleName(type: string): string {
    switch (type) {
      case 'employee': return 'Employee';
      case 'customer': return 'Customer';
      case 'lead': return 'Lead';
      case 'product': return 'Product';
      case 'order': return 'Order';
      case 'invoice': return 'Invoice';
      case 'asset': return 'Asset';
      case 'ticket': return 'Support Ticket';
      case 'document': return 'Document';
      default: return 'Unknown';
    }
  }
}

// Create singleton instance
const searchService = new SearchService();

export default searchService; 