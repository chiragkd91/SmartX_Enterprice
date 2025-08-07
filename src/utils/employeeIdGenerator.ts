/**
 * Employee ID Generator and Validator
 * Provides series-wise ID generation and comprehensive validation
 */

export interface EmployeeIdConfig {
  prefix: string;
  department: string;
  series: string;
  length: number;
  pattern: RegExp;
}

export interface GeneratedEmployeeId {
  id: string;
  series: string;
  number: number;
  department: string;
  prefix: string;
  isValid: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions?: string[];
}

// Department-wise ID configurations
export const EMPLOYEE_ID_CONFIGS: Record<string, EmployeeIdConfig> = {
  'IT': {
    prefix: 'ECI',
    department: 'IT',
    series: 'IT',
    length: 7, // ECI0001
    pattern: /^ECI\d{4}$/
  },
  'Sales': {
    prefix: 'ECS',
    department: 'Sales', 
    series: 'SL',
    length: 7, // ECS0001
    pattern: /^ECS\d{4}$/
  },
  'Marketing': {
    prefix: 'ECM',
    department: 'Marketing',
    series: 'MK',
    length: 7, // ECM0001
    pattern: /^ECM\d{4}$/
  },
  'HR': {
    prefix: 'ECH',
    department: 'HR',
    series: 'HR',
    length: 7, // ECH0001
    pattern: /^ECH\d{4}$/
  },
  'Finance': {
    prefix: 'ECF',
    department: 'Finance',
    series: 'FN',
    length: 7, // ECF0001
    pattern: /^ECF\d{4}$/
  },
  'Operations': {
    prefix: 'ECO',
    department: 'Operations',
    series: 'OP',
    length: 7, // ECO0001
    pattern: /^ECO\d{4}$/
  },
  'Management': {
    prefix: 'ECX',
    department: 'Management',
    series: 'MG',
    length: 7, // ECX0001
    pattern: /^ECX\d{4}$/
  }
};

// Mock existing employee IDs for series tracking
let mockEmployeeDatabase: string[] = [
  'ECI001', 'ECI002', 'ECI003',
  'ECS001', 'ECS002',
  'ECM001',
  'ECH001', 'ECH002',
  'ECF001'
];

/**
 * Get the next available employee ID for a department
 */
export function generateNextEmployeeId(department: string): GeneratedEmployeeId {
  const config = EMPLOYEE_ID_CONFIGS[department];
  
  if (!config) {
    throw new Error(`Department '${department}' is not configured for Employee ID generation`);
  }

  // Find existing IDs for this department
  const existingIds = mockEmployeeDatabase
    .filter(id => id.startsWith(config.prefix))
    .map(id => {
      const match = id.match(/\d+$/);
      return match ? parseInt(match[0], 10) : 0;
    })
    .sort((a, b) => a - b);

  // Find next available number
  let nextNumber = 1;
  for (let i = 0; i < existingIds.length; i++) {
    if (existingIds[i] === nextNumber) {
      nextNumber++;
    } else {
      break;
    }
  }

  const paddedNumber = nextNumber.toString().padStart(3, '0');
  const newId = `${config.prefix}${paddedNumber}`;

  return {
    id: newId,
    series: config.series,
    number: nextNumber,
    department: config.department,
    prefix: config.prefix,
    isValid: true
  };
}

/**
 * Validate an employee ID
 */
export function validateEmployeeId(employeeId: string, department?: string): ValidationResult {
  const errors: string[] = [];
  const suggestions: string[] = [];

  // Basic validation
  if (!employeeId) {
    errors.push('Employee ID is required');
    return { isValid: false, errors, suggestions };
  }

  if (employeeId.length < 6 || employeeId.length > 10) {
    errors.push('Employee ID must be between 6 and 10 characters');
  }

  // Check if it matches any department pattern
  let matchedConfig: EmployeeIdConfig | null = null;
  let detectedDepartment: string | null = null;

  for (const [dept, config] of Object.entries(EMPLOYEE_ID_CONFIGS)) {
    if (config.pattern.test(employeeId)) {
      matchedConfig = config;
      detectedDepartment = dept;
      break;
    }
  }

  if (!matchedConfig) {
    errors.push('Employee ID format is invalid');
    errors.push('Expected format: [PREFIX][000] (e.g., ECI001, ECS001, ECM001)');
    
    // Suggest correct formats
    if (department && EMPLOYEE_ID_CONFIGS[department]) {
      const suggested = generateNextEmployeeId(department);
      suggestions.push(`Suggested ID for ${department}: ${suggested.id}`);
    } else {
      suggestions.push('Available formats:');
      Object.entries(EMPLOYEE_ID_CONFIGS).forEach(([dept, config]) => {
        suggestions.push(`${dept}: ${config.prefix}001 - ${config.prefix}999`);
      });
    }
    
    return { isValid: false, errors, suggestions };
  }

  // Check department consistency
  if (department && detectedDepartment !== department) {
    errors.push(`Employee ID prefix '${matchedConfig.prefix}' does not match selected department '${department}'`);
    if (EMPLOYEE_ID_CONFIGS[department]) {
      const correctId = generateNextEmployeeId(department);
      suggestions.push(`Use ${correctId.id} for ${department} department`);
    }
  }

  // Check for duplicates
  if (mockEmployeeDatabase.includes(employeeId)) {
    errors.push('Employee ID already exists');
    if (detectedDepartment) {
      const nextAvailable = generateNextEmployeeId(detectedDepartment);
      suggestions.push(`Next available ID: ${nextAvailable.id}`);
    }
  }

  // Check number sequence
  const numberMatch = employeeId.match(/\d+$/);
  if (numberMatch) {
    const number = parseInt(numberMatch[0], 10);
    if (number === 0) {
      errors.push('Employee ID number cannot be 000');
      suggestions.push('Employee ID numbers start from 001');
    }
    if (number > 999) {
      errors.push('Employee ID number cannot exceed 999');
      suggestions.push('Consider using a different department prefix or contact IT');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    suggestions: suggestions.length > 0 ? suggestions : undefined
  };
}

/**
 * Add employee ID to database (for tracking)
 */
export function addEmployeeIdToDatabase(employeeId: string): void {
  if (!mockEmployeeDatabase.includes(employeeId)) {
    mockEmployeeDatabase.push(employeeId);
    mockEmployeeDatabase.sort();
  }
}

/**
 * Get all available employee ID formats
 */
export function getAvailableFormats(): Array<{department: string; prefix: string; example: string}> {
  return Object.entries(EMPLOYEE_ID_CONFIGS).map(([department, config]) => ({
    department,
    prefix: config.prefix,
    example: `${config.prefix}001`
  }));
}

/**
 * Get department from employee ID
 */
export function getDepartmentFromEmployeeId(employeeId: string): string | null {
  for (const [department, config] of Object.entries(EMPLOYEE_ID_CONFIGS)) {
    if (config.pattern.test(employeeId)) {
      return department;
    }
  }
  return null;
}

/**
 * Check if employee ID is available
 */
export function isEmployeeIdAvailable(employeeId: string): boolean {
  return !mockEmployeeDatabase.includes(employeeId);
}

/**
 * Get existing employee IDs for a department
 */
export function getExistingEmployeeIds(department: string): string[] {
  const config = EMPLOYEE_ID_CONFIGS[department];
  if (!config) return [];
  
  return mockEmployeeDatabase
    .filter(id => id.startsWith(config.prefix))
    .sort();
}

/**
 * Get employee ID statistics
 */
export function getEmployeeIdStats() {
  const stats: Record<string, {used: number; available: number; prefix: string}> = {};
  
  Object.entries(EMPLOYEE_ID_CONFIGS).forEach(([department, config]) => {
    const used = mockEmployeeDatabase.filter(id => id.startsWith(config.prefix)).length;
    stats[department] = {
      used,
      available: 999 - used,
      prefix: config.prefix
    };
  });
  
  return stats;
}
