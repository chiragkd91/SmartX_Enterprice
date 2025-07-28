/**
 * SmartBizFlow - File Management Service
 * Handles file uploads, storage, and document management
 */

interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface FileMetadata {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  tags?: string[];
  description?: string;
  isPublic?: boolean;
  expiresAt?: string;
}

interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class FileService {
  private baseUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

  // File upload with progress tracking
  async uploadFile(
    file: File,
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: FileUploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          };
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${this.baseUrl}/upload`);
      
      // Add authorization header if available
      const token = localStorage.getItem('authToken');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }

  // Multiple file upload
  async uploadMultipleFiles(
    files: File[],
    onProgress?: (fileIndex: number, progress: FileUploadProgress) => void
  ): Promise<FileUploadResponse[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadFile(file, (progress) => onProgress?.(index, progress))
    );

    return Promise.all(uploadPromises);
  }

  // Get file metadata
  async getFileMetadata(fileId: string): Promise<FileMetadata> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get file metadata');
    }

    return response.json();
  }

  // Download file
  async downloadFile(fileId: string, filename?: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Delete file
  async deleteFile(fileId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
  }

  // Update file metadata
  async updateFileMetadata(
    fileId: string,
    metadata: Partial<FileMetadata>
  ): Promise<FileMetadata> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(metadata)
    });

    if (!response.ok) {
      throw new Error('Failed to update file metadata');
    }

    return response.json();
  }

  // Search files
  async searchFiles(query: string, filters?: {
    mimeType?: string;
    uploadedBy?: string;
    dateFrom?: string;
    dateTo?: string;
    tags?: string[];
  }): Promise<FileMetadata[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters?.mimeType) params.append('mimeType', filters.mimeType);
    if (filters?.uploadedBy) params.append('uploadedBy', filters.uploadedBy);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.tags) params.append('tags', filters.tags.join(','));

    const response = await fetch(`${this.baseUrl}/files/search?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to search files');
    }

    return response.json();
  }

  // Get user's files
  async getUserFiles(userId?: string): Promise<FileMetadata[]> {
    const userIdParam = userId || 'me';
    const response = await fetch(`${this.baseUrl}/files/user/${userIdParam}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get user files');
    }

    return response.json();
  }

  // Share file
  async shareFile(
    fileId: string,
    shareWith: string[],
    permissions: 'read' | 'write' | 'admin' = 'read'
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        shareWith,
        permissions
      })
    });

    if (!response.ok) {
      throw new Error('Failed to share file');
    }
  }

  // Get shared files
  async getSharedFiles(): Promise<FileMetadata[]> {
    const response = await fetch(`${this.baseUrl}/files/shared`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get shared files');
    }

    return response.json();
  }

  // File preview
  async getFilePreview(fileId: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}/preview`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get file preview');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  // Validate file
  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ];

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size exceeds 10MB limit'
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not allowed'
      };
    }

    return { isValid: true };
  }

  // Get file icon based on MIME type
  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType === 'text/plain') return '📄';
    if (mimeType === 'text/csv') return '📊';
    return '📁';
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get file extension
  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  // Check if file is image
  isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  // Check if file is document
  isDocument(mimeType: string): boolean {
    return mimeType.includes('pdf') || 
           mimeType.includes('word') || 
           mimeType.includes('excel') ||
           mimeType.includes('text');
  }
}

// Create singleton instance
const fileService = new FileService();

export default fileService; 