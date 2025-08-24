import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SimpleDateInputProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SimpleDateInput({
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  className,
  disabled = false
}: SimpleDateInputProps) {
  const [inputValue, setInputValue] = useState('');

  // Format date to MM/DD/YYYY when value changes
  useEffect(() => {
    if (value) {
      const month = (value.getMonth() + 1).toString().padStart(2, '0');
      const day = value.getDate().toString().padStart(2, '0');
      const year = value.getFullYear().toString();
      setInputValue(`${month}/${day}/${year}`);
    } else {
      setInputValue('');
    }
  }, [value]);

  const formatDateInput = (input: string): string => {
    // Remove all non-numeric characters
    const numbers = input.replace(/\D/g, '');
    
    // Apply formatting as user types
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const parseDate = (dateString: string): Date | undefined => {
    // Check if the format is MM/DD/YYYY and complete
    const match = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return undefined;

    const [, month, day, year] = match;
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const yearNum = parseInt(year, 10);

    // Basic validation
    if (monthNum < 1 || monthNum > 12) return undefined;
    if (dayNum < 1 || dayNum > 31) return undefined;
    if (yearNum < 1900 || yearNum > new Date().getFullYear()) return undefined;

    const date = new Date(yearNum, monthNum - 1, dayNum);
    
    // Check if the date is valid (handles invalid dates like 02/30/2023)
    if (date.getMonth() !== monthNum - 1 || 
        date.getDate() !== dayNum || 
        date.getFullYear() !== yearNum) {
      return undefined;
    }

    return date;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatDateInput(rawValue);
    
    setInputValue(formattedValue);
    
    // Try to parse the date and call onChange
    const parsedDate = parseDate(formattedValue);
    onChange?.(parsedDate);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <Input
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={cn("font-mono", className)}
      disabled={disabled}
      maxLength={10}
    />
  );
}