import React from 'react';
import { useStore } from '../../store/useStore';

const LoginDebug: React.FC = () => {
  const { login, currentUser, isAuthenticated, loading, error } = useStore();

  const testLogin = async () => {
    console.log('🧪 Testing login with admin credentials...');
    const success = await login('admin@smartbizflow.com', 'password123');
    console.log('🧪 Login result:', success);
  };

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="font-bold mb-2">Login Debug</h3>
      <div className="space-y-2 text-sm">
        <div>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
        <div>Loading: {loading ? '⏳ Yes' : '✅ No'}</div>
        <div>User: {currentUser?.name || 'None'}</div>
        <div>Error: {error || 'None'}</div>
        <button 
          onClick={testLogin}
          className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
        >
          Test Login
        </button>
      </div>
    </div>
  );
};

export default LoginDebug; 