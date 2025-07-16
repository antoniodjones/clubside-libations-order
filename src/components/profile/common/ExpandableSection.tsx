import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableSectionProps {
  title: string;
  totalCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  maxDisplayItems: number;
  children: React.ReactNode;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  totalCount,
  isExpanded,
  onToggle,
  maxDisplayItems,
  children
}) => {
  const shouldShowToggle = totalCount > maxDisplayItems;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-white">{title} ({totalCount})</h4>
        {shouldShowToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-purple-400 hover:text-purple-300"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show More
              </>
            )}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
};