const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

class RestoreManager {
  constructor() {
    this.backupDir = path.join(__dirname, '../backups');
    this.dataDir = path.join(__dirname, '../data');
  }

  async listBackups() {
    try {
      await fs.access(this.backupDir);
      const entries = await fs.readdir(this.backupDir, { withFileTypes: true });
      const backups = [];
      
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name.startsWith('backup_')) {
          const backupPath = path.join(this.backupDir, entry.name);
          const metadataPath = path.join(backupPath, 'metadata.json');
          
          try {
            const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
            backups.push({
              name: entry.name,
              path: backupPath,
              ...metadata
            });
          } catch (error) {
            // Backup without metadata
            const stats = await fs.stat(backupPath);
            backups.push({
              name: entry.name,
              path: backupPath,
              type: 'unknown',
              timestamp: stats.ctime.toISOString(),
              size: await this.getDirectorySize(backupPath)
            });
          }
        }
      }
      
      return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }

  async restoreBackup(backupName, options = {}) {
    try {
      const backupPath = path.join(this.backupDir, backupName);
      
      // Verify backup exists
      try {
        await fs.access(backupPath);
      } catch (error) {
        throw new Error(`Backup not found: ${backupName}`);
      }
      
      console.log(`Starting restore from backup: ${backupName}`);
      
      // Create backup of current data before restore
      if (!options.skipCurrentBackup) {
        await this.createCurrentDataBackup();
      }
      
      // Load backup metadata
      const metadata = await this.loadBackupMetadata(backupPath);
      console.log(`Backup created: ${new Date(metadata.timestamp).toLocaleString()}`);
      console.log(`Backup type: ${metadata.type}`);
      
      // Restore JSON files
      await this.restoreJsonFiles(backupPath);
      
      // Restore PostgreSQL if available
      if (process.env.DATABASE_URL) {
        await this.restorePostgreSQL(backupPath);
      }
      
      console.log('Restore completed successfully');
      
      return {
        success: true,
        backupName,
        restoredAt: new Date().toISOString(),
        metadata
      };
      
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  }

  async loadBackupMetadata(backupPath) {
    try {
      const metadataPath = path.join(backupPath, 'metadata.json');
      const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
      return metadata;
    } catch (error) {
      // Return default metadata if not found
      return {
        type: 'unknown',
        timestamp: new Date().toISOString(),
        files: [],
        size: 0
      };
    }
  }

  async createCurrentDataBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `pre_restore_backup_${timestamp}`;
      const backupPath = path.join(this.backupDir, backupName);
      
      console.log('Creating backup of current data before restore...');
      
      await fs.mkdir(backupPath, { recursive: true });
      
      // Backup current JSON files
      await this.backupCurrentJsonFiles(backupPath);
      
      // Create metadata
      const metadata = {
        type: 'pre_restore',
        timestamp: new Date().toISOString(),
        files: await this.getBackupFileList(backupPath),
        size: await this.getDirectorySize(backupPath)
      };
      
      await fs.writeFile(
        path.join(backupPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );
      
      console.log(`Current data backed up to: ${backupName}`);
      
    } catch (error) {
      console.error('Failed to backup current data:', error);
      throw error;
    }
  }

  async backupCurrentJsonFiles(backupPath) {
    try {
      const dataPath = path.join(backupPath, 'data');
      await fs.mkdir(dataPath, { recursive: true });
      
      // Ensure data directory exists
      try {
        await fs.access(this.dataDir);
      } catch (error) {
        await fs.mkdir(this.dataDir, { recursive: true });
      }
      
      const jsonFiles = [
        'users.json',
        'employees.json',
        'attendance.json',
        'leaves.json',
        'payroll.json',
        'customers.json',
        'leads.json',
        'assets.json',
        'audit.json'
      ];
      
      for (const file of jsonFiles) {
        const sourcePath = path.join(this.dataDir, file);
        const destPath = path.join(dataPath, file);
        
        try {
          await fs.access(sourcePath);
          await fs.copyFile(sourcePath, destPath);
        } catch (error) {
          // File doesn't exist, create empty backup
          await fs.writeFile(destPath, '[]');
        }
      }
      
    } catch (error) {
      console.error('Failed to backup current JSON files:', error);
      throw error;
    }
  }

  async restoreJsonFiles(backupPath) {
    try {
      const backupDataPath = path.join(backupPath, 'data');
      
      // Verify backup data exists
      try {
        await fs.access(backupDataPath);
      } catch (error) {
        console.log('No JSON data found in backup, skipping JSON restore');
        return;
      }
      
      // Ensure data directory exists
      try {
        await fs.access(this.dataDir);
      } catch (error) {
        await fs.mkdir(this.dataDir, { recursive: true });
      }
      
      console.log('Restoring JSON files...');
      
      const files = await fs.readdir(backupDataPath);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const sourcePath = path.join(backupDataPath, file);
          const destPath = path.join(this.dataDir, file);
          
          await fs.copyFile(sourcePath, destPath);
          console.log(`Restored: ${file}`);
        }
      }
      
      console.log('JSON files restored successfully');
      
    } catch (error) {
      console.error('JSON restore failed:', error);
      throw error;
    }
  }

  async restorePostgreSQL(backupPath) {
    try {
      const dumpPath = path.join(backupPath, 'postgresql_dump.sql');
      
      // Check if PostgreSQL dump exists
      try {
        await fs.access(dumpPath);
      } catch (error) {
        console.log('No PostgreSQL dump found in backup, skipping database restore');
        return;
      }
      
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        console.log('No DATABASE_URL configured, skipping PostgreSQL restore');
        return;
      }
      
      console.log('Restoring PostgreSQL database...');
      
      // Drop and recreate database (be careful!)
      const command = `psql "${dbUrl}" < "${dumpPath}"`;
      
      await execAsync(command);
      console.log('PostgreSQL database restored successfully');
      
    } catch (error) {
      console.error('PostgreSQL restore failed:', error);
      // Don't throw - continue with JSON restore
    }
  }

  async getDirectorySize(dirPath) {
    let totalSize = 0;
    
    async function calculateSize(dir) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            await calculateSize(fullPath);
          } else {
            const stats = await fs.stat(fullPath);
            totalSize += stats.size;
          }
        }
      } catch (error) {
        // Skip inaccessible directories
      }
    }
    
    await calculateSize(dirPath);
    return totalSize;
  }

  async getBackupFileList(backupPath) {
    const files = [];
    
    async function scanDirectory(dir, relativePath = '') {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relPath = path.join(relativePath, entry.name);
          
          if (entry.isDirectory()) {
            await scanDirectory(fullPath, relPath);
          } else {
            const stats = await fs.stat(fullPath);
            files.push({
              path: relPath,
              size: stats.size,
              modified: stats.mtime
            });
          }
        }
      } catch (error) {
        // Skip inaccessible directories
      }
    }
    
    await scanDirectory(backupPath);
    return files;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async validateBackup(backupName) {
    try {
      const backupPath = path.join(this.backupDir, backupName);
      
      // Check if backup exists
      await fs.access(backupPath);
      
      // Load metadata
      const metadata = await this.loadBackupMetadata(backupPath);
      
      // Validate files exist
      const issues = [];
      
      if (metadata.files && metadata.files.length > 0) {
        for (const file of metadata.files) {
          const filePath = path.join(backupPath, file.path);
          try {
            await fs.access(filePath);
          } catch (error) {
            issues.push(`Missing file: ${file.path}`);
          }
        }
      }
      
      return {
        valid: issues.length === 0,
        issues,
        metadata
      };
      
    } catch (error) {
      return {
        valid: false,
        issues: [`Backup validation failed: ${error.message}`],
        metadata: null
      };
    }
  }
}

// CLI Interface
async function main() {
  const restoreManager = new RestoreManager();
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'list':
        const backups = await restoreManager.listBackups();
        console.log('\nAvailable Backups for Restore:');
        console.log('===============================');
        
        if (backups.length === 0) {
          console.log('No backups found.');
        } else {
          backups.forEach((backup, index) => {
            console.log(`${index + 1}. ${backup.name}`);
            console.log(`   Type: ${backup.type}`);
            console.log(`   Date: ${new Date(backup.timestamp).toLocaleString()}`);
            console.log(`   Size: ${restoreManager.formatBytes(backup.size)}`);
            console.log('');
          });
        }
        break;
        
      case 'restore':
        const backupName = process.argv[3];
        if (!backupName) {
          console.error('Please specify backup name to restore');
          console.log('Use "node restore.js list" to see available backups');
          process.exit(1);
        }
        
        const skipBackup = process.argv.includes('--skip-current-backup');
        const result = await restoreManager.restoreBackup(backupName, {
          skipCurrentBackup: skipBackup
        });
        
        console.log('Restore completed successfully');
        break;
        
      case 'validate':
        const validateName = process.argv[3];
        if (!validateName) {
          console.error('Please specify backup name to validate');
          process.exit(1);
        }
        
        const validation = await restoreManager.validateBackup(validateName);
        
        if (validation.valid) {
          console.log(`Backup ${validateName} is valid`);
        } else {
          console.log(`Backup ${validateName} has issues:`);
          validation.issues.forEach(issue => console.log(`  - ${issue}`));
        }
        break;
        
      default:
        console.log('Usage:');
        console.log('  node restore.js list                    - List available backups');
        console.log('  node restore.js restore <backup-name>   - Restore from backup');
        console.log('  node restore.js validate <backup-name>  - Validate backup integrity');
        console.log('');
        console.log('Options:');
        console.log('  --skip-current-backup  - Skip creating backup of current data');
        break;
    }
    
  } catch (error) {
    console.error('Restore operation failed:', error);
    process.exit(1);
  }
}

// Export for use in other modules
module.exports = RestoreManager;

// Run CLI if called directly
if (require.main === module) {
  main();
}