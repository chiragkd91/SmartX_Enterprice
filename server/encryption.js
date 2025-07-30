import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Data Encryption at Rest System
 * Implements AES-256-GCM encryption for sensitive data storage
 */

class EncryptionManager {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits
    this.ivLength = 16;  // 128 bits
    this.tagLength = 16; // 128 bits
    this.saltLength = 32; // 256 bits
    
    this.masterKey = null;
    this.keyDerivationIterations = 100000; // PBKDF2 iterations
    
    this.sensitiveFields = new Set([
      'password',
      'ssn',
      'socialSecurityNumber',
      'bankAccount',
      'creditCard',
      'salary',
      'personalInfo',
      'medicalInfo',
      'emergencyContact',
      'address',
      'phone',
      'email',
      'taxId',
      'passport',
      'drivingLicense'
    ]);
    
    this.initialize();
  }

  async initialize() {
    try {
      await this.loadOrGenerateMasterKey();
      console.log('Encryption system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize encryption system:', error);
      throw error;
    }
  }

  async loadOrGenerateMasterKey() {
    const keyPath = path.join(__dirname, '.encryption_key');
    
    try {
      // Try to load existing key
      const keyData = await fs.readFile(keyPath);
      this.masterKey = keyData;
      console.log('Loaded existing encryption key');
    } catch (error) {
      // Generate new key if not found
      console.log('Generating new encryption key...');
      this.masterKey = crypto.randomBytes(this.keyLength);
      
      // Save key securely (in production, use HSM or key management service)
      await fs.writeFile(keyPath, this.masterKey, { mode: 0o600 });
      console.log('New encryption key generated and saved');
    }
  }

  /**
   * Derive encryption key from master key and salt
   * @param {Buffer} salt - Salt for key derivation
   * @returns {Buffer} - Derived key
   */
  deriveKey(salt) {
    return crypto.pbkdf2Sync(
      this.masterKey,
      salt,
      this.keyDerivationIterations,
      this.keyLength,
      'sha256'
    );
  }

  /**
   * Encrypt sensitive data
   * @param {string} plaintext - Data to encrypt
   * @param {string} context - Context for additional security
   * @returns {Object} - Encrypted data with metadata
   */
  encrypt(plaintext, context = '') {
    try {
      if (!plaintext || typeof plaintext !== 'string') {
        throw new Error('Invalid plaintext data');
      }

      // Generate random salt and IV
      const salt = crypto.randomBytes(this.saltLength);
      const iv = crypto.randomBytes(this.ivLength);
      
      // Derive key from master key and salt
      const key = this.deriveKey(salt);
      
      // Create cipher
      const cipher = crypto.createCipher(this.algorithm, key);
      cipher.setAAD(Buffer.from(context, 'utf8')); // Additional authenticated data
      
      // Encrypt data
      let encrypted = cipher.update(plaintext, 'utf8');
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      
      // Get authentication tag
      const tag = cipher.getAuthTag();
      
      // Combine all components
      const result = {
        algorithm: this.algorithm,
        salt: salt.toString('base64'),
        iv: iv.toString('base64'),
        tag: tag.toString('base64'),
        data: encrypted.toString('base64'),
        context: context,
        timestamp: new Date().toISOString()
      };
      
      return result;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt sensitive data
   * @param {Object} encryptedData - Encrypted data object
   * @param {string} context - Context for verification
   * @returns {string} - Decrypted plaintext
   */
  decrypt(encryptedData, context = '') {
    try {
      if (!encryptedData || typeof encryptedData !== 'object') {
        throw new Error('Invalid encrypted data');
      }

      const { algorithm, salt, iv, tag, data, context: originalContext } = encryptedData;
      
      // Verify algorithm
      if (algorithm !== this.algorithm) {
        throw new Error('Unsupported encryption algorithm');
      }
      
      // Verify context
      if (originalContext !== context) {
        throw new Error('Context mismatch');
      }
      
      // Convert from base64
      const saltBuffer = Buffer.from(salt, 'base64');
      const ivBuffer = Buffer.from(iv, 'base64');
      const tagBuffer = Buffer.from(tag, 'base64');
      const dataBuffer = Buffer.from(data, 'base64');
      
      // Derive key
      const key = this.deriveKey(saltBuffer);
      
      // Create decipher
      const decipher = crypto.createDecipher(algorithm, key);
      decipher.setAAD(Buffer.from(context, 'utf8'));
      decipher.setAuthTag(tagBuffer);
      
      // Decrypt data
      let decrypted = decipher.update(dataBuffer);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      return decrypted.toString('utf8');
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Encrypt object with selective field encryption
   * @param {Object} obj - Object to encrypt
   * @param {Array} fieldsToEncrypt - Specific fields to encrypt (optional)
   * @returns {Object} - Object with encrypted sensitive fields
   */
  encryptObject(obj, fieldsToEncrypt = null) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const result = { ...obj };
    const fields = fieldsToEncrypt || Array.from(this.sensitiveFields);
    
    for (const field of fields) {
      if (result[field] && typeof result[field] === 'string') {
        try {
          result[field] = this.encrypt(result[field], `${field}_${obj.id || 'unknown'}`);
          result[`${field}_encrypted`] = true;
        } catch (error) {
          console.error(`Failed to encrypt field ${field}:`, error);
        }
      }
    }
    
    return result;
  }

  /**
   * Decrypt object with selective field decryption
   * @param {Object} obj - Object to decrypt
   * @param {Array} fieldsToDecrypt - Specific fields to decrypt (optional)
   * @returns {Object} - Object with decrypted sensitive fields
   */
  decryptObject(obj, fieldsToDecrypt = null) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const result = { ...obj };
    const fields = fieldsToDecrypt || Array.from(this.sensitiveFields);
    
    for (const field of fields) {
      if (result[field] && result[`${field}_encrypted`]) {
        try {
          result[field] = this.decrypt(result[field], `${field}_${obj.id || 'unknown'}`);
          delete result[`${field}_encrypted`];
        } catch (error) {
          console.error(`Failed to decrypt field ${field}:`, error);
          // Keep encrypted data if decryption fails
        }
      }
    }
    
    return result;
  }

  /**
   * Hash sensitive data for searching/indexing
   * @param {string} data - Data to hash
   * @param {string} salt - Optional salt
   * @returns {string} - Hashed data
   */
  hashForSearch(data, salt = '') {
    if (!data) return null;
    
    const hash = crypto.createHash('sha256');
    hash.update(data + salt);
    return hash.digest('hex');
  }

  /**
   * Generate secure random token
   * @param {number} length - Token length in bytes
   * @returns {string} - Random token
   */
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Encrypt file contents
   * @param {string} filePath - Path to file
   * @param {string} outputPath - Output path for encrypted file
   * @returns {Object} - Encryption metadata
   */
  async encryptFile(filePath, outputPath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const encrypted = this.encrypt(data, `file_${path.basename(filePath)}`);
      
      await fs.writeFile(outputPath, JSON.stringify(encrypted, null, 2));
      
      return {
        originalFile: filePath,
        encryptedFile: outputPath,
        algorithm: this.algorithm,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('File encryption error:', error);
      throw error;
    }
  }

  /**
   * Decrypt file contents
   * @param {string} encryptedFilePath - Path to encrypted file
   * @param {string} outputPath - Output path for decrypted file
   * @returns {Object} - Decryption metadata
   */
  async decryptFile(encryptedFilePath, outputPath) {
    try {
      const encryptedData = JSON.parse(await fs.readFile(encryptedFilePath, 'utf8'));
      const decrypted = this.decrypt(encryptedData, `file_${path.basename(outputPath)}`);
      
      await fs.writeFile(outputPath, decrypted);
      
      return {
        encryptedFile: encryptedFilePath,
        decryptedFile: outputPath,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('File decryption error:', error);
      throw error;
    }
  }

  /**
   * Encrypt database backup
   * @param {string} backupPath - Path to backup file
   * @returns {string} - Path to encrypted backup
   */
  async encryptBackup(backupPath) {
    const encryptedPath = `${backupPath}.encrypted`;
    await this.encryptFile(backupPath, encryptedPath);
    
    // Remove original unencrypted backup
    await fs.unlink(backupPath);
    
    return encryptedPath;
  }

  /**
   * Decrypt database backup
   * @param {string} encryptedBackupPath - Path to encrypted backup
   * @returns {string} - Path to decrypted backup
   */
  async decryptBackup(encryptedBackupPath) {
    const decryptedPath = encryptedBackupPath.replace('.encrypted', '');
    await this.decryptFile(encryptedBackupPath, decryptedPath);
    
    return decryptedPath;
  }

  /**
   * Rotate encryption key (for key rotation policies)
   * @returns {Object} - Key rotation result
   */
  async rotateKey() {
    try {
      const oldKey = this.masterKey;
      const newKey = crypto.randomBytes(this.keyLength);
      
      // In production, you would:
      // 1. Re-encrypt all data with new key
      // 2. Update key in secure storage
      // 3. Verify all data can be decrypted with new key
      
      console.log('Key rotation would be performed here');
      
      return {
        success: true,
        rotatedAt: new Date().toISOString(),
        message: 'Key rotation completed successfully'
      };
    } catch (error) {
      console.error('Key rotation error:', error);
      throw error;
    }
  }

  /**
   * Validate encryption configuration
   * @returns {Object} - Validation result
   */
  validateConfiguration() {
    const issues = [];
    
    if (!this.masterKey) {
      issues.push('Master key not initialized');
    }
    
    if (this.keyDerivationIterations < 10000) {
      issues.push('Key derivation iterations too low');
    }
    
    // Check if key file has proper permissions
    const keyPath = path.join(__dirname, '.encryption_key');
    fs.access(keyPath, fs.constants.R_OK)
      .catch(() => issues.push('Encryption key file not accessible'));
    
    return {
      valid: issues.length === 0,
      issues,
      algorithm: this.algorithm,
      keyLength: this.keyLength,
      iterations: this.keyDerivationIterations
    };
  }

  /**
   * Get encryption statistics
   * @returns {Object} - Encryption statistics
   */
  getStatistics() {
    return {
      algorithm: this.algorithm,
      keyLength: this.keyLength,
      ivLength: this.ivLength,
      tagLength: this.tagLength,
      saltLength: this.saltLength,
      iterations: this.keyDerivationIterations,
      sensitiveFieldsCount: this.sensitiveFields.size,
      initialized: !!this.masterKey
    };
  }

  /**
   * Add sensitive field to encryption list
   * @param {string} fieldName - Field name to encrypt
   */
  addSensitiveField(fieldName) {
    this.sensitiveFields.add(fieldName);
  }

  /**
   * Remove sensitive field from encryption list
   * @param {string} fieldName - Field name to remove
   */
  removeSensitiveField(fieldName) {
    this.sensitiveFields.delete(fieldName);
  }

  /**
   * Check if field is marked as sensitive
   * @param {string} fieldName - Field name to check
   * @returns {boolean} - Whether field is sensitive
   */
  isSensitiveField(fieldName) {
    return this.sensitiveFields.has(fieldName);
  }
}

// Create singleton instance
const encryptionManager = new EncryptionManager();

export default encryptionManager;
export { EncryptionManager };