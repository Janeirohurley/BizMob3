import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Mail, Phone, Chrome, Building2 } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="bg-white rounded-full p-6 mb-6 shadow-lg mx-auto w-24 h-24 flex items-center justify-center">
          <Building2 className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-white mb-2">BusinessFlow</h1>
        <p className="text-blue-100">Manage your business easily.</p>
      </div>

      <Card className="w-full max-w-sm p-6 space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={onLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-3"
          >
            <Mail className="w-5 h-5" />
            Continue with Email
          </Button>

          <Button 
            onClick={onLogin}
            variant="outline" 
            className="w-full flex items-center justify-center gap-3"
          >
            <Phone className="w-5 h-5" />
            Continue with Phone
          </Button>

          <Button 
            onClick={onLogin}
            variant="outline" 
            className="w-full flex items-center justify-center gap-3"
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </Button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </Card>
    </div>
  );
}