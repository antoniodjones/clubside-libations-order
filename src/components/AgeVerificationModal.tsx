import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AgeVerificationModalProps {
  open: boolean;
  onVerified: () => void;
}

export const AgeVerificationModal = ({ open, onVerified }: AgeVerificationModalProps) => {
  const [birthMonth, setBirthMonth] = useState<string>("");
  const [birthDay, setBirthDay] = useState<string>("");
  const [birthYear, setBirthYear] = useState<string>("");
  const { toast } = useToast();

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i - 10);

  const daysInMonth = useMemo(() => {
    if (!birthMonth || !birthYear) return 31;
    const month = parseInt(birthMonth);
    const year = parseInt(birthYear);
    return new Date(year, month, 0).getDate();
  }, [birthMonth, birthYear]);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleAgeVerification = () => {
    if (!birthMonth || !birthDay || !birthYear) {
      toast({
        title: "Date Required",
        description: "Please select your complete birth date",
        variant: "destructive"
      });
      return;
    }

    const birthDate = new Date(parseInt(birthYear), parseInt(birthMonth) - 1, parseInt(birthDay));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age >= 21) {
      localStorage.setItem('age_verified', 'true');
      onVerified();
      toast({
        title: "Welcome!",
        description: "Age verification successful"
      });
    } else {
      toast({
        title: "Access Denied",
        description: "You must be 21+ to access alcoholic beverages",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-gray-900 border border-purple-400/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold text-yellow-400 mb-4">
            Age Verification
          </DialogTitle>
          <DialogDescription className="text-center text-gray-300">
            <div className="mb-6">
              <div className="text-6xl font-black text-yellow-400 mb-2">21+</div>
              <div className="text-lg">Are you over 21 years old?</div>
              <div className="text-sm text-purple-400 mt-2">Or a qualifying patient 18+</div>
            </div>
            <div className="text-xs text-gray-400 mb-6">
              By continuing, you agree to our Terms of Service and Privacy Policy. 
              For alcoholic beverages, you must be 21+.
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Please select your birthday
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Select value={birthMonth} onValueChange={setBirthMonth}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value} className="text-white focus:bg-gray-700">
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={birthDay} onValueChange={setBirthDay}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {days.map((day) => (
                      <SelectItem key={day} value={day.toString()} className="text-white focus:bg-gray-700">
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={birthYear} onValueChange={setBirthYear}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()} className="text-white focus:bg-gray-700">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleAgeVerification}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};