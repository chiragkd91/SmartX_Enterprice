# Employee Import/Export Guide

## Overview

The Employee Management module now includes comprehensive Import and Export functionality that allows you to:
- Export all employee data to CSV format
- Import multiple employees from CSV files
- Maintain data consistency and validation

## Export Functionality

### How to Export
1. Navigate to HR → Employee Management
2. Click the **Export** button in the header
3. A CSV file will be automatically downloaded with the current date in the filename

### Export File Format
The exported CSV includes all employee information:
- Employee ID
- Full Name
- Email
- Phone
- Department
- Position
- Annual Salary
- Join Date
- Status
- Manager
- Address
- Emergency Contact
- Skills (comma-separated)
- Performance Rating

## Import Functionality

### How to Import
1. Navigate to HR → Employee Management
2. Click the **Import** button in the header
3. Select a CSV file from your computer
4. The system will validate and import the data
5. A success message will show the number of imported employees

### Required CSV Format

The import CSV file must include the following headers (in any order):

```csv
Employee ID,Full Name,Email,Phone,Department,Position,Annual Salary,Join Date,Status,Manager,Address,Emergency Contact,Skills,Performance Rating
```

### Sample Import CSV

```csv
Employee ID,Full Name,Email,Phone,Department,Position,Annual Salary,Join Date,Status,Manager,Address,Emergency Contact,Skills,Performance Rating
EMP001,John Smith,john.smith@company.com,+91 98765 43210,IT,Software Engineer,600000,2024-01-15,Active,Tech Lead,Mumbai Maharashtra,+91 98765 43211,"React, Node.js, Python",4.2
EMP002,Sarah Johnson,sarah.johnson@company.com,+91 98765 43212,HR,HR Specialist,550000,2024-02-01,Active,HR Manager,Delhi India,+91 98765 43213,"Recruitment, Training",4.5
EMP003,Mike Wilson,mike.wilson@company.com,+91 98765 43214,Sales,Sales Executive,500000,2024-03-01,Active,Sales Manager,Bangalore Karnataka,+91 98765 43215,"Sales, CRM",4.0
```

## Field Specifications

### Required Fields
- **Employee ID**: Unique identifier (auto-generated if empty)
- **Full Name**: Employee's complete name
- **Email**: Valid email address
- **Phone**: Contact number
- **Department**: Must match existing departments
- **Position**: Job title/role
- **Annual Salary**: Numeric value (no currency symbols)
- **Join Date**: YYYY-MM-DD format
- **Status**: Active, Inactive, or On Leave

### Optional Fields
- **Manager**: Reporting manager's name
- **Address**: Complete address
- **Emergency Contact**: Emergency contact number
- **Skills**: Semicolon-separated list of skills
- **Performance Rating**: Numeric value (0.0 to 5.0)

## Data Validation

### Import Validation Rules
1. **Email Uniqueness**: Each email must be unique
2. **Employee ID**: Must be unique if provided
3. **Department**: Must be one of: IT, Sales, Marketing, HR, Finance, Operations, Customer Service, Management
4. **Status**: Must be Active, Inactive, or On Leave
5. **Salary**: Must be a valid number
6. **Join Date**: Must be a valid date in YYYY-MM-DD format
7. **Performance Rating**: Must be between 0.0 and 5.0

### Error Handling
- Invalid rows are skipped with console warnings
- Successful imports show confirmation with count
- File format errors display user-friendly messages

## Best Practices

### Preparing Import Data
1. **Use the Export feature** to get the correct format template
2. **Validate emails** before importing to avoid duplicates
3. **Check department names** match the system values
4. **Use consistent date format** (YYYY-MM-DD)
5. **Test with small batches** before bulk imports

### Data Integrity
1. **Backup existing data** before large imports
2. **Review imported data** after successful import
3. **Maintain employee ID consistency** across systems
4. **Update skills regularly** using semicolon separation

## Troubleshooting

### Common Issues

#### Import Failed - "Invalid CSV file format"
- **Cause**: File has less than 2 lines or incorrect format
- **Solution**: Ensure file has header row plus at least one data row

#### Import Failed - "Error importing file"
- **Cause**: File parsing error or invalid data
- **Solution**: Check CSV format, remove special characters, ensure UTF-8 encoding

#### Some Employees Not Imported
- **Cause**: Data validation failures
- **Solution**: Check console for specific errors, verify required fields

#### Skills Not Displaying Correctly
- **Cause**: Incorrect separator in skills field
- **Solution**: Use semicolons (;) to separate skills, not commas

### File Format Tips

#### Excel Users
1. Save file as "CSV (Comma delimited) (*.csv)"
2. Ensure UTF-8 encoding for special characters
3. Remove any formula references before saving

#### Google Sheets Users
1. File → Download → Comma-separated values (.csv)
2. Check for proper text encoding

#### Text Editors
1. Use UTF-8 encoding
2. Ensure proper line endings (LF or CRLF)
3. Avoid BOM (Byte Order Mark) characters

## Advanced Features

### Bulk Operations
- Import supports unlimited number of employees
- System generates unique IDs for missing Employee IDs
- Automatic validation prevents duplicate emails

### Performance Considerations
- Large files (>1000 employees) may take time to process
- Import happens in browser memory - no server upload required
- Export is instantaneous for current dataset

### Data Migration
- Use export/import for system migrations
- Maintains all employee relationships and data
- Preserves performance ratings and skill sets

## Security Notes

- All import/export happens client-side
- No data is sent to external servers
- CSV files contain sensitive employee information
- Store exported files securely
- Delete temporary files after use

## Sample Use Cases

### New System Setup
1. Export employee data from old system
2. Format according to SmartBizFlow template
3. Import into new system
4. Verify all data imported correctly

### Department Restructuring
1. Export current employee list
2. Update department assignments
3. Re-import updated file
4. Verify organizational changes

### Performance Review Season
1. Export with current performance ratings
2. Update ratings in spreadsheet
3. Import updated performance data
4. Generate performance reports

This import/export functionality provides a robust solution for managing employee data at scale while maintaining data integrity and security.
