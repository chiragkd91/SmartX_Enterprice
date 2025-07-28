import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, Lock, Unlock, Key, Database, Activity, CheckCircle, 
  AlertTriangle, Settings, RefreshCw, Plus, Eye, Zap, Brain,
  Link, FileText, Users, Clock, DollarSign, TrendingUp, 
  Network, Code, Wallet, Award
} from 'lucide-react';

interface SmartContract {
  id: string;
  name: string;
  type: 'credential' | 'payment' | 'agreement' | 'certification';
  status: 'active' | 'pending' | 'expired' | 'error';
  address: string;
  deployedDate: Date;
  lastTransaction: Date;
  gasUsed: number;
  transactions: number;
  value: number;
  participants: number;
}

interface Credential {
  id: string;
  type: 'employee' | 'certification' | 'license' | 'degree';
  holder: string;
  issuer: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'valid' | 'expired' | 'revoked' | 'pending';
  hash: string;
  verified: boolean;
  blockchainAddress: string;
}

interface BlockchainTransaction {
  id: string;
  type: 'credential_verification' | 'smart_contract' | 'payment' | 'certification';
  from: string;
  to: string;
  amount: number;
  gasUsed: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  blockNumber: number;
  hash: string;
}

interface BlockchainMetrics {
  totalContracts: number;
  activeCredentials: number;
  totalTransactions: number;
  totalValue: number;
  averageGasPrice: number;
  networkStatus: 'healthy' | 'congested' | 'maintenance';
}

const BlockchainIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contracts');
  const [loading, setLoading] = useState(false);
  const [smartContracts, setSmartContracts] = useState<SmartContract[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [metrics, setMetrics] = useState<BlockchainMetrics>({
    totalContracts: 0,
    activeCredentials: 0,
    totalTransactions: 0,
    totalValue: 0,
    averageGasPrice: 0,
    networkStatus: 'healthy'
  });

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSmartContracts([
        {
          id: 'contract-001',
          name: 'Employee Credential Verification',
          type: 'credential',
          status: 'active',
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          deployedDate: new Date('2024-01-01'),
          lastTransaction: new Date('2024-01-20T10:30:00'),
          gasUsed: 125000,
          transactions: 45,
          value: 0.5,
          participants: 125
        },
        {
          id: 'contract-002',
          name: 'Payment Escrow System',
          type: 'payment',
          status: 'active',
          address: '0x8ba1f109551bD432803012645Hac136c772c3c3',
          deployedDate: new Date('2024-01-05'),
          lastTransaction: new Date('2024-01-20T09:15:00'),
          gasUsed: 89000,
          transactions: 23,
          value: 2.5,
          participants: 67
        },
        {
          id: 'contract-003',
          name: 'Certification Management',
          type: 'certification',
          status: 'pending',
          address: '0x1234567890abcdef1234567890abcdef12345678',
          deployedDate: new Date('2024-01-10'),
          lastTransaction: new Date('2024-01-19T16:45:00'),
          gasUsed: 156000,
          transactions: 12,
          value: 0.8,
          participants: 34
        }
      ]);

      setCredentials([
        {
          id: 'cred-001',
          type: 'employee',
          holder: 'John Smith',
          issuer: 'SmartBizFlow Corp',
          issueDate: new Date('2024-01-01'),
          expiryDate: new Date('2025-01-01'),
          status: 'valid',
          hash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
          verified: true,
          blockchainAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
        },
        {
          id: 'cred-002',
          type: 'certification',
          holder: 'Sarah Johnson',
          issuer: 'Tech Certification Board',
          issueDate: new Date('2023-12-15'),
          expiryDate: new Date('2024-12-15'),
          status: 'valid',
          hash: '0xdef456ghi789jkl012mno345pqr678stu901vwx234yzabc123',
          verified: true,
          blockchainAddress: '0x8ba1f109551bD432803012645Hac136c772c3c3'
        },
        {
          id: 'cred-003',
          type: 'license',
          holder: 'Mike Davis',
          issuer: 'Professional Licensing Authority',
          issueDate: new Date('2023-06-01'),
          expiryDate: new Date('2024-06-01'),
          status: 'expired',
          hash: '0xghi789jkl012mno345pqr678stu901vwx234yzabc123def456',
          verified: false,
          blockchainAddress: '0x1234567890abcdef1234567890abcdef12345678'
        }
      ]);

      setTransactions([
        {
          id: 'tx-001',
          type: 'credential_verification',
          from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          to: '0x8ba1f109551bD432803012645Hac136c772c3c3',
          amount: 0.001,
          gasUsed: 21000,
          status: 'confirmed',
          timestamp: new Date('2024-01-20T10:30:00'),
          blockNumber: 18456789,
          hash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz'
        },
        {
          id: 'tx-002',
          type: 'smart_contract',
          from: '0x8ba1f109551bD432803012645Hac136c772c3c3',
          to: '0x1234567890abcdef1234567890abcdef12345678',
          amount: 0.005,
          gasUsed: 125000,
          status: 'confirmed',
          timestamp: new Date('2024-01-20T09:15:00'),
          blockNumber: 18456788,
          hash: '0xdef456ghi789jkl012mno345pqr678stu901vwx234yzabc123'
        },
        {
          id: 'tx-003',
          type: 'payment',
          from: '0x1234567890abcdef1234567890abcdef12345678',
          to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          amount: 0.1,
          gasUsed: 89000,
          status: 'pending',
          timestamp: new Date('2024-01-20T08:45:00'),
          blockNumber: 18456787,
          hash: '0xghi789jkl012mno345pqr678stu901vwx234yzabc123def456'
        }
      ]);

      setMetrics({
        totalContracts: 3,
        activeCredentials: 2,
        totalTransactions: 80,
        totalValue: 3.8,
        averageGasPrice: 25,
        networkStatus: 'healthy'
      });

      setLoading(false);
    }, 2000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'valid':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'revoked':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'credential':
      case 'employee':
      case 'certification':
      case 'license':
      case 'degree':
        return <Award className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'agreement':
        return <FileText className="h-4 w-4" />;
      case 'smart_contract':
        return <Code className="h-4 w-4" />;
      case 'credential_verification':
        return <Shield className="h-4 w-4" />;
      default:
        return <Network className="h-4 w-4" />;
    }
  };

  const getNetworkStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'congested': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blockchain Integration</h1>
          <p className="text-gray-600 mt-2">
            Secure credential verification, smart contracts, and blockchain-based features
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Network className="h-4 w-4" />
            <span>Blockchain Powered</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Shield className="h-4 w-4" />
            <span>Secure</span>
          </Badge>
        </div>
      </div>

      <Alert>
        <Network className="h-4 w-4" />
        <AlertDescription>
          Blockchain integration provides immutable credential verification, secure smart contracts, 
          and transparent transaction history. All data is cryptographically secured on the blockchain.
        </AlertDescription>
      </Alert>

      {/* Blockchain Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Smart Contracts</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.totalContracts}</p>
              </div>
              <Code className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Active contracts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valid Credentials</p>
                <p className="text-2xl font-bold text-green-600">{metrics.activeCredentials}</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Verified credentials</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.totalTransactions}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Blockchain transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Network Status</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.networkStatus}</p>
              </div>
              <div className={`p-2 rounded-full ${getNetworkStatusColor(metrics.networkStatus)}`}>
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Blockchain network</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contracts" className="flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span>Smart Contracts</span>
          </TabsTrigger>
          <TabsTrigger value="credentials" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Credentials</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Transactions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-blue-600" />
                  <span>Active Contracts</span>
                </CardTitle>
                <CardDescription>
                  Currently deployed smart contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {smartContracts.filter(c => c.status === 'active').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Running contracts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Total Participants</span>
                </CardTitle>
                <CardDescription>
                  Users interacting with contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {smartContracts.reduce((sum, c) => sum + c.participants, 0)}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Active participants
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <span>Total Value</span>
                </CardTitle>
                <CardDescription>
                  Value locked in contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {smartContracts.reduce((sum, c) => sum + c.value, 0).toFixed(2)} ETH
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Locked value
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Smart Contracts</CardTitle>
              <CardDescription>
                Deployed smart contracts and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {smartContracts.map((contract) => (
                  <div key={contract.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{contract.name}</h3>
                            <Badge className={getStatusColor(contract.status)}>
                              {contract.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {contract.type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Address: {contract.address}
                          </p>
                          <p className="text-xs text-gray-500">
                            Deployed: {contract.deployedDate.toLocaleDateString()} | 
                            Last TX: {contract.lastTransaction.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {contract.value} ETH
                        </div>
                        <div className="text-sm text-gray-600">
                          Contract value
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Gas Used</div>
                        <div className="text-lg font-semibold">{contract.gasUsed.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Transactions</div>
                        <div className="text-lg font-semibold">{contract.transactions}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Participants</div>
                        <div className="text-lg font-semibold">{contract.participants}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Status</div>
                        <Badge className={getStatusColor(contract.status)}>
                          {contract.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span>Valid Credentials</span>
                </CardTitle>
                <CardDescription>
                  Verified credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {credentials.filter(c => c.status === 'valid').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Active credentials
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span>Verified</span>
                </CardTitle>
                <CardDescription>
                  Blockchain verified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {credentials.filter(c => c.verified).length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Verified credentials
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Expired</span>
                </CardTitle>
                <CardDescription>
                  Expired credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {credentials.filter(c => c.status === 'expired').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Need renewal
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Digital Credentials</CardTitle>
              <CardDescription>
                Blockchain-verified credentials and certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {credentials.map((credential) => (
                  <div key={credential.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{credential.holder}</h3>
                            <Badge className={getStatusColor(credential.status)}>
                              {credential.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {credential.type.toUpperCase()}
                            </Badge>
                            {credential.verified && (
                              <Badge className="bg-green-100 text-green-800">
                                VERIFIED
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Issued by: {credential.issuer}
                          </p>
                          <p className="text-xs text-gray-500">
                            Issue Date: {credential.issueDate.toLocaleDateString()} | 
                            Expiry: {credential.expiryDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-600">
                          Hash
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {credential.hash.substring(0, 20)}...
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Blockchain Address</h4>
                        <div className="text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded">
                          {credential.blockchainAddress}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Verification Status</h4>
                        <div className="flex items-center space-x-2">
                          {credential.verified ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm">
                            {credential.verified ? 'Verified on Blockchain' : 'Not Verified'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span>Total Transactions</span>
                </CardTitle>
                <CardDescription>
                  Blockchain transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{transactions.length}</div>
                <p className="text-sm text-gray-600 mt-2">
                  Processed today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Confirmed</span>
                </CardTitle>
                <CardDescription>
                  Confirmed transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {transactions.filter(t => t.status === 'confirmed').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Successfully processed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <span>Total Value</span>
                </CardTitle>
                <CardDescription>
                  Transaction value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(3)} ETH
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Total volume
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Blockchain Transactions</CardTitle>
              <CardDescription>
                Recent blockchain transactions and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(transaction.type)}
                            <h3 className="font-semibold">
                              {transaction.type.replace('_', ' ').toUpperCase()}
                            </h3>
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Block: {transaction.blockNumber} | 
                            Time: {transaction.timestamp.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            Hash: {transaction.hash.substring(0, 20)}...
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {transaction.amount} ETH
                        </div>
                        <div className="text-sm text-gray-600">
                          Amount
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">From</div>
                        <div className="text-xs font-mono text-gray-700">
                          {transaction.from.substring(0, 20)}...
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">To</div>
                        <div className="text-xs font-mono text-gray-700">
                          {transaction.to.substring(0, 20)}...
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Gas Used</div>
                        <div className="text-sm font-semibold">{transaction.gasUsed.toLocaleString()}</div>
                      </div>
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
          Refresh Blockchain
        </Button>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Blockchain Settings
        </Button>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Deploy Contract
        </Button>
      </div>
    </div>
  );
};

export default BlockchainIntegration; 