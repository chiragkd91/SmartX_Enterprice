/**
 * Performance API Routes
 * Provides endpoints for system and database performance monitoring
 */

import { performanceService } from '../services/performanceService';

// Simple API handler for performance monitoring
export class PerformanceAPI {
  /**
   * Handle performance API requests
   */
  static async handleRequest(type: string) {
    try {
      switch (type) {
        case 'system':
          return await performanceService.getSystemMetrics();

        case 'database':
          return await performanceService.getDatabaseMetrics();

        case 'health':
          const [systemHealth, databaseHealth] = await Promise.all([
            performanceService.getSystemHealth(),
            performanceService.getDatabaseHealth()
          ]);
          return {
            system: systemHealth,
            database: databaseHealth,
            overall: this.getOverallHealth(systemHealth, databaseHealth)
          };

        case 'history':
          return performanceService.getPerformanceHistory();

        case 'trends':
          return performanceService.getPerformanceTrends();

        default:
          throw new Error('Invalid type parameter');
      }
    } catch (error) {
      console.error('Performance API error:', error);
      throw error;
    }
  }

  /**
   * Get system metrics
   */
  static async getSystemMetrics() {
    try {
      return await performanceService.getSystemMetrics();
    } catch (error) {
      console.error('Failed to get system metrics:', error);
      throw error;
    }
  }

  /**
   * Get database metrics
   */
  static async getDatabaseMetrics() {
    try {
      return await performanceService.getDatabaseMetrics();
    } catch (error) {
      console.error('Failed to get database metrics:', error);
      throw error;
    }
  }

  /**
   * Get performance health
   */
  static async getPerformanceHealth() {
    try {
      const [systemHealth, databaseHealth] = await Promise.all([
        performanceService.getSystemHealth(),
        performanceService.getDatabaseHealth()
      ]);

      const overallHealth = this.getOverallHealth(systemHealth, databaseHealth);

      return {
        system: systemHealth,
        database: databaseHealth,
        overall: overallHealth,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get performance health:', error);
      throw error;
    }
  }

  /**
   * Get performance history
   */
  static getPerformanceHistory() {
    try {
      return performanceService.getPerformanceHistory();
    } catch (error) {
      console.error('Failed to get performance history:', error);
      throw error;
    }
  }

  /**
   * Get performance trends
   */
  static getPerformanceTrends() {
    try {
      return performanceService.getPerformanceTrends();
    } catch (error) {
      console.error('Failed to get performance trends:', error);
      throw error;
    }
  }

  /**
   * Calculate overall health status
   */
  private static getOverallHealth(systemHealth: any, databaseHealth: any) {
    const systemStatus = systemHealth.status;
    const databaseStatus = databaseHealth.status;

    // Determine overall health based on both system and database status
    if (systemStatus === 'critical' || databaseStatus === 'critical') {
      return {
        status: 'critical',
        message: 'System or database is in critical condition',
        issues: [...systemHealth.issues, ...databaseHealth.issues],
        recommendations: [...systemHealth.recommendations, ...databaseHealth.recommendations]
      };
    } else if (systemStatus === 'warning' || databaseStatus === 'warning') {
      return {
        status: 'warning',
        message: 'System or database has performance warnings',
        issues: [...systemHealth.issues, ...databaseHealth.issues],
        recommendations: [...systemHealth.recommendations, ...databaseHealth.recommendations]
      };
    } else {
      return {
        status: 'healthy',
        message: 'System and database are performing well',
        issues: [],
        recommendations: []
      };
    }
  }
}

// Export for use in components
export default PerformanceAPI; 