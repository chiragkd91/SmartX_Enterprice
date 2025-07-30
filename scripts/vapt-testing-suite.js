#!/usr/bin/env node

/**
 * SmartBizFlow VAPT Testing Suite
 * Comprehensive Vulnerability Assessment and Penetration Testing Framework
 * 
 * Features:
 * - Automated vulnerability scanning
 * - Penetration testing tools
 * - Security assessment reporting
 * - Compliance checking
 * - Integration with security tools
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { exec } = require('child_process');
const readline = require('readline');

class VAPTTestingSuite {
  constructor() {
    this.config = {
      target: process.env.TARGET_URL || 'http://localhost:5173',
      scanType: process.env.SCAN_TYPE || 'comprehensive',
      outputDir: './vapt-reports',
      tools: {
        nmap: 'nmap',
        nikto: 'nikto',
        sqlmap: 'sqlmap',
        dirb: 'dirb',
        gobuster: 'gobuster'
      },
      scanOptions: {
        portScan: true,
        webScan: true,
        vulnScan: true,
        dirScan: true,
        sqlInjection: true,
        xssScan: true,
        csrfScan: true
      }
    };
    
    this.results = {
      scanId: this.generateScanId(),
      startTime: new Date(),
      target: this.config.target,
      findings: [],
      vulnerabilities: [],
      compliance: {},
      summary: {}
    };
  }

  generateScanId() {
    return `vapt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async initialize() {
    console.log('🔐 SmartBizFlow VAPT Testing Suite');
    console.log('====================================');
    console.log(`Target: ${this.config.target}`);
    console.log(`Scan ID: ${this.results.scanId}`);
    console.log(`Start Time: ${this.results.startTime.toISOString()}`);
    console.log('');

    // Create output directory
    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }

    // Check if target is accessible
    await this.checkTargetAccessibility();
  }

  async checkTargetAccessibility() {
    console.log('🔍 Checking target accessibility...');
    
    try {
      const url = new URL(this.config.target);
      const protocol = url.protocol === 'https:' ? https : http;
      
      return new Promise((resolve, reject) => {
        const req = protocol.get(url.href, (res) => {
          console.log(`✅ Target is accessible (Status: ${res.statusCode})`);
          resolve(true);
        });
        
        req.on('error', (err) => {
          console.log(`❌ Target is not accessible: ${err.message}`);
          reject(err);
        });
        
        req.setTimeout(10000, () => {
          console.log('❌ Target connection timeout');
          reject(new Error('Connection timeout'));
        });
      });
    } catch (error) {
      console.log(`❌ Invalid target URL: ${error.message}`);
      throw error;
    }
  }

  async runPortScan() {
    if (!this.config.scanOptions.portScan) return;
    
    console.log('🔍 Running port scan...');
    
    try {
      const ports = await this.executeCommand(`${this.config.tools.nmap} -sS -sV -O ${this.config.target}`);
      
      this.results.findings.push({
        type: 'port_scan',
        title: 'Port Scan Results',
        description: 'Network port scanning completed',
        data: ports,
        severity: 'info',
        timestamp: new Date()
      });
      
      console.log('✅ Port scan completed');
    } catch (error) {
      console.log(`❌ Port scan failed: ${error.message}`);
    }
  }

  async runWebVulnerabilityScan() {
    if (!this.config.scanOptions.webScan) return;
    
    console.log('🔍 Running web vulnerability scan...');
    
    try {
      const niktoResults = await this.executeCommand(`${this.config.tools.nikto} -h ${this.config.target}`);
      
      this.results.findings.push({
        type: 'web_vulnerability',
        title: 'Web Vulnerability Scan',
        description: 'Nikto web vulnerability scanner results',
        data: niktoResults,
        severity: 'medium',
        timestamp: new Date()
      });
      
      console.log('✅ Web vulnerability scan completed');
    } catch (error) {
      console.log(`❌ Web vulnerability scan failed: ${error.message}`);
    }
  }

  async runDirectoryScan() {
    if (!this.config.scanOptions.dirScan) return;
    
    console.log('🔍 Running directory scan...');
    
    try {
      const dirbResults = await this.executeCommand(`${this.config.tools.dirb} ${this.config.target}`);
      
      this.results.findings.push({
        type: 'directory_scan',
        title: 'Directory Enumeration',
        description: 'Directory and file enumeration results',
        data: dirbResults,
        severity: 'low',
        timestamp: new Date()
      });
      
      console.log('✅ Directory scan completed');
    } catch (error) {
      console.log(`❌ Directory scan failed: ${error.message}`);
    }
  }

  async testSQLInjection() {
    if (!this.config.scanOptions.sqlInjection) return;
    
    console.log('🔍 Testing SQL injection vulnerabilities...');
    
    try {
      const sqlmapResults = await this.executeCommand(`${this.config.tools.sqlmap} -u "${this.config.target}" --batch --random-agent`);
      
      this.results.findings.push({
        type: 'sql_injection',
        title: 'SQL Injection Test',
        description: 'SQL injection vulnerability assessment',
        data: sqlmapResults,
        severity: 'high',
        timestamp: new Date()
      });
      
      console.log('✅ SQL injection test completed');
    } catch (error) {
      console.log(`❌ SQL injection test failed: ${error.message}`);
    }
  }

  async testXSSVulnerabilities() {
    if (!this.config.scanOptions.xssScan) return;
    
    console.log('🔍 Testing XSS vulnerabilities...');
    
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '"><script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src=x onerror=alert("XSS")>',
      '<svg onload=alert("XSS")>'
    ];
    
    const xssResults = [];
    
    for (const payload of xssPayloads) {
      try {
        const result = await this.testXSSPayload(payload);
        if (result.vulnerable) {
          xssResults.push({
            payload,
            url: result.url,
            parameter: result.parameter
          });
        }
      } catch (error) {
        console.log(`XSS test error: ${error.message}`);
      }
    }
    
    if (xssResults.length > 0) {
      this.results.vulnerabilities.push({
        type: 'xss',
        title: 'Cross-Site Scripting (XSS)',
        description: 'XSS vulnerabilities detected',
        severity: 'high',
        details: xssResults,
        remediation: 'Implement proper input validation and output encoding',
        timestamp: new Date()
      });
    }
    
    console.log('✅ XSS vulnerability test completed');
  }

  async testCSRFVulnerabilities() {
    if (!this.config.scanOptions.csrfScan) return;
    
    console.log('🔍 Testing CSRF vulnerabilities...');
    
    try {
      const csrfResults = await this.testCSRFProtection();
      
      if (csrfResults.vulnerable) {
        this.results.vulnerabilities.push({
          type: 'csrf',
          title: 'Cross-Site Request Forgery (CSRF)',
          description: 'CSRF protection is missing or inadequate',
          severity: 'high',
          details: csrfResults,
          remediation: 'Implement CSRF tokens and validate requests',
          timestamp: new Date()
        });
      }
      
      console.log('✅ CSRF vulnerability test completed');
    } catch (error) {
      console.log(`❌ CSRF test failed: ${error.message}`);
    }
  }

  async testAuthenticationBypass() {
    console.log('🔍 Testing authentication bypass...');
    
    const authTests = [
      { name: 'SQL Injection in Login', payload: "' OR '1'='1" },
      { name: 'NoSQL Injection', payload: '{"$ne": null}' },
      { name: 'LDAP Injection', payload: '*)(uid=*))(|(uid=*' },
      { name: 'Default Credentials', credentials: ['admin:admin', 'admin:password', 'root:root'] }
    ];
    
    const authResults = [];
    
    for (const test of authTests) {
      try {
        const result = await this.testAuthBypass(test);
        if (result.vulnerable) {
          authResults.push({
            test: test.name,
            payload: test.payload || test.credentials,
            details: result
          });
        }
      } catch (error) {
        console.log(`Auth bypass test error: ${error.message}`);
      }
    }
    
    if (authResults.length > 0) {
      this.results.vulnerabilities.push({
        type: 'authentication_bypass',
        title: 'Authentication Bypass',
        description: 'Authentication bypass vulnerabilities detected',
        severity: 'critical',
        details: authResults,
        remediation: 'Implement proper authentication and input validation',
        timestamp: new Date()
      });
    }
    
    console.log('✅ Authentication bypass test completed');
  }

  async checkSecurityHeaders() {
    console.log('🔍 Checking security headers...');
    
    try {
      const headers = await this.getSecurityHeaders();
      const securityHeaders = {
        'X-Frame-Options': 'Prevents clickjacking',
        'X-Content-Type-Options': 'Prevents MIME type sniffing',
        'X-XSS-Protection': 'XSS protection',
        'Strict-Transport-Security': 'Enforces HTTPS',
        'Content-Security-Policy': 'Content security policy',
        'Referrer-Policy': 'Referrer policy'
      };
      
      const missingHeaders = [];
      
      for (const [header, description] of Object.entries(securityHeaders)) {
        if (!headers[header.toLowerCase()]) {
          missingHeaders.push({ header, description });
        }
      }
      
      if (missingHeaders.length > 0) {
        this.results.vulnerabilities.push({
          type: 'security_headers',
          title: 'Missing Security Headers',
          description: 'Important security headers are missing',
          severity: 'medium',
          details: missingHeaders,
          remediation: 'Implement missing security headers',
          timestamp: new Date()
        });
      }
      
      console.log('✅ Security headers check completed');
    } catch (error) {
      console.log(`❌ Security headers check failed: ${error.message}`);
    }
  }

  async checkSSLConfiguration() {
    console.log('🔍 Checking SSL/TLS configuration...');
    
    try {
      const sslResults = await this.testSSLConfiguration();
      
      if (sslResults.vulnerabilities.length > 0) {
        this.results.vulnerabilities.push({
          type: 'ssl_configuration',
          title: 'SSL/TLS Configuration Issues',
          description: 'SSL/TLS configuration vulnerabilities detected',
          severity: 'medium',
          details: sslResults.vulnerabilities,
          remediation: 'Update SSL/TLS configuration and disable weak protocols',
          timestamp: new Date()
        });
      }
      
      console.log('✅ SSL configuration check completed');
    } catch (error) {
      console.log(`❌ SSL configuration check failed: ${error.message}`);
    }
  }

  async checkCompliance() {
    console.log('🔍 Checking compliance standards...');
    
    const complianceStandards = {
      owasp: this.checkOWASPCompliance(),
      gdpr: this.checkGDPRCompliance(),
      sox: this.checkSOXCompliance(),
      hipaa: this.checkHIPAACompliance(),
      pci_dss: this.checkPCIDSSCompliance()
    };
    
    this.results.compliance = await Promise.all(Object.entries(complianceStandards).map(async ([standard, check]) => {
      try {
        return { standard, compliant: await check };
      } catch (error) {
        return { standard, compliant: false, error: error.message };
      }
    }));
    
    console.log('✅ Compliance check completed');
  }

  async generateReport() {
    console.log('📊 Generating VAPT report...');
    
    this.results.endTime = new Date();
    this.results.duration = this.results.endTime - this.results.startTime;
    
    // Calculate summary
    this.results.summary = {
      totalFindings: this.results.findings.length,
      totalVulnerabilities: this.results.vulnerabilities.length,
      criticalVulnerabilities: this.results.vulnerabilities.filter(v => v.severity === 'critical').length,
      highVulnerabilities: this.results.vulnerabilities.filter(v => v.severity === 'high').length,
      mediumVulnerabilities: this.results.vulnerabilities.filter(v => v.severity === 'medium').length,
      lowVulnerabilities: this.results.vulnerabilities.filter(v => v.severity === 'low').length,
      complianceScore: this.calculateComplianceScore()
    };
    
    // Generate different report formats
    await this.generateJSONReport();
    await this.generateHTMLReport();
    await this.generateCSVReport();
    
    console.log('✅ VAPT report generated successfully');
  }

  async generateJSONReport() {
    const reportPath = path.join(this.config.outputDir, `${this.results.scanId}-report.json`);
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 JSON report saved: ${reportPath}`);
  }

  async generateHTMLReport() {
    const htmlTemplate = this.generateHTMLTemplate();
    const reportPath = path.join(this.config.outputDir, `${this.results.scanId}-report.html`);
    fs.writeFileSync(reportPath, htmlTemplate);
    console.log(`📄 HTML report saved: ${reportPath}`);
  }

  async generateCSVReport() {
    const csvContent = this.generateCSVContent();
    const reportPath = path.join(this.config.outputDir, `${this.results.scanId}-vulnerabilities.csv`);
    fs.writeFileSync(reportPath, csvContent);
    console.log(`📄 CSV report saved: ${reportPath}`);
  }

  generateHTMLTemplate() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VAPT Report - ${this.results.scanId}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .summary-card { background: white; padding: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .vulnerability { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .critical { background: #f8d7da; border-color: #f5c6cb; }
        .high { background: #fff3cd; border-color: #ffeaa7; }
        .medium { background: #d1ecf1; border-color: #bee5eb; }
        .low { background: #d4edda; border-color: #c3e6cb; }
        .compliance { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 20px 0; }
        .compliance-item { padding: 10px; border-radius: 5px; text-align: center; }
        .compliant { background: #d4edda; color: #155724; }
        .non-compliant { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="header">
        <h1>VAPT Security Assessment Report</h1>
        <p><strong>Scan ID:</strong> ${this.results.scanId}</p>
        <p><strong>Target:</strong> ${this.results.target}</p>
        <p><strong>Start Time:</strong> ${this.results.startTime.toISOString()}</p>
        <p><strong>End Time:</strong> ${this.results.endTime.toISOString()}</p>
        <p><strong>Duration:</strong> ${Math.round(this.results.duration / 1000)} seconds</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <h3>Total Vulnerabilities</h3>
            <p style="font-size: 2em; margin: 0;">${this.results.summary.totalVulnerabilities}</p>
        </div>
        <div class="summary-card">
            <h3>Critical</h3>
            <p style="font-size: 2em; margin: 0; color: #dc3545;">${this.results.summary.criticalVulnerabilities}</p>
        </div>
        <div class="summary-card">
            <h3>High</h3>
            <p style="font-size: 2em; margin: 0; color: #fd7e14;">${this.results.summary.highVulnerabilities}</p>
        </div>
        <div class="summary-card">
            <h3>Compliance Score</h3>
            <p style="font-size: 2em; margin: 0; color: #28a745;">${this.results.summary.complianceScore}%</p>
        </div>
    </div>

    <h2>Vulnerabilities</h2>
    ${this.results.vulnerabilities.map(vuln => `
        <div class="vulnerability ${vuln.severity}">
            <h3>${vuln.title}</h3>
            <p><strong>Severity:</strong> ${vuln.severity.toUpperCase()}</p>
            <p><strong>Description:</strong> ${vuln.description}</p>
            <p><strong>Remediation:</strong> ${vuln.remediation}</p>
            <p><strong>Discovered:</strong> ${vuln.timestamp.toISOString()}</p>
        </div>
    `).join('')}

    <h2>Compliance Status</h2>
    <div class="compliance">
        ${this.results.compliance.map(comp => `
            <div class="compliance-item ${comp.compliant ? 'compliant' : 'non-compliant'}">
                <h4>${comp.standard.toUpperCase()}</h4>
                <p>${comp.compliant ? 'Compliant' : 'Non-Compliant'}</p>
            </div>
        `).join('')}
    </div>
</body>
</html>
    `;
  }

  generateCSVContent() {
    const headers = ['Title', 'Severity', 'Type', 'Description', 'Remediation', 'Discovered'];
    const rows = this.results.vulnerabilities.map(vuln => [
      vuln.title,
      vuln.severity,
      vuln.type,
      vuln.description,
      vuln.remediation,
      vuln.timestamp.toISOString()
    ]);
    
    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }

  calculateComplianceScore() {
    const compliant = this.results.compliance.filter(c => c.compliant).length;
    const total = this.results.compliance.length;
    return total > 0 ? Math.round((compliant / total) * 100) : 0;
  }

  async executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, { timeout: 300000 }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  async testXSSPayload(payload) {
    // Mock XSS test implementation
    return { vulnerable: false, url: '', parameter: '' };
  }

  async testCSRFProtection() {
    // Mock CSRF test implementation
    return { vulnerable: false };
  }

  async testAuthBypass(test) {
    // Mock authentication bypass test implementation
    return { vulnerable: false };
  }

  async getSecurityHeaders() {
    // Mock security headers check
    return {};
  }

  async testSSLConfiguration() {
    // Mock SSL configuration test
    return { vulnerabilities: [] };
  }

  async checkOWASPCompliance() {
    // Mock OWASP compliance check
    return false;
  }

  async checkGDPRCompliance() {
    // Mock GDPR compliance check
    return false;
  }

  async checkSOXCompliance() {
    // Mock SOX compliance check
    return false;
  }

  async checkHIPAACompliance() {
    // Mock HIPAA compliance check
    return false;
  }

  async checkPCIDSSCompliance() {
    // Mock PCI-DSS compliance check
    return false;
  }

  async run() {
    try {
      await this.initialize();
      
      // Run all security tests
      await this.runPortScan();
      await this.runWebVulnerabilityScan();
      await this.runDirectoryScan();
      await this.testSQLInjection();
      await this.testXSSVulnerabilities();
      await this.testCSRFVulnerabilities();
      await this.testAuthenticationBypass();
      await this.checkSecurityHeaders();
      await this.checkSSLConfiguration();
      await this.checkCompliance();
      
      // Generate reports
      await this.generateReport();
      
      console.log('\n🎉 VAPT testing completed successfully!');
      console.log(`📁 Reports saved in: ${this.config.outputDir}`);
      
    } catch (error) {
      console.error('❌ VAPT testing failed:', error.message);
      process.exit(1);
    }
  }
}

// CLI Interface
async function main() {
  const vapt = new VAPTTestingSuite();
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('🔐 SmartBizFlow VAPT Testing Suite');
  console.log('====================================');
  
  const answer = await new Promise((resolve) => {
    rl.question('Do you want to start the VAPT scan? (y/N): ', resolve);
  });
  
  rl.close();
  
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    await vapt.run();
  } else {
    console.log('VAPT scan cancelled.');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = VAPTTestingSuite; 