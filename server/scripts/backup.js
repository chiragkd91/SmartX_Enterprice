import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import encryptionManager from '../encryption.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

class BackupManager {
  constructor() {
    this.backupDir = path.join(__dirname, '../backups');
    this.dataDir = path.join(__dirname, '../data');
    this.config = {
      retention: {
        daily: 7,    // Keep 7 daily backups
        weekly: 4,   // Keep 4 weekly backups
        monthly: 12  // Keep 12 monthly backups
      }
    };
  }

  async ensureBackupDirectory() {
    try {
      await fs.access(this.backupDir);
    } catch (error) {
      await fs.mkdir(this.backupDir, { recursive: true });
    }
  }

  async createBackup(type = 'manual') {
    try {
      await this.ensureBackupDirectory();
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `backup_${type}_${timestamp}`;
      const backupPath = path.join(this.backupDir, backupName);
      
      console.log(`Creating ${type} backup: ${backupName}`);
      
      // Create backup directory
      await fs.mkdir(backupPath, { recursive: true });
      
      // Backup JSON database files
      await this.backupJsonFiles(backupPath);
      
      // Backup PostgreSQL if configured
      if (process.env.DATABASE_URL) {
        await this.backupPostgreSQL(backupPath);
      }
      
      // Create backup metadata
      const metadata = {
        type,
        timestamp: new Date().toISOString(),
        files: await this.getBackupFileList(backupPath),
        size: await this.getDirectorySize(backupPath),
        encrypted: false
      };
      
      await fs.writeFile(
        path.join(backupPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );
      
      console.log(`Backup created successfully: ${backupName}`);
      console.log(`Backup size: ${this.formatBytes(metadata.size)}`);
      
      // Encrypt backup if encryption is enabled
      if (process.env.ENCRYPT_BACKUPS === 'true') {
        console.log('Encrypting backup...');
        await this.encryptBackupDirectory(backupPath);
        metadata.encrypted = true;
        
        // Update metadata
        await fs.writeFile(
          path.join(backupPath, 'metadata.json'),
          JSON.stringify(metadata, null, 2)
        );
        
        console.log('Backup encrypted successfully');
      }
      
      // Clean old backups based on retention policy
      await this.cleanOldBackups(type);
      
      return {
        success: true,
        backupName,
        path: backupPath,
        metadata
      };
      
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    }
  }

  async backupJsonFiles(backupPath) {
    try {
      const dataPath = path.join(backupPath, 'data');
      await fs.mkdir(dataPath, { recursive: true });
      
      // List of JSON files to backup
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
          console.log(`Backed up: ${file}`);
        } catch (error) {
          // File doesn't exist, create empty backup
          await fs.writeFile(destPath, '[]');
          console.log(`Created empty backup for: ${file}`);
        }
      }
      
    } catch (error) {
      console.error('JSON backup failed:', error);
      throw error;
    }
  }

  async backupPostgreSQL(backupPath) {
    try {
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) return;
      
      const dumpPath = path.join(backupPath, 'postgresql_dump.sql');
      const command = `pg_dump "${dbUrl}" > "${dumpPath}"`;
      
      console.log('Creating PostgreSQL backup...');
      await execAsync(command);
      console.log('PostgreSQL backup completed');
      
    } catch (error) {
      console.error('PostgreSQL backup failed:', error);
      // Don't throw - continue with JSON backup
    }
  }

  async getBackupFileList(backupPath) {
    const files = [];
    
    async function scanDirectory(dir, relativePath = '') {
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
    }
    
    await scanDirectory(backupPath);
    return files;
  }

  async getDirectorySize(dirPath) {
    let totalSize = 0;
    
    async function calculateSize(dir) {
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
    }
    
    await calculateSize(dirPath);
    return totalSize;
  }

  async listBackups() {
    try {
      await this.ensureBackupDirectory();
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

  async cleanOldBackups(type) {
    try {
      const backups = await this.listBackups();
      const typeBackups = backups.filter(b => b.type === type);
      
      let retention;
      switch (type) {
        case 'daily':
          retention = this.config.retention.daily;
          break;
        case 'weekly':
          retention = this.config.retention.weekly;
          break;
        case 'monthly':
          retention = this.config.retention.monthly;
          break;
        default:
          return; // Don't clean manual backups
      }
      
      if (typeBackups.length > retention) {
        const toDelete = typeBackups.slice(retention);
        
        for (const backup of toDelete) {
          await this.deleteBackup(backup.name);
          console.log(`Deleted old backup: ${backup.name}`);
        }
      }
      
    } catch (error) {
      console.error('Failed to clean old backups:', error);
    }
  }

  async deleteBackup(backupName) {
    try {
      const backupPath = path.join(this.backupDir, backupName);
      await this.deleteDirectory(backupPath);
      console.log(`Backup deleted: ${backupName}`);
      
    } catch (error) {
      console.error(`Failed to delete backup ${backupName}:`, error);
      throw error;
    }
  }

  async deleteDirectory(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        await this.deleteDirectory(fullPath);
      } else {
        await fs.unlink(fullPath);
      }
    }
    
    await fs.rmdir(dirPath);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async scheduleBackups() {
    // This would typically be called by a cron job or scheduler
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const date = now.getDate();
    
    // Daily backup at 2 AM
    if (hour === 2) {
      await this.createBackup('daily');
    }
    
    // Weekly backup on Sunday at 3 AM
    if (day === 0 && hour === 3) {
      await this.createBackup('weekly');
    }
    
    // Monthly backup on 1st day at 4 AM
    if (date === 1 && hour === 4) {
      await this.createBackup('monthly');
    }
  }
}

// CLI Interface
async function main() {
  const backupManager = new BackupManager();
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'create':
        const type = process.argv[3] || 'manual';
        const result = await backupManager.createBackup(type);
        console.log('Backup completed:', result.backupName);
        break;
        
      case 'list':
        const backups = await backupManager.listBackups();
        console.log('\nAvailable Backups:');
        console.log('==================');
        
        if (backups.length === 0) {
          console.log('No backups found.');
        } else {
          backups.forEach(backup => {
            console.log(`${backup.name}`);
            console.log(`  Type: ${backup.type}`);
            console.log(`  Date: ${new Date(backup.timestamp).toLocaleString()}`);
            console.log(`  Size: ${backupManager.formatBytes(backup.size)}`);
            console.log('');
          });
        }
        break;
        
      case 'delete':
        const backupName = process.argv[3];
        if (!backupName) {
          console.error('Please specify backup name to delete');
          process.exit(1);
        }
        await backupManager.deleteBackup(backupName);
        break;
        
      case 'schedule':
        await backupManager.scheduleBackups();
        break;
        
      default:
        console.log('Usage:');
        console.log('  node backup.js create [type]  - Create backup (manual/daily/weekly/monthly)');
        console.log('  node backup.js list           - List all backups');
        console.log('  node backup.js delete <name>  - Delete specific backup');
        console.log('  node backup.js schedule       - Run scheduled backup check');
        break;
    }
    
  } catch (error) {
    console.error('Backup operation failed:', error);
    process.exit(1);
  }
}

// Export for use in other modules
module.exports = BackupManager;

// Run CLI if called directly
if (require.main === module) {
  main();
}