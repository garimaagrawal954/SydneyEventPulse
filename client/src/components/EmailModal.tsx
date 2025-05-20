import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EmailModalProps {
  onClose: () => void;
  onSubmit: (email: string, subscribed: boolean) => void;
  eventName: string;
}

export default function EmailModal({ onClose, onSubmit, eventName }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [subscribe, setSubscribe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(email, subscribe);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-darkBg bg-opacity-75 z-50 flex items-center justify-center"
      onClick={handleModalClick}
    >
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Get Your Tickets</h3>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-2">Event: <strong>{eventName}</strong></p>
        <p className="text-gray-600 mb-6">
          Enter your email to receive the ticket link. We'll also keep you updated about similar events (optional).
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="your@email.com" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input 
                id="subscribe" 
                name="subscribe" 
                type="checkbox" 
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                checked={subscribe}
                onChange={(e) => setSubscribe(e.target.checked)}
              />
            </div>
            <div className="ml-3">
              <label htmlFor="subscribe" className="text-sm text-gray-600">
                Keep me updated about similar events and offers
              </label>
            </div>
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-secondary hover:bg-opacity-90 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              Continue to Tickets
            </button>
          </div>
        </form>
        
        <p className="text-sm text-gray-500 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
