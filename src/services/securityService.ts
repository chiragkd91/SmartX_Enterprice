/**
 * Security Service for SmartBizFlow
 * Comprehensive security assessment and VAPT capabilities
 */

import apiService from './apiService';

export interface VulnerabilityScan {
  id: string;
  type: 'automated' | 'manual' | 'penetration';
  status: 'pending' | 'running' | 'completed' | 'failed';
  target: string;
  scanDate: Date;
  vulnerabilities: Vulnerability[];
  report: SecurityReport;
}

export interface Vulnerability {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'sql_injection' | 'xss' | 'csrf' | 'authentication' | 'authorization' | 'data_exposure';
  title: string;
  description: string;
  cve?: string;
  cvss?: number;
  affectedComponent: string;
  remediation: string;
  status: 'open' | 'in_progress' | 'resolved' | 'false_positive';
  discoveredAt: Date;
  resolvedAt?: Date;
}

export interface SecurityReport {
  scanId: string;
  summary: {
    totalVulnerabilities: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    securityScore: number;
  };
  recommendations: string[];
  compliance: {
    owasp: boolean;
    gdpr: boolean;
    sox: boolean;
    hipaa: boolean;
    pci_dss: boolean;
  };
  generatedAt: Date;
}

export interface PenetrationTest {
  id: string;
  type: 'web_application' | 'network' | 'social_engineering' | 'physical';
  scope: string[];
  methodology: string;
  status: 'planned' | 'in_progress' | 'completed' | 'reported';
  startDate: Date;
  endDate?: Date;
  findings: PenetrationFinding[];
  report: PenetrationReport;
}

export interface PenetrationFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  proofOfConcept: string;
  impact: string;
  remediation: string;
  references: string[];
  discoveredAt: Date;
}

export interface PenetrationReport {
  testId: string;
  executiveSummary: string;
  technicalSummary: string;
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: string[];
    businessImpact: string;
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  compliance: {
    standards: string[];
    gaps: string[];
    recommendations: string[];
  };
  generatedAt: Date;
}

class SecurityService {
  private baseUrl = '/api/security';

  // Vulnerability Assessment Methods
  async startVulnerabilityScan(target: string, type: 'automated' | 'manual' = 'automated'): Promise<VulnerabilityScan> {
    try {
      const response = await apiService.request(`${this.baseUrl}/vulnerability-scan`, {
        method: 'POST',
        body: JSON.stringify({
          target,
          type,
          scanDate: new Date()
        })
      });
      return response.data;
    } catch (error) {
      console.error('Error starting vulnerability scan:', error);
      throw error;
    }
  }

  async getVulnerabilityScans(): Promise<VulnerabilityScan[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/vulnerability-scans`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vulnerability scans:', error);
      throw error;
    }
  }

  async getVulnerabilityScan(scanId: string): Promise<VulnerabilityScan> {
    try {
      const response = await apiService.get(`${this.baseUrl}/vulnerability-scan/${scanId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vulnerability scan:', error);
      throw error;
    }
  }

  async updateVulnerabilityStatus(vulnerabilityId: string, status: string): Promise<void> {
    try {
      await apiService.put(`${this.baseUrl}/vulnerability/${vulnerabilityId}`, { status });
    } catch (error) {
      console.error('Error updating vulnerability status:', error);
      throw error;
    }
  }

  // Penetration Testing Methods
  async startPenetrationTest(testConfig: Partial<PenetrationTest>): Promise<PenetrationTest> {
    try {
      const response = await apiService.post(`${this.baseUrl}/penetration-test`, {
        ...testConfig,
        startDate: new Date(),
        status: 'in_progress'
      });
      return response.data;
    } catch (error) {
      console.error('Error starting penetration test:', error);
      throw error;
    }
  }

  async getPenetrationTests(): Promise<PenetrationTest[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/penetration-tests`);
      return response.data;
    } catch (error) {
      console.error('Error fetching penetration tests:', error);
      throw error;
    }
  }

  async getPenetrationTest(testId: string): Promise<PenetrationTest> {
    try {
      const response = await apiService.get(`${this.baseUrl}/penetration-test/${testId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching penetration test:', error);
      throw error;
    }
  }

  async addPenetrationFinding(testId: string, finding: Partial<PenetrationFinding>): Promise<void> {
    try {
      await apiService.post(`${this.baseUrl}/penetration-test/${testId}/findings`, {
        ...finding,
        discoveredAt: new Date()
      });
    } catch (error) {
      console.error('Error adding penetration finding:', error);
      throw error;
    }
  }

  // Security Testing Methods
  async runSecurityTests(): Promise<any> {
    try {
      const response = await apiService.post(`${this.baseUrl}/security-tests`);
      return response.data;
    } catch (error) {
      console.error('Error running security tests:', error);
      throw error;
    }
  }

  async testSQLInjection(url: string, parameters: string[]): Promise<any> {
    try {
      const response = await apiService.post(`${this.baseUrl}/test/sql-injection`, {
        url,
        parameters
      });
      return response.data;
    } catch (error) {
      console.error('Error testing SQL injection:', error);
      throw error;
    }
  }

  async testXSS(url: string, parameters: string[]): Promise<any> {
    try {
      const response = await apiService.post(`${this.baseUrl}/test/xss`, {
        url,
        parameters
      });
      return response.data;
    } catch (error) {
      console.error('Error testing XSS:', error);
      throw error;
    }
  }

  async testCSRF(url: string): Promise<any> {
    try {
      const response = await apiService.post(`${this.baseUrl}/test/csrf`, { url });
      return response.data;
    } catch (error) {
      console.error('Error testing CSRF:', error);
      throw error;
    }
  }

  async testAuthenticationBypass(url: string): Promise<any> {
    try {
      const response = await apiService.post(`${this.baseUrl}/test/auth-bypass`, { url });
      return response.data;
    } catch (error) {
      console.error('Error testing authentication bypass:', error);
      throw error;
    }
  }

  // Security Monitoring
  async getSecurityMetrics(): Promise<any> {
    try {
      const response = await apiService.get(`${this.baseUrl}/metrics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching security metrics:', error);
      throw error;
    }
  }

  async getSecurityAlerts(): Promise<any[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/alerts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching security alerts:', error);
      throw error;
    }
  }

  // Compliance Checking
  async checkCompliance(): Promise<any> {
    try {
      const response = await apiService.get(`${this.baseUrl}/compliance`);
      return response.data;
    } catch (error) {
      console.error('Error checking compliance:', error);
      throw error;
    }
  }

  // Security Reports
  async generateSecurityReport(scanId: string): Promise<SecurityReport> {
    try {
      const response = await apiService.post(`${this.baseUrl}/report/${scanId}`);
      return response.data;
    } catch (error) {
      console.error('Error generating security report:', error);
      throw error;
    }
  }

  async generatePenetrationReport(testId: string): Promise<PenetrationReport> {
    try {
      const response = await apiService.post(`${this.baseUrl}/penetration-report/${testId}`);
      return response.data;
    } catch (error) {
      console.error('Error generating penetration report:', error);
      throw error;
    }
  }
}

export const securityService = new SecurityService(); 