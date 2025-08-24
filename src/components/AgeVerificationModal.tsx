import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SimpleDateInput } from "@/components/ui/simple-date-input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AgeVerificationModalProps {
  open: boolean;
  onVerified: () => void;
  onClose?: () => void;
}

export const AgeVerificationModal = ({ open, onVerified, onClose }: AgeVerificationModalProps) => {
  const [birthDate, setBirthDate] = useState<Date>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      // Default behavior: redirect to home page
      navigate('/');
    }
  };

  const handleAgeVerification = () => {
    if (!birthDate) {
      toast({
        title: "Date Required",
        description: "Please select your birth date",
        variant: "destructive"
      });
      return;
    }

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
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
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
              Please enter your birthday
            </label>
            <SimpleDateInput
              value={birthDate}
              onChange={setBirthDate}
              placeholder="MM/DD/YYYY"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              Your date of birth is used to calculate your age.
            </p>
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