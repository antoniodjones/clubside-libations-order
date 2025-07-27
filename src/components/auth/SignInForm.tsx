import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  isLoading: boolean;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  email,
  setEmail,
  onSubmit,
  onForgotPassword,
  isLoading
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="text-center mb-6">
        <button 
          type="button"
          onClick={() => navigate('/')}
          className="text-gray-300 hover:text-yellow-400 underline text-sm transition-colors"
        >
          Continue as Guest
        </button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signin-email" className="text-white">Email</Label>
          <Input
            id="signin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 border-gray-600 text-white"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
          disabled={isLoading}
        >
          {isLoading ? "Sending Code..." : "Send Verification Code"}
        </Button>
        
        <div className="text-center">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-gray-300 hover:text-yellow-400 underline text-sm transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </>
  );
};