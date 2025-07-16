import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const HomeIcon = () => {
  return (
    <Link to="/">
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed top-4 right-4 z-50 bg-black/40 backdrop-blur-sm border-purple-500/20 text-white hover:bg-purple-500/20"
      >
        <Home className="h-4 w-4" />
      </Button>
    </Link>
  );
};