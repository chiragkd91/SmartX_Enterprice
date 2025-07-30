import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileUploadManager {
  constructor() {
    this.uploadDir = path.join(__dirname, 'uploads');
    this.maxFileSize = 10 * 1024 * 1024; // 10MB default
    this.allowedTypes = {
      images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      spreadsheets: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      archives: ['application/zip', 'application/x-rar-compressed'],
      text: ['text/plain', 'text/csv']
    };
    
    this.initializeUploadDirectory();
  }

  async initializeUploadDirectory() {
    try {
      await fs.access(this.uploadDir);
    } catch (error) {
      await fs.mkdir(this.uploadDir, { recursive: true });
      
      // Create subdirectories
      const subdirs = ['images', 'documents', 'temp', 'avatars', 'assets'];
      for (const subdir of subdirs) {
        await fs.mkdir(path.join(this.uploadDir, subdir), { recursive: true });
      }
    }
  }

  // Multer configuration for different upload types
  getMulterConfig(uploadType = 'general') {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        let uploadPath = this.uploadDir;
        
        switch (uploadType) {
          case 'avatar':
            uploadPath = path.join(this.uploadDir, 'avatars');
            break;
          case 'document':
            uploadPath = path.join(this.uploadDir, 'documents');
            break;
          case 'image':
            uploadPath = path.join(this.uploadDir, 'images');
            break;
          case 'asset':
            uploadPath = path.join(this.uploadDir, 'assets');
            break;
          default:
            uploadPath = path.join(this.uploadDir, 'temp');
        }
        
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
        cb(null, fileName);
      }
    });

    const fileFilter = (req, file, cb) => {
      const allowedMimes = this.getAllowedMimeTypes(uploadType);
      
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`File type ${file.mimetype} not allowed for ${uploadType} upload`), false);
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: this.getMaxFileSize(uploadType),
        files: this.getMaxFiles(uploadType)
      }
    });
  }

  getAllowedMimeTypes(uploadType) {
    switch (uploadType) {
      case 'avatar':
      case 'image':
        return this.allowedTypes.images;
      case 'document':
        return [...this.allowedTypes.documents, ...this.allowedTypes.spreadsheets, ...this.allowedTypes.text];
      case 'asset':
        return [...this.allowedTypes.images, ...this.allowedTypes.documents, ...this.allowedTypes.archives];
      default:
        return Object.values(this.allowedTypes).flat();
    }
  }

  getMaxFileSize(uploadType) {
    switch (uploadType) {
      case 'avatar':
        return 2 * 1024 * 1024; // 2MB
      case 'image':
        return 5 * 1024 * 1024; // 5MB
      case 'document':
        return 20 * 1024 * 1024; // 20MB
      case 'asset':
        return 50 * 1024 * 1024; // 50MB
      default:
        return this.maxFileSize;
    }
  }

  getMaxFiles(uploadType) {
    switch (uploadType) {
      case 'avatar':
        return 1;
      case 'bulk':
        return 10;
      default:
        return 5;
    }
  }

  // File processing and validation
  async processUploadedFile(file, options = {}) {
    try {
      const fileInfo = {
        id: uuidv4(),
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: new Date().toISOString(),
        checksum: await this.calculateChecksum(file.path),
        metadata: {}
      };

      // Extract metadata based on file type
      if (file.mimetype.startsWith('image/')) {
        fileInfo.metadata = await this.extractImageMetadata(file.path);
      }

      // Virus scan (placeholder - would integrate with actual antivirus)
      const scanResult = await this.scanFile(file.path);
      if (!scanResult.clean) {
        await this.deleteFile(file.path);
        throw new Error('File failed security scan');
      }

      // Save file record to database
      await this.saveFileRecord(fileInfo);

      return fileInfo;

    } catch (error) {
      // Clean up file on error
      if (file.path) {
        try {
          await this.deleteFile(file.path);
        } catch (cleanupError) {
          console.error('Failed to cleanup file:', cleanupError);
        }
      }
      throw error;
    }
  }

  async calculateChecksum(filePath) {
    const hash = crypto.createHash('sha256');
    const fileBuffer = await fs.readFile(filePath);
    hash.update(fileBuffer);
    return hash.digest('hex');
  }

  async extractImageMetadata(filePath) {
    try {
      const stats = await fs.stat(filePath);
      // Basic metadata - would use a library like 'sharp' for more details
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    } catch (error) {
      return {};
    }
  }

  async scanFile(filePath) {
    // Placeholder for virus scanning
    // In production, integrate with ClamAV or similar
    try {
      const stats = await fs.stat(filePath);
      
      // Basic checks
      if (stats.size === 0) {
        return { clean: false, reason: 'Empty file' };
      }
      
      if (stats.size > 100 * 1024 * 1024) { // 100MB
        return { clean: false, reason: 'File too large' };
      }
      
      return { clean: true };
    } catch (error) {
      return { clean: false, reason: error.message };
    }
  }

  async saveFileRecord(fileInfo) {
    try {
      const uploadsFile = path.join(__dirname, 'data', 'uploads.json');
      
      let uploads = [];
      try {
        const data = await fs.readFile(uploadsFile, 'utf8');
        uploads = JSON.parse(data);
      } catch (error) {
        // File doesn't exist, start with empty array
      }
      
      uploads.push(fileInfo);
      
      await fs.writeFile(uploadsFile, JSON.stringify(uploads, null, 2));
      
    } catch (error) {
      console.error('Failed to save file record:', error);
      throw error;
    }
  }

  async getFileRecord(fileId) {
    try {
      const uploadsFile = path.join(__dirname, 'data', 'uploads.json');
      const data = await fs.readFile(uploadsFile, 'utf8');
      const uploads = JSON.parse(data);
      
      return uploads.find(upload => upload.id === fileId);
    } catch (error) {
      return null;
    }
  }

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }

  async deleteUpload(fileId) {
    try {
      const fileRecord = await this.getFileRecord(fileId);
      if (!fileRecord) {
        throw new Error('File not found');
      }

      // Delete physical file
      await this.deleteFile(fileRecord.path);

      // Remove from database
      const uploadsFile = path.join(__dirname, 'data', 'uploads.json');
      const data = await fs.readFile(uploadsFile, 'utf8');
      const uploads = JSON.parse(data);
      
      const filteredUploads = uploads.filter(upload => upload.id !== fileId);
      await fs.writeFile(uploadsFile, JSON.stringify(filteredUploads, null, 2));

      return true;
    } catch (error) {
      console.error('Failed to delete upload:', error);
      throw error;
    }
  }

  // Cloud storage integration (AWS S3, Google Cloud, etc.)
  async uploadToCloud(filePath, options = {}) {
    // Placeholder for cloud storage integration
    // Would implement AWS S3, Google Cloud Storage, or Azure Blob Storage
    
    try {
      const cloudConfig = process.env.CLOUD_STORAGE_CONFIG ? JSON.parse(process.env.CLOUD_STORAGE_CONFIG) : null;
      
      if (!cloudConfig) {
        console.log('No cloud storage configured, keeping local file');
        return { success: false, reason: 'No cloud storage configured' };
      }

      // Example implementation would go here
      console.log(`Would upload ${filePath} to cloud storage`);
      
      return {
        success: true,
        cloudUrl: `https://example-bucket.s3.amazonaws.com/${path.basename(filePath)}`,
        provider: cloudConfig.provider
      };
      
    } catch (error) {
      console.error('Cloud upload failed:', error);
      return { success: false, reason: error.message };
    }
  }

  // File serving with access control
  async serveFile(fileId, userId, res) {
    try {
      const fileRecord = await this.getFileRecord(fileId);
      if (!fileRecord) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Check access permissions (implement based on your auth system)
      const hasAccess = await this.checkFileAccess(fileId, userId);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Check if file exists
      try {
        await fs.access(fileRecord.path);
      } catch (error) {
        return res.status(404).json({ error: 'File not found on disk' });
      }

      // Set appropriate headers
      res.setHeader('Content-Type', fileRecord.mimetype);
      res.setHeader('Content-Disposition', `inline; filename="${fileRecord.originalName}"`);
      res.setHeader('Cache-Control', 'private, max-age=3600');

      // Stream file
      const fileStream = require('fs').createReadStream(fileRecord.path);
      fileStream.pipe(res);

    } catch (error) {
      console.error('File serving error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async checkFileAccess(fileId, userId) {
    // Implement access control logic based on your requirements
    // For now, allow access to all authenticated users
    return userId ? true : false;
  }

  // Cleanup old temporary files
  async cleanupTempFiles(maxAge = 24 * 60 * 60 * 1000) { // 24 hours
    try {
      const tempDir = path.join(this.uploadDir, 'temp');
      const files = await fs.readdir(tempDir);
      
      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = await fs.stat(filePath);
        
        if (Date.now() - stats.mtime.getTime() > maxAge) {
          await this.deleteFile(filePath);
          console.log(`Cleaned up temp file: ${file}`);
        }
      }
      
    } catch (error) {
      console.error('Temp file cleanup failed:', error);
    }
  }

  // Get upload statistics
  async getUploadStats() {
    try {
      const uploadsFile = path.join(__dirname, 'data', 'uploads.json');
      const data = await fs.readFile(uploadsFile, 'utf8');
      const uploads = JSON.parse(data);
      
      const stats = {
        totalFiles: uploads.length,
        totalSize: uploads.reduce((sum, upload) => sum + upload.size, 0),
        byType: {},
        byDate: {}
      };
      
      uploads.forEach(upload => {
        // By type
        const type = upload.mimetype.split('/')[0];
        stats.byType[type] = (stats.byType[type] || 0) + 1;
        
        // By date
        const date = upload.uploadedAt.split('T')[0];
        stats.byDate[date] = (stats.byDate[date] || 0) + 1;
      });
      
      return stats;
      
    } catch (error) {
      return {
        totalFiles: 0,
        totalSize: 0,
        byType: {},
        byDate: {}
      };
    }
  }
}

export default FileUploadManager;