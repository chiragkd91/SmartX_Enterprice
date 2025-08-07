/**
 * Employee ID Input Component
 * Provides validation, auto-generation, and series management for Employee IDs
 */

import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  generateNextEmployeeId, 
  validateEmployeeId, 
  getAvailableFormats,
  getDepartmentFromEmployeeId,
  isEmployeeIdAvailable,
  addEmployeeIdToDatabase,
  type ValidationResult 
} from '../utils/employeeIdGenerator';
import { 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Info,
  Sparkles,
  Hash,
  Building
} from 'lucide-react';
import { cn } from '../lib/utils';

interface EmployeeIdInputProps {
  value: string;
  onChange: (value: string) => void;
  department?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export default function EmployeeIdInput({
  value,
  onChange,
  department,
  className,
  placeholder = "Enter or generate Employee ID",
  disabled = false,
  required = true,
  onValidationChange
}: EmployeeIdInputProps) {
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [detectedDepartment, setDetectedDepartment] = useState<string | null>(null);

  // Validate whenever value or department changes
  useEffect(() => {
    if (value) {
      const result = validateEmployeeId(value, department);
      setValidation(result);
      setDetectedDepartment(getDepartmentFromEmployeeId(value));
      onValidationChange?.(result.isValid);
    } else {
      setValidation({ isValid: !required, errors: required ? ['Employee ID is required'] : [] });
      setDetectedDepartment(null);
      onValidationChange?.(!required);
    }
  }, [value, department, required, onValidationChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    onChange(newValue);
    setShowSuggestions(false);
  };

  const handleGenerateId = async () => {
    if (!department) {
      alert('Please select a department first to generate Employee ID');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const generated = generateNextEmployeeId(department);
      onChange(generated.id);
      setShowSuggestions(false);
      
      // Add to database to track usage
      addEmployeeIdToDatabase(generated.id);
      
    } catch (error) {
      console.error('Error generating Employee ID:', error);
      alert('Error generating Employee ID. Please try manually.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Extract ID from suggestion text if it contains one
    const idMatch = suggestion.match(/\b[A-Z]{3}\d{3}\b/);
    if (idMatch) {
      onChange(idMatch[0]);
      setShowSuggestions(false);
    }
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  const availableFormats = getAvailableFormats();

  return (
    <div className="space-y-2">
      <Label htmlFor="employeeId" className="flex items-center gap-2">
        <Hash className="h-4 w-4" />
        Employee ID {required && <span className="text-red-500">*</span>}
        {detectedDepartment && (
          <Badge variant="secondary" className="text-xs">
            <Building className="h-3 w-3 mr-1" />
            {detectedDepartment}
          </Badge>
        )}
      </Label>
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            id="employeeId"
            value={value}
            onChange={handleInputChange}
            className={cn(
              "uppercase font-mono",
              validation.isValid ? "border-green-300 focus:border-green-500" : "border-red-300 focus:border-red-500",
              className
            )}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={10}
          />
          
          {/* Validation Icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {value && (
              validation.isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )
            )}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          type="button"
          onClick={handleGenerateId}
          disabled={disabled || isGenerating || !department}
          variant="outline"
          size="sm"
          className="px-3"
          title={!department ? "Select department first" : "Generate next available Employee ID"}
        >
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </Button>

        {/* Info Button */}
        <Button
          type="button"
          onClick={toggleSuggestions}
          variant="outline"
          size="sm"
          className="px-3"
          title="Show Employee ID formats and suggestions"
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>

      {/* Validation Messages */}
      {validation.errors.length > 0 && (
        <div className="space-y-1">
          {validation.errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {validation.suggestions && validation.suggestions.length > 0 && (
        <div className="space-y-1">
          {validation.suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer hover:text-blue-800"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Info className="h-3 w-3" />
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {/* Format Information Panel */}
      {showSuggestions && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <Hash className="h-4 w-4" />
            Employee ID Formats
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {availableFormats.map((format) => (
              <div 
                key={format.department}
                className={cn(
                  "flex items-center justify-between p-2 rounded cursor-pointer transition-colors",
                  department === format.department 
                    ? "bg-blue-100 border border-blue-300" 
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                )}
                onClick={() => department === format.department && onChange('')}
              >
                <div>
                  <div className="font-medium">{format.department}</div>
                  <div className="text-gray-600">{format.prefix}001 - {format.prefix}999</div>
                </div>
                <Badge 
                  variant={department === format.department ? "default" : "secondary"}
                  className="font-mono text-xs"
                >
                  {format.example}
                </Badge>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-600 border-t pt-2">
            <strong>Format:</strong> [PREFIX][NUMBER] where PREFIX is department-specific (3 letters) and NUMBER is 001-999
          </div>
        </div>
      )}

      {/* Success Message for Available ID */}
      {value && validation.isValid && isEmployeeIdAvailable(value) && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-3 w-3" />
          Employee ID is available and valid
        </div>
      )}
    </div>
  );
}
