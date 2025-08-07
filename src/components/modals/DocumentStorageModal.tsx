/**
 * Document Storage Modal
 * Professional UI for storing and managing signed documents in the system
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  FileText,
  Upload,
  Download,
  Save,
  Eye,
  CheckCircle,
  Clock,
  Shield,
  Database,
  Folder,
  Archive,
  Tag,
  Calendar,
  User,
  Building,
  Search,
  Filter,
  AlertCircle,
  Trash2,
  Copy
} from 'lucide-react';

interface DocumentStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  employeeId: string;
  documents: any[];
  onComplete: (storageData: any) => void;
}

interface StorageDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'pending' | 'stored' | 'archived' | 'verified';
  category: string;
  tags: string[];
  uploadedAt: string;
  storedAt?: string;
  version: number;
  retention: string;
  accessLevel: string;
  checksum: string;
}

interface StorageConfig {
  location: 'local' | 'cloud' | 'hybrid';
  encryption: boolean;
  backup: boolean;
  retention: string;
  accessLevel: string;
  notifications: boolean;
  audit: boolean;
}

export default function DocumentStorageModal({
  isOpen,
  onClose,
  employeeName,
  employeeId,
  documents,
  onComplete
}: DocumentStorageModalProps) {
  const [activeTab, setActiveTab] = useState('documents');
  const [storageDocuments, setStorageDocuments] = useState<StorageDocument[]>([
    {
      id: '1',
      name: 'Signed_Offer_Letter.pdf',
      type: 'PDF',
      size: '2.4 MB',
      status: 'pending',
      category: 'Employment',
      tags: ['offer', 'signed', 'official'],
      uploadedAt: new Date().toISOString(),
      version: 1,
      retention: '7 years',
      accessLevel: 'Confidential',
      checksum: 'SHA-256: abc123...'
    },
    {
      id: '2',
      name: 'Employment_Contract.pdf',
      type: 'PDF',
      size: '1.8 MB',
      status: 'pending',
      category: 'Legal',
      tags: ['contract', 'employment', 'legal'],
      uploadedAt: new Date().toISOString(),
      version: 1,
      retention: '10 years',
      accessLevel: 'Restricted',
      checksum: 'SHA-256: def456...'
    },
    {
      id: '3',
      name: 'NDA_Agreement.pdf',
      type: 'PDF',
      size: '1.2 MB',
      status: 'stored',
      category: 'Legal',
      tags: ['nda', 'confidentiality', 'signed'],
      uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      storedAt: new Date().toISOString(),
      version: 1,
      retention: '5 years',
      accessLevel: 'Confidential',
      checksum: 'SHA-256: ghi789...'
    }
  ]);

  const [storageConfig, setStorageConfig] = useState<StorageConfig>({
    location: 'hybrid',
    encryption: true,
    backup: true,
    retention: 'auto',
    accessLevel: 'role-based',
    notifications: true,
    audit: true
  });

  const [isStoring, setIsStoring] = useState(false);
  const [storageProgress, setStorageProgress] = useState(0);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stored': return 'bg-green-100 text-green-800 border-green-200';
      case 'archived': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'verified': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-orange-100 text-orange-600 border-orange-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'stored': return <Database className="h-4 w-4" />;
      case 'archived': return <Archive className="h-4 w-4" />;
      case 'verified': return <Shield className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleStoreDocuments = async () => {
    if (selectedDocuments.length === 0) {
      alert('Please select at least one document to store');
      return;
    }

    setIsStoring(true);
    setStorageProgress(0);

    // Simulate storage process
    const interval = setInterval(() => {
      setStorageProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Update document statuses
          setStorageDocuments(prevDocs => 
            prevDocs.map(doc => 
              selectedDocuments.includes(doc.id)
                ? { ...doc, status: 'stored', storedAt: new Date().toISOString() }
                : doc
            )
          );
          
          setIsStoring(false);
          setSelectedDocuments([]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleArchiveDocument = (docId: string) => {
    setStorageDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? { ...doc, status: 'archived' }
          : doc
      )
    );
  };

  const handleVerifyDocument = (docId: string) => {
    setStorageDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? { ...doc, status: 'verified' }
          : doc
      )
    );
  };

  const handleComplete = () => {
    onComplete({
      employeeName,
      employeeId,
      documents: storageDocuments,
      config: storageConfig,
      completedAt: new Date().toISOString(),
      storageId: `STORE-${employeeId}-${Date.now()}`
    });
    onClose();
  };

  const storedCount = storageDocuments.filter(doc => doc.status === 'stored' || doc.status === 'verified').length;
  const totalCount = storageDocuments.length;
  const completionPercentage = Math.round((storedCount / totalCount) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Document Storage System - {employeeName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Storage Overview */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">{storedCount}/{totalCount}</p>
                    <p className="text-xs text-gray-600">Documents Stored</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold">Encrypted</p>
                    <p className="text-xs text-gray-600">AES-256 Security</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Archive className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-semibold">Auto Backup</p>
                    <p className="text-xs text-gray-600">Cloud + Local</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-semibold">Retention</p>
                    <p className="text-xs text-gray-600">Policy Compliant</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="storage">Storage Config</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>

            {/* Documents Management */}
            <TabsContent value="documents" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    onClick={handleStoreDocuments}
                    disabled={isStoring || selectedDocuments.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isStoring ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Storing...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Store Selected ({selectedDocuments.length})
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Badge variant="secondary">
                  {completionPercentage}% Complete
                </Badge>
              </div>

              {isStoring && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-blue-900">Storing Documents...</span>
                      <span className="text-blue-700">{storageProgress}%</span>
                    </div>
                    <Progress value={storageProgress} className="h-2" />
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {storageDocuments.map((document) => (
                  <Card key={document.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedDocuments.includes(document.id)}
                            onChange={() => handleDocumentSelect(document.id)}
                            disabled={document.status === 'stored' || document.status === 'verified'}
                            className="w-4 h-4 text-blue-600"
                          />
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <h4 className="font-semibold">{document.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(document.status)}>
                                {getStatusIcon(document.status)}
                                <span className="ml-1 capitalize">{document.status}</span>
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {document.type} • {document.size}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                v{document.version}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {document.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  <Tag className="h-2 w-2 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          
                          {document.status === 'stored' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleVerifyDocument(document.id)}
                              >
                                <Shield className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleArchiveDocument(document.id)}
                              >
                                <Archive className="h-4 w-4 mr-1" />
                                Archive
                              </Button>
                            </>
                          )}

                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <div>
                          <span className="font-medium">Category:</span> {document.category}
                        </div>
                        <div>
                          <span className="font-medium">Access:</span> {document.accessLevel}
                        </div>
                        <div>
                          <span className="font-medium">Retention:</span> {document.retention}
                        </div>
                        <div>
                          <span className="font-medium">Uploaded:</span> {new Date(document.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>

                      {document.storedAt && (
                        <div className="mt-2 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                          Stored: {new Date(document.storedAt).toLocaleString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Storage Configuration */}
            <TabsContent value="storage" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Storage Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Primary Storage</Label>
                      <Select value={storageConfig.location} onValueChange={(value: any) => setStorageConfig(prev => ({...prev, location: value}))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local Server</SelectItem>
                          <SelectItem value="cloud">Cloud Storage</SelectItem>
                          <SelectItem value="hybrid">Hybrid (Recommended)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Retention Policy</Label>
                      <Select value={storageConfig.retention} onValueChange={(value) => setStorageConfig(prev => ({...prev, retention: value}))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto (Based on Document Type)</SelectItem>
                          <SelectItem value="5-years">5 Years</SelectItem>
                          <SelectItem value="7-years">7 Years</SelectItem>
                          <SelectItem value="10-years">10 Years</SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Encryption (AES-256)</Label>
                      <input
                        type="checkbox"
                        checked={storageConfig.encryption}
                        onChange={(e) => setStorageConfig(prev => ({...prev, encryption: e.target.checked}))}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Automatic Backup</Label>
                      <input
                        type="checkbox"
                        checked={storageConfig.backup}
                        onChange={(e) => setStorageConfig(prev => ({...prev, backup: e.target.checked}))}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Audit Logging</Label>
                      <input
                        type="checkbox"
                        checked={storageConfig.audit}
                        onChange={(e) => setStorageConfig(prev => ({...prev, audit: e.target.checked}))}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Current Configuration</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Storage:</span> {storageConfig.location}
                    </div>
                    <div>
                      <span className="font-medium">Encryption:</span> {storageConfig.encryption ? 'Enabled' : 'Disabled'}
                    </div>
                    <div>
                      <span className="font-medium">Backup:</span> {storageConfig.backup ? 'Enabled' : 'Disabled'}
                    </div>
                    <div>
                      <span className="font-medium">Retention:</span> {storageConfig.retention}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security & Compliance */}
            <TabsContent value="security" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Security Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: 'End-to-End Encryption', status: 'Enabled', color: 'text-green-600' },
                      { label: 'Digital Signatures', status: 'Verified', color: 'text-green-600' },
                      { label: 'Access Control', status: 'Role-Based', color: 'text-blue-600' },
                      { label: 'Audit Trail', status: 'Complete', color: 'text-purple-600' },
                      { label: 'Backup System', status: 'Active', color: 'text-green-600' }
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{item.label}</span>
                        <Badge variant="outline" className={item.color}>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      Compliance Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: 'GDPR Compliance', status: 'Compliant', color: 'text-green-600' },
                      { label: 'SOC 2 Type II', status: 'Certified', color: 'text-green-600' },
                      { label: 'ISO 27001', status: 'Compliant', color: 'text-green-600' },
                      { label: 'Data Retention', status: 'Policy Applied', color: 'text-blue-600' },
                      { label: 'Access Logs', status: 'Maintained', color: 'text-purple-600' }
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{item.label}</span>
                        <Badge variant="outline" className={item.color}>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Audit Trail */}
            <TabsContent value="audit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Document Activity Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        time: new Date().toISOString(),
                        action: 'Document uploaded',
                        user: 'HR System',
                        document: 'Signed_Offer_Letter.pdf',
                        details: 'File uploaded for storage processing'
                      },
                      {
                        time: new Date(Date.now() - 3600000).toISOString(),
                        action: 'Security scan completed',
                        user: 'Security Service',
                        document: 'Employment_Contract.pdf',
                        details: 'Document passed all security checks'
                      },
                      {
                        time: new Date(Date.now() - 7200000).toISOString(),
                        action: 'Encryption applied',
                        user: 'Storage Service',
                        document: 'NDA_Agreement.pdf',
                        details: 'AES-256 encryption completed successfully'
                      }
                    ].map((log, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{log.action}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(log.time).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">{log.document}</span> • {log.user}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {log.details}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button
                onClick={handleComplete}
                disabled={completionPercentage < 100}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Storage Process
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
