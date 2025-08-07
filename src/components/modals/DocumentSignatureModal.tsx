/**
 * Document Signature Modal
 * Professional UI for e-signature and document upload management
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
import {
  FileText,
  Upload,
  Download,
  Send,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Pen,
  Shield,
  Mail,
  Phone,
  User,
  Calendar,
  FileCheck,
  X,
  Plus,
  Trash2
} from 'lucide-react';

interface DocumentSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  employeeId: string;
  documentType: 'offer' | 'contract' | 'policy' | 'other';
  onComplete: (signatureData: any) => void;
}

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'signed' | 'uploaded' | 'verified';
  required: boolean;
  file?: File;
  signedAt?: string;
  verifiedAt?: string;
}

interface SignatureData {
  method: 'esign' | 'upload' | 'physical';
  documents: DocumentItem[];
  candidateEmail: string;
  candidatePhone: string;
  signatureDate: string;
  notificationSent: boolean;
  verificationNotes: string;
}

export default function DocumentSignatureModal({
  isOpen,
  onClose,
  employeeName,
  employeeId,
  documentType,
  onComplete
}: DocumentSignatureModalProps) {
  const [activeTab, setActiveTab] = useState('documents');
  const [signatureData, setSignatureData] = useState<SignatureData>({
    method: 'esign',
    documents: [
      {
        id: '1',
        name: 'Offer Letter',
        type: 'offer',
        status: 'pending',
        required: true
      },
      {
        id: '2',
        name: 'Employment Contract',
        type: 'contract',
        status: 'pending',
        required: true
      },
      {
        id: '3',
        name: 'NDA Agreement',
        type: 'nda',
        status: 'pending',
        required: false
      }
    ],
    candidateEmail: '',
    candidatePhone: '',
    signatureDate: '',
    notificationSent: false,
    verificationNotes: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800 border-green-200';
      case 'uploaded': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'verified': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="h-4 w-4" />;
      case 'uploaded': return <FileCheck className="h-4 w-4" />;
      case 'verified': return <Shield className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleFileUpload = (documentId: string, file: File) => {
    setSignatureData(prev => ({
      ...prev,
      documents: prev.documents.map(doc =>
        doc.id === documentId
          ? { ...doc, file, status: 'uploaded', signedAt: new Date().toISOString() }
          : doc
      )
    }));

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleSignDocument = (documentId: string) => {
    setSignatureData(prev => ({
      ...prev,
      documents: prev.documents.map(doc =>
        doc.id === documentId
          ? { ...doc, status: 'signed', signedAt: new Date().toISOString() }
          : doc
      )
    }));
  };

  const handleVerifyDocument = (documentId: string) => {
    setSignatureData(prev => ({
      ...prev,
      documents: prev.documents.map(doc =>
        doc.id === documentId
          ? { ...doc, status: 'verified', verifiedAt: new Date().toISOString() }
          : doc
      )
    }));
  };

  const handleSendForSignature = async () => {
    setIsProcessing(true);
    
    // Simulate sending process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSignatureData(prev => ({
      ...prev,
      notificationSent: true,
      signatureDate: new Date().toISOString()
    }));
    
    setIsProcessing(false);
    alert(`E-signature request sent to ${employeeName}\n\nEmail: ${signatureData.candidateEmail}\nSMS: ${signatureData.candidatePhone}\n\nCandidate will receive secure links to sign all documents.`);
  };

  const handleComplete = () => {
    onComplete({
      ...signatureData,
      employeeName,
      employeeId,
      completedAt: new Date().toISOString(),
      completionId: `DOC-${employeeId}-${Date.now()}`
    });
    onClose();
  };

  const completedDocuments = signatureData.documents.filter(doc => 
    doc.status === 'signed' || doc.status === 'uploaded' || doc.status === 'verified'
  ).length;
  const totalDocuments = signatureData.documents.filter(doc => doc.required).length;
  const completionPercentage = Math.round((completedDocuments / totalDocuments) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pen className="h-5 w-5 text-blue-600" />
            Document Signature & Upload - {employeeName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Overview */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-900">Completion Progress</h3>
                <Badge variant="secondary">{completedDocuments}/{totalDocuments} Documents</Badge>
              </div>
              <Progress value={completionPercentage} className="h-2 mb-2" />
              <div className="flex justify-between text-sm text-blue-700">
                <span>Documents Completed</span>
                <span>{completionPercentage}%</span>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="method">Method</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="verify">Verify</TabsTrigger>
            </TabsList>

            {/* Document Management */}
            <TabsContent value="documents" className="space-y-4">
              <div className="space-y-3">
                {signatureData.documents.map((document) => (
                  <Card key={document.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <h4 className="font-semibold">{document.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(document.status)}>
                                {getStatusIcon(document.status)}
                                <span className="ml-1 capitalize">{document.status}</span>
                              </Badge>
                              {document.required && (
                                <Badge variant="destructive" className="text-xs">Required</Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {document.status === 'pending' && (
                            <>
                              <input
                                type="file"
                                id={`upload-${document.id}`}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(document.id, file);
                                }}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => document.getElementById(`upload-${document.id}`)?.click()}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Upload
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSignDocument(document.id)}
                              >
                                <Pen className="h-4 w-4 mr-1" />
                                E-Sign
                              </Button>
                            </>
                          )}

                          {(document.status === 'uploaded' || document.status === 'signed') && (
                            <>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleVerifyDocument(document.id)}
                                disabled={document.status === 'verified'}
                              >
                                <Shield className="h-4 w-4 mr-1" />
                                {document.status === 'verified' ? 'Verified' : 'Verify'}
                              </Button>
                            </>
                          )}

                          {document.status === 'verified' && (
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>

                      {document.signedAt && (
                        <div className="mt-2 text-sm text-gray-600">
                          Signed: {new Date(document.signedAt).toLocaleString()}
                        </div>
                      )}

                      {uploadProgress > 0 && uploadProgress < 100 && document.status === 'uploaded' && (
                        <div className="mt-2">
                          <Progress value={uploadProgress} className="h-1" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Signature Method */}
            <TabsContent value="method" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card 
                  className={`cursor-pointer transition-all ${
                    signatureData.method === 'esign' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSignatureData(prev => ({ ...prev, method: 'esign' }))}
                >
                  <CardContent className="p-4 text-center">
                    <Pen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">E-Signature</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Digital signature via secure link
                    </p>
                    {signatureData.method === 'esign' && (
                      <CheckCircle className="h-5 w-5 text-blue-600 mx-auto mt-2" />
                    )}
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${
                    signatureData.method === 'upload' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSignatureData(prev => ({ ...prev, method: 'upload' }))}
                >
                  <CardContent className="p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold">File Upload</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Upload signed documents
                    </p>
                    {signatureData.method === 'upload' && (
                      <CheckCircle className="h-5 w-5 text-blue-600 mx-auto mt-2" />
                    )}
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${
                    signatureData.method === 'physical' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSignatureData(prev => ({ ...prev, method: 'physical' }))}
                >
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <h3 className="font-semibold">Physical Copy</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Print and sign physically
                    </p>
                    {signatureData.method === 'physical' && (
                      <CheckCircle className="h-5 w-5 text-blue-600 mx-auto mt-2" />
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Selected Method: {signatureData.method.toUpperCase()}</h4>
                  <div className="text-sm text-gray-600">
                    {signatureData.method === 'esign' && (
                      <p>Documents will be sent via secure email link for digital signature. Candidate will receive SMS notification.</p>
                    )}
                    {signatureData.method === 'upload' && (
                      <p>Candidate can upload pre-signed documents. All uploads will be verified by HR team.</p>
                    )}
                    {signatureData.method === 'physical' && (
                      <p>Documents will be printed and sent for physical signature. Signed copies need to be scanned and uploaded.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Information */}
            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="candidateEmail" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Candidate Email *
                  </Label>
                  <Input
                    id="candidateEmail"
                    type="email"
                    placeholder="candidate@example.com"
                    value={signatureData.candidateEmail}
                    onChange={(e) => setSignatureData(prev => ({ ...prev, candidateEmail: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    E-signature link will be sent to this email
                  </p>
                </div>

                <div>
                  <Label htmlFor="candidatePhone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Candidate Phone *
                  </Label>
                  <Input
                    id="candidatePhone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={signatureData.candidatePhone}
                    onChange={(e) => setSignatureData(prev => ({ ...prev, candidatePhone: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    SMS notification will be sent to this number
                  </p>
                </div>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Notification Preview</h4>
                  <div className="bg-gray-50 p-3 rounded border text-sm">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Email Notification</span>
                    </div>
                    <p>
                      <strong>Subject:</strong> Document Signature Required - {employeeName}
                    </p>
                    <p>
                      <strong>To:</strong> {signatureData.candidateEmail || 'candidate@example.com'}
                    </p>
                    <p className="text-gray-600 mt-1">
                      "Please click the secure link to review and sign your employment documents..."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Verification & Notes */}
            <TabsContent value="verify" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="verificationNotes">Verification Notes</Label>
                  <Textarea
                    id="verificationNotes"
                    placeholder="Add any verification notes, special instructions, or observations..."
                    rows={4}
                    value={signatureData.verificationNotes}
                    onChange={(e) => setSignatureData(prev => ({ ...prev, verificationNotes: e.target.value }))}
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Document Verification Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        'All required documents are signed/uploaded',
                        'Signatures match candidate identity',
                        'Document dates are correct',
                        'All terms and conditions are acknowledged',
                        'Contact information is verified'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {signatureData.notificationSent && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Notification Sent Successfully!</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">
                        Signature request sent on {new Date(signatureData.signatureDate).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            <div className="flex gap-2">
              {signatureData.method === 'esign' && !signatureData.notificationSent && (
                <Button
                  onClick={handleSendForSignature}
                  disabled={isProcessing || !signatureData.candidateEmail || !signatureData.candidatePhone}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send for Signature
                    </>
                  )}
                </Button>
              )}
              
              <Button
                onClick={handleComplete}
                disabled={completionPercentage < 100}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Process
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
