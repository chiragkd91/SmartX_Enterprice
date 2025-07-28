/**
 * Two-Factor Authentication Component
 * Comprehensive 2FA implementation with multiple verification methods
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Smartphone, 
  Mail, 
  Key, 
  Copy, 
  Download, 
  QrCode, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TwoFactorAuthProps {
  userId: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

interface BackupCode {
  id: string;
  code: string;
  used: boolean;
  usedAt?: Date;
}

interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  lastUsed: Date;
  trusted: boolean;
  ipAddress: string;
  userAgent: string;
}

export default function TwoFactorAuth({ userId, isEnabled, onToggle }: TwoFactorAuthProps) {
  const [activeTab, setActiveTab] = useState('setup');
  const [verificationMethod, setVerificationMethod] = useState<'sms' | 'email' | 'app'>('app');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [backupCodes, setBackupCodes] = useState<BackupCode[]>([]);
  const [trustedDevices, setTrustedDevices] = useState<Device[]>([]);
  const [showSecret, setShowSecret] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'method' | 'setup' | 'verify'>('method');
  const { toast } = useToast();

  // Mock data - replace with API calls
  useEffect(() => {
    if (isEnabled) {
      setBackupCodes([
        { id: '1', code: '12345678', used: false },
        { id: '2', code: '87654321', used: false },
        { id: '3', code: '11111111', used: false },
        { id: '4', code: '22222222', used: false },
        { id: '5', code: '33333333', used: false },
        { id: '6', code: '44444444', used: false },
        { id: '7', code: '55555555', used: false },
        { id: '8', code: '66666666', used: false },
      ]);

      setTrustedDevices([
        {
          id: '1',
          name: 'iPhone 14 Pro',
          type: 'mobile',
          lastUsed: new Date(),
          trusted: true,
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
        },
        {
          id: '2',
          name: 'MacBook Pro',
          type: 'desktop',
          lastUsed: new Date(Date.now() - 86400000),
          trusted: true,
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        }
      ]);
    }
  }, [isEnabled]);

  const handleSetup2FA = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (verificationMethod === 'app') {
        setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        setSecretKey('JBSWY3DPEHPK3PXP');
      }
      
      setStep('verify');
      toast({
        title: '2FA Setup',
        description: `Verification code sent to your ${verificationMethod === 'sms' ? 'phone' : verificationMethod === 'email' ? 'email' : 'authenticator app'}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to setup 2FA. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onToggle(true);
      setActiveTab('manage');
      toast({
        title: 'Success',
        description: 'Two-factor authentication has been enabled successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid verification code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onToggle(false);
      toast({
        title: 'Success',
        description: 'Two-factor authentication has been disabled.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disable 2FA. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateBackupCodes = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCodes = Array.from({ length: 8 }, (_, i) => ({
        id: (i + 1).toString(),
        code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        used: false
      }));
      
      setBackupCodes(newCodes);
      toast({
        title: 'Success',
        description: 'New backup codes generated successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate backup codes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.map(code => code.code).join('\n');
    navigator.clipboard.writeText(codesText);
    toast({
      title: 'Copied',
      description: 'Backup codes copied to clipboard',
    });
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.map(code => code.code).join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const removeTrustedDevice = async (deviceId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTrustedDevices(prev => prev.filter(device => device.id !== deviceId));
      toast({
        title: 'Success',
        description: 'Device removed from trusted devices',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove device',
        variant: 'destructive',
      });
    }
  };

  if (!isEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account by enabling two-factor authentication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication is currently disabled. Enable it to secure your account.
              </AlertDescription>
            </Alert>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="method">Choose Method</TabsTrigger>
                <TabsTrigger value="setup">Setup 2FA</TabsTrigger>
              </TabsList>
              
              <TabsContent value="method" className="space-y-4">
                <div className="grid gap-4">
                  <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setVerificationMethod('app')}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-8 w-8 text-blue-600" />
                        <div className="flex-1">
                          <h3 className="font-semibold">Authenticator App</h3>
                          <p className="text-sm text-muted-foreground">
                            Use apps like Google Authenticator, Authy, or Microsoft Authenticator
                          </p>
                        </div>
                        {verificationMethod === 'app' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setVerificationMethod('sms')}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-8 w-8 text-green-600" />
                        <div className="flex-1">
                          <h3 className="font-semibold">SMS</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive verification codes via text message
                          </p>
                        </div>
                        {verificationMethod === 'sms' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setVerificationMethod('email')}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-8 w-8 text-purple-600" />
                        <div className="flex-1">
                          <h3 className="font-semibold">Email</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive verification codes via email
                          </p>
                        </div>
                        {verificationMethod === 'email' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Button 
                  onClick={() => setActiveTab('setup')} 
                  className="w-full"
                  disabled={!verificationMethod}
                >
                  Continue
                </Button>
              </TabsContent>
              
              <TabsContent value="setup" className="space-y-4">
                {verificationMethod === 'app' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold mb-2">Scan QR Code</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Scan this QR code with your authenticator app
                      </p>
                      {qrCode && (
                        <div className="inline-block p-4 bg-white border rounded-lg">
                          <img src={qrCode} alt="QR Code" className="w-32 h-32" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secret">Secret Key</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secret"
                          type={showSecret ? 'text' : 'password'}
                          value={secretKey}
                          readOnly
                          className="font-mono"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowSecret(!showSecret)}
                        >
                          {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(secretKey)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {verificationMethod === 'sms' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {verificationMethod === 'email' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSetup2FA} 
                    disabled={isLoading || !verificationCode}
                    className="flex-1"
                  >
                    {isLoading ? 'Setting up...' : 'Setup 2FA'}
                  </Button>
                  <Button 
                    onClick={handleVerifyCode} 
                    disabled={isLoading || !verificationCode}
                    className="flex-1"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Two-Factor Authentication
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Enabled
          </Badge>
        </CardTitle>
        <CardDescription>
          Your account is protected with two-factor authentication.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manage">Manage</TabsTrigger>
            <TabsTrigger value="backup">Backup Codes</TabsTrigger>
            <TabsTrigger value="devices">Trusted Devices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage" className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication is active and protecting your account.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Verification Method</h3>
                  <p className="text-sm text-muted-foreground">
                    {verificationMethod === 'app' ? 'Authenticator App' : 
                     verificationMethod === 'sms' ? 'SMS' : 'Email'}
                  </p>
                </div>
                <Badge variant="outline">
                  {verificationMethod === 'app' ? 'App' : 
                   verificationMethod === 'sms' ? 'SMS' : 'Email'}
                </Badge>
              </div>
              
              <Button 
                variant="destructive" 
                onClick={handleDisable2FA}
                disabled={isLoading}
              >
                {isLoading ? 'Disabling...' : 'Disable 2FA'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="backup" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Backup Codes</h3>
                <p className="text-sm text-muted-foreground">
                  Save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code) => (
                  <div
                    key={code.id}
                    className={`p-3 border rounded-lg font-mono text-center ${
                      code.used ? 'bg-muted text-muted-foreground' : 'bg-background'
                    }`}
                  >
                    {code.code}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button onClick={copyBackupCodes} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Codes
                </Button>
                <Button onClick={downloadBackupCodes} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={generateBackupCodes} disabled={isLoading}>
                  <Key className="h-4 w-4 mr-2" />
                  Generate New Codes
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="devices" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Trusted Devices</h3>
                <p className="text-sm text-muted-foreground">
                  Devices that have been marked as trusted and don't require 2FA verification.
                </p>
              </div>
              
              <div className="space-y-2">
                {trustedDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        {device.type === 'mobile' ? (
                          <Smartphone className="h-4 w-4" />
                        ) : (
                          <Key className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{device.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Last used: {device.lastUsed.toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {device.ipAddress}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTrustedDevice(device.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 