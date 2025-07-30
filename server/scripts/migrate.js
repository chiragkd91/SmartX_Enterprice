/**
 * SmartBizFlow Database Migration Runner
 * Handles database schema migrations for production deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

class MigrationRunner {
  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_mnUM9d1OwFJo@ep-falling-leaf-adt7rhys.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    this.migrationsPath = path.join(__dirname, '..', 'migrations');
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('✅ Connected to database');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log('✅ Disconnected from database');
    } catch (error) {
      console.error('❌ Database disconnection failed:', error);
    }
  }

  async createMigrationsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) UNIQUE NOT NULL,
        filename VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    try {
      await this.client.query(query);
      console.log('✅ Migrations table created/verified');
    } catch (error) {
      console.error('❌ Failed to create migrations table:', error);
      throw error;
    }
  }

  async getExecutedMigrations() {
    try {
      const result = await this.client.query(
        'SELECT version FROM schema_migrations ORDER BY version'
      );
      return result.rows.map(row => row.version);
    } catch (error) {
      console.error('❌ Failed to get executed migrations:', error);
      return [];
    }
  }

  async getMigrationFiles() {
    try {
      if (!fs.existsSync(this.migrationsPath)) {
        console.log('📁 Creating migrations directory...');
        fs.mkdirSync(this.migrationsPath, { recursive: true });
        return [];
      }

      const files = fs.readdirSync(this.migrationsPath)
        .filter(file => file.endsWith('.sql'))
        .sort();
      
      return files.map(file => ({
        version: file.replace('.sql', ''),
        filename: file,
        path: path.join(this.migrationsPath, file)
      }));
    } catch (error) {
      console.error('❌ Failed to read migration files:', error);
      throw error;
    }
  }

  async executeMigration(migration) {
    try {
      console.log(`🔄 Executing migration: ${migration.filename}`);
      
      const sql = fs.readFileSync(migration.path, 'utf8');
      
      // Begin transaction
      await this.client.query('BEGIN');
      
      try {
        // Execute migration SQL
        await this.client.query(sql);
        
        // Record migration as executed
        await this.client.query(
          'INSERT INTO schema_migrations (version, filename) VALUES ($1, $2)',
          [migration.version, migration.filename]
        );
        
        // Commit transaction
        await this.client.query('COMMIT');
        
        console.log(`✅ Migration completed: ${migration.filename}`);
      } catch (error) {
        // Rollback transaction on error
        await this.client.query('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error(`❌ Migration failed: ${migration.filename}`, error);
      throw error;
    }
  }

  async runMigrations() {
    try {
      console.log('🚀 Starting database migrations...');
      
      await this.connect();
      await this.createMigrationsTable();
      
      const executedMigrations = await this.getExecutedMigrations();
      const migrationFiles = await this.getMigrationFiles();
      
      console.log(`📊 Found ${migrationFiles.length} migration files`);
      console.log(`📊 ${executedMigrations.length} migrations already executed`);
      
      const pendingMigrations = migrationFiles.filter(
        migration => !executedMigrations.includes(migration.version)
      );
      
      if (pendingMigrations.length === 0) {
        console.log('✅ No pending migrations to execute');
        return;
      }
      
      console.log(`🔄 Executing ${pendingMigrations.length} pending migrations...`);
      
      for (const migration of pendingMigrations) {
        await this.executeMigration(migration);
      }
      
      console.log('🎉 All migrations completed successfully!');
      
    } catch (error) {
      console.error('❌ Migration process failed:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async rollback(version) {
    try {
      console.log(`🔄 Rolling back to version: ${version}`);
      
      await this.connect();
      
      // Get migrations to rollback (newer than specified version)
      const result = await this.client.query(
        'SELECT version, filename FROM schema_migrations WHERE version > $1 ORDER BY version DESC',
        [version]
      );
      
      if (result.rows.length === 0) {
        console.log('✅ No migrations to rollback');
        return;
      }
      
      console.log(`🔄 Rolling back ${result.rows.length} migrations...`);
      
      for (const row of result.rows) {
        console.log(`🔄 Rolling back: ${row.filename}`);
        
        // Remove from migrations table
        await this.client.query(
          'DELETE FROM schema_migrations WHERE version = $1',
          [row.version]
        );
        
        console.log(`✅ Rolled back: ${row.filename}`);
      }
      
      console.log('🎉 Rollback completed successfully!');
      
    } catch (error) {
      console.error('❌ Rollback failed:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async status() {
    try {
      await this.connect();
      await this.createMigrationsTable();
      
      const executedMigrations = await this.getExecutedMigrations();
      const migrationFiles = await this.getMigrationFiles();
      
      console.log('\n📊 Migration Status:');
      console.log('==================');
      
      if (migrationFiles.length === 0) {
        console.log('No migration files found');
        return;
      }
      
      for (const migration of migrationFiles) {
        const status = executedMigrations.includes(migration.version) ? '✅ Executed' : '⏳ Pending';
        console.log(`${status} - ${migration.filename}`);
      }
      
      const pendingCount = migrationFiles.length - executedMigrations.length;
      console.log(`\n📈 Summary: ${executedMigrations.length} executed, ${pendingCount} pending`);
      
    } catch (error) {
      console.error('❌ Failed to get migration status:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'migrate';
  
  const runner = new MigrationRunner();
  
  try {
    switch (command) {
      case 'migrate':
      case 'up':
        await runner.runMigrations();
        break;
        
      case 'rollback':
      case 'down':
        const version = args[1];
        if (!version) {
          console.error('❌ Please specify a version to rollback to');
          process.exit(1);
        }
        await runner.rollback(version);
        break;
        
      case 'status':
        await runner.status();
        break;
        
      default:
        console.log('Usage:');
        console.log('  node migrate.js migrate    - Run pending migrations');
        console.log('  node migrate.js rollback <version> - Rollback to version');
        console.log('  node migrate.js status     - Show migration status');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Migration command failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default MigrationRunner;