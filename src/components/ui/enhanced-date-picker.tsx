import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buttonVariants } from "@/components/ui/button";

export interface EnhancedDatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  placeholder?: string;
  label?: string;
  className?: string;
  inputClassName?: string;
  calendarClassName?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function EnhancedDatePicker({
  value,
  onChange,
  disabled,
  placeholder = "Select date",
  label,
  className,
  inputClassName,
  calendarClassName,
  minDate = new Date("1900-01-01"),
  maxDate = new Date(),
}: EnhancedDatePickerProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [displayMonth, setDisplayMonth] = React.useState<Date>(value || new Date());

  // Update input value when external value changes
  React.useEffect(() => {
    if (value) {
      setInputValue(format(value, "MM/dd/yyyy"));
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);

    // Try to parse the input as a date
    if (inputVal) {
      // Support various date formats
      const formats = ["MM/dd/yyyy", "M/d/yyyy", "MM-dd-yyyy", "M-d-yyyy", "yyyy-MM-dd"];
      
      for (const fmt of formats) {
        try {
          const parsedDate = parse(inputVal, fmt, new Date());
          if (isValid(parsedDate)) {
            // Check if date is within bounds
            if (parsedDate >= minDate && parsedDate <= maxDate) {
              if (!disabled || !disabled(parsedDate)) {
                onChange?.(parsedDate);
                setDisplayMonth(parsedDate);
                return;
              }
            }
          }
        } catch {
          // Continue to next format
        }
      }
    }
  };

  const handleInputBlur = () => {
    // If input is invalid, reset to current value
    if (value) {
      setInputValue(format(value, "MM/dd/yyyy"));
    } else {
      setInputValue("");
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange?.(date);
      setInputValue(format(date, "MM/dd/yyyy"));
      setIsOpen(false);
    }
  };

  const handleMonthChange = (month: Date) => {
    setDisplayMonth(month);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(parseInt(year));
    setDisplayMonth(newDate);
  };

  const handleMonthChangeSelect = (month: string) => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(parseInt(month));
    setDisplayMonth(newDate);
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const startYear = minDate.getFullYear();
  const endYear = maxDate.getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  // Month names
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-white">{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            className={cn(
              "bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 pr-10",
              inputClassName
            )}
          />
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-700"
              type="button"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-auto p-0 bg-yellow-400 border-yellow-500" align="start">
          <div className="flex items-center justify-between p-3 border-b border-yellow-500">
            <Select
              value={displayMonth.getMonth().toString()}
              onValueChange={handleMonthChangeSelect}
            >
              <SelectTrigger className="w-32 bg-yellow-300 border-yellow-500 text-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={displayMonth.getFullYear().toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-20 bg-yellow-300 border-yellow-500 text-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {years.reverse().map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DayPicker
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            month={displayMonth}
            onMonthChange={handleMonthChange}
            disabled={disabled}
            className={cn("p-3 pointer-events-auto text-black", calendarClassName)}
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
              ),
              day_range_end: "day-range-end",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            components={{
              IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
              IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
            }}
          />
          
          <div className="p-3 border-t border-yellow-500 bg-yellow-300">
            <p className="text-xs text-gray-700">
              Type date manually (MM/dd/yyyy) or use calendar
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}