
import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Translating..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
      <div className="relative">
        <Loader className="w-8 h-8 text-greek-blue animate-spin" />
        <div className="absolute inset-0 w-8 h-8 border-2 border-greek-light-blue rounded-full animate-pulse-soft"></div>
      </div>
      <p className="mt-4 text-muted-foreground font-medium">{message}</p>
      <div className="flex gap-1 mt-2">
        <div className="w-2 h-2 bg-greek-blue rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-greek-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-greek-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
