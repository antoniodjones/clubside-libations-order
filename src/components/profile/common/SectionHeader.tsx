import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      <Icon className="h-8 w-8 text-purple-400" />
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {description && <p className="text-gray-400">{description}</p>}
      </div>
    </div>
  );
};