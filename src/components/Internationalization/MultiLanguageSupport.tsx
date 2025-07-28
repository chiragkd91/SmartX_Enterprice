import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, MessageSquare, CheckCircle, AlertTriangle, 
  Settings, RefreshCw, Plus, Eye, Zap, Shield, Database, 
  FileText, Users, Clock, DollarSign, TrendingUp, 
  MessageCircle, Download, Upload
} from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  status: 'active' | 'inactive' | 'beta' | 'maintenance';
  completion: number;
  lastUpdated: Date;
  translator: string;
  region: string;
  direction: 'ltr' | 'rtl';
}

interface Translation {
  id: string;
  key: string;
  language: string;
  originalText: string;
  translatedText: string;
  status: 'translated' | 'pending' | 'review' | 'approved';
  translator: string;
  lastModified: Date;
  context: string;
  category: string;
}

interface LanguageMetrics {
  totalLanguages: number;
  activeLanguages: number;
  totalTranslations: number;
  pendingTranslations: number;
  completionRate: number;
  lastSync: Date;
}

const MultiLanguageSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState('languages');
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [metrics, setMetrics] = useState<LanguageMetrics>({
    totalLanguages: 0,
    activeLanguages: 0,
    totalTranslations: 0,
    pendingTranslations: 0,
    completionRate: 0,
    lastSync: new Date()
  });

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLanguages([
        {
          code: 'en',
          name: 'English',
          nativeName: 'English',
          flag: '🇺🇸',
          status: 'active',
          completion: 100,
          lastUpdated: new Date('2024-01-20T10:30:00'),
          translator: 'System',
          region: 'Global',
          direction: 'ltr'
        },
        {
          code: 'es',
          name: 'Spanish',
          nativeName: 'Español',
          flag: '🇪🇸',
          status: 'active',
          completion: 95,
          lastUpdated: new Date('2024-01-20T09:15:00'),
          translator: 'Maria Garcia',
          region: 'Spain',
          direction: 'ltr'
        },
        {
          code: 'fr',
          name: 'French',
          nativeName: 'Français',
          flag: '🇫🇷',
          status: 'active',
          completion: 88,
          lastUpdated: new Date('2024-01-19T16:45:00'),
          translator: 'Jean Dubois',
          region: 'France',
          direction: 'ltr'
        },
        {
          code: 'de',
          name: 'German',
          nativeName: 'Deutsch',
          flag: '🇩🇪',
          status: 'active',
          completion: 82,
          lastUpdated: new Date('2024-01-19T14:30:00'),
          translator: 'Hans Mueller',
          region: 'Germany',
          direction: 'ltr'
        },
        {
          code: 'ar',
          name: 'Arabic',
          nativeName: 'العربية',
          flag: '🇸🇦',
          status: 'beta',
          completion: 65,
          lastUpdated: new Date('2024-01-18T12:20:00'),
          translator: 'Ahmed Al-Rashid',
          region: 'Saudi Arabia',
          direction: 'rtl'
        },
        {
          code: 'zh',
          name: 'Chinese',
          nativeName: '中文',
          flag: '🇨🇳',
          status: 'beta',
          completion: 58,
          lastUpdated: new Date('2024-01-18T10:15:00'),
          translator: 'Li Wei',
          region: 'China',
          direction: 'ltr'
        },
        {
          code: 'ja',
          name: 'Japanese',
          nativeName: '日本語',
          flag: '🇯🇵',
          status: 'inactive',
          completion: 35,
          lastUpdated: new Date('2024-01-17T08:45:00'),
          translator: 'Yuki Tanaka',
          region: 'Japan',
          direction: 'ltr'
        }
      ]);

      setTranslations([
        {
          id: 'trans-001',
          key: 'dashboard.title',
          language: 'es',
          originalText: 'Dashboard',
          translatedText: 'Panel de Control',
          status: 'approved',
          translator: 'Maria Garcia',
          lastModified: new Date('2024-01-20T09:15:00'),
          context: 'Main dashboard page title',
          category: 'Navigation'
        },
        {
          id: 'trans-002',
          key: 'hr.employee.management',
          language: 'fr',
          originalText: 'Employee Management',
          translatedText: 'Gestion des Employés',
          status: 'translated',
          translator: 'Jean Dubois',
          lastModified: new Date('2024-01-19T16:45:00'),
          context: 'HR module employee management section',
          category: 'HR'
        },
        {
          id: 'trans-003',
          key: 'crm.lead.status',
          language: 'de',
          originalText: 'Lead Status',
          translatedText: 'Lead-Status',
          status: 'review',
          translator: 'Hans Mueller',
          lastModified: new Date('2024-01-19T14:30:00'),
          context: 'CRM lead status field',
          category: 'CRM'
        },
        {
          id: 'trans-004',
          key: 'settings.security',
          language: 'ar',
          originalText: 'Security Settings',
          translatedText: 'إعدادات الأمان',
          status: 'pending',
          translator: 'Ahmed Al-Rashid',
          lastModified: new Date('2024-01-18T12:20:00'),
          context: 'Security settings page',
          category: 'Settings'
        },
        {
          id: 'trans-005',
          key: 'reports.analytics',
          language: 'zh',
          originalText: 'Analytics Report',
          translatedText: '分析报告',
          status: 'translated',
          translator: 'Li Wei',
          lastModified: new Date('2024-01-18T10:15:00'),
          context: 'Analytics report page',
          category: 'Reports'
        }
      ]);

      setMetrics({
        totalLanguages: 7,
        activeLanguages: 4,
        totalTranslations: 1250,
        pendingTranslations: 45,
        completionRate: 78,
        lastSync: new Date('2024-01-20T10:30:00')
      });

      setLoading(false);
    }, 2000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'beta':
      case 'translated':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'inactive':
      case 'maintenance':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'rtl' ? '←' : '→';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Navigation':
        return <Globe className="h-4 w-4" />;
      case 'HR':
        return <Users className="h-4 w-4" />;
      case 'CRM':
        return <MessageCircle className="h-4 w-4" />;
      case 'Settings':
        return <Settings className="h-4 w-4" />;
      case 'Reports':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Multi-language Support</h1>
          <p className="text-gray-600 mt-2">
            Internationalization, translation management, and language support
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Globe className="h-4 w-4" />
            <span>Global Ready</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>Multi-language</span>
          </Badge>
        </div>
      </div>

      <Alert>
        <Globe className="h-4 w-4" />
        <AlertDescription>
          Multi-language support enables global accessibility with comprehensive translation 
          management, RTL language support, and automated translation workflows.
        </AlertDescription>
      </Alert>

      {/* Language Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Languages</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.totalLanguages}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Supported languages</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Languages</p>
                <p className="text-2xl font-bold text-green-600">{metrics.activeLanguages}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Live languages</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Average completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Translations</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.pendingTranslations}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="languages" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Languages</span>
            </TabsTrigger>
          <TabsTrigger value="translations" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Translations</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="languages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Active Languages</span>
                </CardTitle>
                <CardDescription>
                  Currently active languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {languages.filter(l => l.status === 'active').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Live languages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600" />
                  <span>Beta Languages</span>
                </CardTitle>
                <CardDescription>
                  Languages in beta testing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {languages.filter(l => l.status === 'beta').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Beta languages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <span>RTL Support</span>
                </CardTitle>
                <CardDescription>
                  Right-to-left languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {languages.filter(l => l.direction === 'rtl').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  RTL languages
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Supported Languages</CardTitle>
              <CardDescription>
                All supported languages and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {languages.map((language) => (
                  <div key={language.code} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{language.flag}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{language.name}</h3>
                            <span className="text-gray-600">({language.nativeName})</span>
                            <Badge className={getStatusColor(language.status)}>
                              {language.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {language.direction.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Region: {language.region} | Translator: {language.translator}
                          </p>
                          <p className="text-xs text-gray-500">
                            Last Updated: {language.lastUpdated.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {language.completion}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Completion
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Translation Progress</span>
                          <span>{language.completion}%</span>
                        </div>
                        <Progress value={language.completion} className="h-2" />
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Direction</div>
                          <div className="flex items-center space-x-1">
                            <span className="text-lg">{getDirectionIcon(language.direction)}</span>
                            <span className="text-sm font-medium">{language.direction.toUpperCase()}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Status</div>
                          <Badge className={getStatusColor(language.status)}>
                            {language.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="translations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Approved</span>
                </CardTitle>
                <CardDescription>
                  Approved translations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {translations.filter(t => t.status === 'approved').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Ready for use
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span>Pending Review</span>
                </CardTitle>
                <CardDescription>
                  Awaiting review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {translations.filter(t => t.status === 'review' || t.status === 'pending').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Needs review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Total Keys</span>
                </CardTitle>
                <CardDescription>
                  Translation keys
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {metrics.totalTranslations}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Total keys
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Translation Management</CardTitle>
              <CardDescription>
                Translation keys and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {translations.map((translation) => (
                  <div key={translation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(translation.category)}
                            <h3 className="font-semibold">{translation.key}</h3>
                            <Badge className={getStatusColor(translation.status)}>
                              {translation.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {translation.language.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Category: {translation.category} | Translator: {translation.translator}
                          </p>
                          <p className="text-xs text-gray-500">
                            Last Modified: {translation.lastModified.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-600">
                          {translation.language}
                        </div>
                        <div className="text-xs text-gray-500">
                          Language
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Original Text</h4>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          {translation.originalText}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Translated Text</h4>
                        <div className="bg-blue-50 p-3 rounded text-sm">
                          {translation.translatedText}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Context</h4>
                      <p className="text-sm text-gray-600">{translation.context}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync Translations
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Translations
        </Button>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import Translations
        </Button>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </div>
    </div>
  );
};

export default MultiLanguageSupport; 