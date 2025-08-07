/**
 * Offer Letter Generation Modal
 * Professional UI for generating and customizing offer letters
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  FileText,
  Download,
  Send,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface OfferLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  employeeId: string;
  department: string;
  position: string;
  onGenerate: (offerData: any) => void;
}

interface OfferLetterData {
  template: string;
  salary: string;
  joiningDate: string;
  workLocation: string;
  reportingManager: string;
  probationPeriod: string;
  benefits: string[];
  specialTerms: string;
  validUntil: string;
}

export default function OfferLetterModal({
  isOpen,
  onClose,
  employeeName,
  employeeId,
  department,
  position,
  onGenerate
}: OfferLetterModalProps) {
  const [activeTab, setActiveTab] = useState('template');
  const [offerData, setOfferData] = useState<OfferLetterData>({
    template: 'standard',
    salary: '',
    joiningDate: '',
    workLocation: 'Mumbai Office',
    reportingManager: '',
    probationPeriod: '6',
    benefits: [],
    specialTerms: '',
    validUntil: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const templates = [
    {
      id: 'standard',
      name: 'Standard Offer Letter',
      description: 'Standard template for regular positions',
      category: 'General'
    },
    {
      id: 'senior',
      name: 'Senior Position Offer',
      description: 'Template for senior management positions',
      category: 'Management'
    },
    {
      id: 'intern',
      name: 'Internship Offer',
      description: 'Template for internship positions',
      category: 'Internship'
    },
    {
      id: 'contract',
      name: 'Contract Position',
      description: 'Template for contract-based positions',
      category: 'Contract'
    }
  ];

  const benefitOptions = [
    'Health Insurance',
    'Life Insurance',
    'Provident Fund',
    'Gratuity',
    'Flexible Working Hours',
    'Work from Home',
    'Meal Allowance',
    'Transport Allowance',
    'Mobile Allowance',
    'Learning & Development Budget',
    'Annual Bonus',
    'Performance Bonus'
  ];

  const handleBenefitToggle = (benefit: string) => {
    setOfferData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedOffer = {
      ...offerData,
      employeeName,
      employeeId,
      department,
      position,
      generatedAt: new Date().toISOString(),
      documentId: `OL-${employeeId}-${Date.now()}`
    };
    
    onGenerate(generatedOffer);
    setIsGenerating(false);
    setShowPreview(true);
  };

  const handleSendOffer = () => {
    alert(`Offer letter sent to candidate via email and SMS.\n\nDocument ID: OL-${employeeId}-${Date.now()}\nValid until: ${offerData.validUntil}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Generate Offer Letter - {employeeName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Info Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{employeeName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-blue-600" />
                  <span>{department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>{position}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{employeeId}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="template">Template</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>

            {/* Template Selection */}
            <TabsContent value="template" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      offerData.template === template.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setOfferData(prev => ({ ...prev, template: template.id }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      {offerData.template === template.id && (
                        <div className="mt-2 flex items-center gap-1 text-blue-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs">Selected</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Offer Details */}
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="salary" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Annual Salary (CTC) *
                    </Label>
                    <Input
                      id="salary"
                      placeholder="e.g., 12,00,000"
                      value={offerData.salary}
                      onChange={(e) => setOfferData(prev => ({ ...prev, salary: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="joiningDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Joining Date *
                    </Label>
                    <Input
                      id="joiningDate"
                      type="date"
                      value={offerData.joiningDate}
                      onChange={(e) => setOfferData(prev => ({ ...prev, joiningDate: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="workLocation" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Work Location
                    </Label>
                    <Select value={offerData.workLocation} onValueChange={(value) => setOfferData(prev => ({ ...prev, workLocation: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mumbai Office">Mumbai Office</SelectItem>
                        <SelectItem value="Delhi Office">Delhi Office</SelectItem>
                        <SelectItem value="Bangalore Office">Bangalore Office</SelectItem>
                        <SelectItem value="Pune Office">Pune Office</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reportingManager" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Reporting Manager *
                    </Label>
                    <Input
                      id="reportingManager"
                      placeholder="Manager name"
                      value={offerData.reportingManager}
                      onChange={(e) => setOfferData(prev => ({ ...prev, reportingManager: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="probationPeriod" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Probation Period (months)
                    </Label>
                    <Select value={offerData.probationPeriod} onValueChange={(value) => setOfferData(prev => ({ ...prev, probationPeriod: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="validUntil" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Offer Valid Until *
                    </Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={offerData.validUntil}
                      onChange={(e) => setOfferData(prev => ({ ...prev, validUntil: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="specialTerms">Special Terms & Conditions</Label>
                <Textarea
                  id="specialTerms"
                  placeholder="Any additional terms, conditions, or notes..."
                  rows={3}
                  value={offerData.specialTerms}
                  onChange={(e) => setOfferData(prev => ({ ...prev, specialTerms: e.target.value }))}
                />
              </div>
            </TabsContent>

            {/* Benefits Selection */}
            <TabsContent value="benefits" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-4">Select Benefits & Perks</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {benefitOptions.map((benefit) => (
                    <div
                      key={benefit}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        offerData.benefits.includes(benefit)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleBenefitToggle(benefit)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          offerData.benefits.includes(benefit)
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {offerData.benefits.includes(benefit) && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{benefit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Review & Generate */}
            <TabsContent value="review" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Offer Letter Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">CANDIDATE DETAILS</h4>
                      <div className="space-y-1 mt-2">
                        <p><strong>Name:</strong> {employeeName}</p>
                        <p><strong>Position:</strong> {position}</p>
                        <p><strong>Department:</strong> {department}</p>
                        <p><strong>Employee ID:</strong> {employeeId}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">OFFER DETAILS</h4>
                      <div className="space-y-1 mt-2">
                        <p><strong>Salary:</strong> ₹{offerData.salary}</p>
                        <p><strong>Joining Date:</strong> {offerData.joiningDate}</p>
                        <p><strong>Location:</strong> {offerData.workLocation}</p>
                        <p><strong>Reporting Manager:</strong> {offerData.reportingManager}</p>
                      </div>
                    </div>
                  </div>

                  {offerData.benefits.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">BENEFITS & PERKS</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {offerData.benefits.map((benefit) => (
                          <Badge key={benefit} variant="secondary">{benefit}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {showPreview && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Offer Letter Generated Successfully!</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Document ID: OL-{employeeId}-{Date.now()}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            <div className="flex gap-2">
              {!showPreview ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('review')}
                    disabled={!offerData.salary || !offerData.joiningDate}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !offerData.salary || !offerData.joiningDate}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Offer
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button onClick={handleSendOffer} className="bg-green-600 hover:bg-green-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send to Candidate
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
