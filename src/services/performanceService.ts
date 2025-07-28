/**
 * SmartBizFlow - Performance Optimization Service
 * Handles caching, code splitting, and performance monitoring
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  memoryUsage: number;
  bundleSize: number;
  cacheHitRate: number;
}

class PerformanceService {
  private cache = new Map<string, CacheItem<any>>();
  private apiCache = new Map<string, CacheItem<any>>();
  private metrics: PerformanceMetrics[] = [];
  private maxCacheSize = 100;
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  // Cache management
  setCache<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  getCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  removeCache(key: string): void {
    this.cache.delete(key);
  }

  // API response caching
  setApiCache<T>(url: string, data: T, ttl: number = this.defaultTTL): void {
    this.apiCache.set(url, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  getApiCache<T>(url: string): T | null {
    const item = this.apiCache.get(url);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.apiCache.delete(url);
      return null;
    }
    
    return item.data;
  }

  clearApiCache(): void {
    this.apiCache.clear();
  }

  // Component memoization
  memoize<T extends (...args: any[]) => any>(
    fn: T,
    keyGenerator?: (...args: Parameters<T>) => string
  ): T {
    const cache = new Map<string, any>();
    
    return ((...args: Parameters<T>) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }) as T;
  }

  // Lazy loading for components
  lazyLoad<T>(importFn: () => Promise<{ default: T }>): () => Promise<T> {
    let component: T | null = null;
    let loading = false;
    let error: Error | null = null;

    return async () => {
      if (component) return component;
      if (error) throw error;
      if (loading) {
        // Wait for current loading to complete
        while (loading) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        if (component) return component;
        if (error) throw error;
      }

      loading = true;
      try {
        const module = await importFn();
        component = module.default;
        return component;
      } catch (err) {
        error = err as Error;
        throw error;
      } finally {
        loading = false;
      }
    };
  }

  // Performance monitoring
  measurePageLoad(): number {
    const startTime = performance.now();
    
    return new Promise<number>((resolve) => {
      if (document.readyState === 'complete') {
        resolve(performance.now() - startTime);
      } else {
        window.addEventListener('load', () => {
          resolve(performance.now() - startTime);
        });
      }
    });
  }

  measureApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    
    return apiCall().finally(() => {
      const duration = performance.now() - startTime;
      this.recordMetric('apiResponseTime', duration);
    });
  }

  recordMetric(type: keyof PerformanceMetrics, value: number): void {
    this.metrics.push({
      pageLoadTime: 0,
      apiResponseTime: 0,
      memoryUsage: 0,
      bundleSize: 0,
      cacheHitRate: 0,
      [type]: value
    } as PerformanceMetrics);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  getPerformanceMetrics(): PerformanceMetrics {
    const latest = this.metrics[this.metrics.length - 1] || {
      pageLoadTime: 0,
      apiResponseTime: 0,
      memoryUsage: 0,
      bundleSize: 0,
      cacheHitRate: 0
    };

    return {
      ...latest,
      memoryUsage: this.getMemoryUsage(),
      bundleSize: this.getBundleSize(),
      cacheHitRate: this.getCacheHitRate()
    };
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  private getBundleSize(): number {
    // This would need to be calculated during build time
    // For now, return a placeholder
    return 0;
  }

  private getCacheHitRate(): number {
    const totalRequests = this.cache.size + this.apiCache.size;
    if (totalRequests === 0) return 0;
    
    const hits = this.cache.size; // Simplified calculation
    return (hits / totalRequests) * 100;
  }

  // Bundle optimization
  preloadComponent(importFn: () => Promise<any>): void {
    // Preload component in background
    importFn().catch(console.error);
  }

  preloadRoute(path: string): void {
    // Preload route component
    const routeComponents: Record<string, () => Promise<any>> = {
      '/hr/employees': () => import('../pages/HR/EmployeeManagement'),
      '/crm/leads': () => import('../pages/CRM/LeadsManagement'),
      '/erp/products': () => import('../pages/ERP/ProductsManagement'),
      '/assets/management': () => import('../pages/ITAsset/AssetManagement')
    };

    const component = routeComponents[path];
    if (component) {
      this.preloadComponent(component);
    }
  }

  // Image optimization
  optimizeImage(url: string, width?: number, height?: number): string {
    // Add image optimization parameters
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('q', '85'); // Quality
    params.append('f', 'auto'); // Format

    return `${url}?${params.toString()}`;
  }

  // Debounce function calls
  debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  // Throttle function calls
  throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;
    
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }

  // Virtual scrolling optimization
  createVirtualScroller<T>(
    items: T[],
    itemHeight: number,
    containerHeight: number
  ) {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const totalHeight = items.length * itemHeight;

    return {
      getVisibleItems: (scrollTop: number) => {
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(startIndex + visibleCount, items.length);
        
        return {
          items: items.slice(startIndex, endIndex),
          startIndex,
          endIndex,
          offsetY: startIndex * itemHeight
        };
      },
      totalHeight,
      itemHeight
    };
  }

  // Memory management
  cleanup(): void {
    // Clear old cache entries
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
    
    for (const [key, item] of this.apiCache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.apiCache.delete(key);
      }
    }
  }

  // Performance reporting
  generatePerformanceReport(): {
    summary: PerformanceMetrics;
    recommendations: string[];
  } {
    const metrics = this.getPerformanceMetrics();
    const recommendations: string[] = [];

    if (metrics.pageLoadTime > 3000) {
      recommendations.push('Consider implementing code splitting to reduce initial bundle size');
    }

    if (metrics.apiResponseTime > 1000) {
      recommendations.push('Implement API response caching to improve response times');
    }

    if (metrics.memoryUsage > 100) {
      recommendations.push('Memory usage is high, consider implementing cleanup strategies');
    }

    if (metrics.cacheHitRate < 50) {
      recommendations.push('Cache hit rate is low, consider adjusting cache TTL values');
    }

    return {
      summary: metrics,
      recommendations
    };
  }
}

// Create singleton instance
const performanceService = new PerformanceService();

// Cleanup cache periodically
setInterval(() => {
  performanceService.cleanup();
}, 5 * 60 * 1000); // Every 5 minutes

export default performanceService; 