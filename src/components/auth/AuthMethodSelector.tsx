import { Button } from "@/components/ui/button";
import { Mail, KeyRound } from "lucide-react";

interface AuthMethodSelectorProps {
  authMethod: "password" | "magic" | "otp";
  onMethodChange: (method: "password" | "magic" | "otp") => void;
}

export const AuthMethodSelector = ({ authMethod, onMethodChange }: AuthMethodSelectorProps) => {
  return (
    <div className="flex space-x-2">
      <Button
        type="button"
        variant={authMethod === "password" ? "default" : "outline"}
        onClick={() => onMethodChange("password")}
        className="flex-1 text-sm"
        size="sm"
      >
        Use Email+Password
      </Button>
      <Button
        type="button"
        variant={authMethod === "magic" ? "default" : "outline"}
        onClick={() => onMethodChange("magic")}
        className="flex-1 text-sm"
        size="sm"
      >
        <Mail className="w-4 h-4 mr-1" />
        Use Email+ConfirmationLink
      </Button>
      <Button
        type="button"
        variant={authMethod === "otp" ? "default" : "outline"}
        onClick={() => onMethodChange("otp")}
        className="flex-1 text-sm"
        size="sm"
      >
        <KeyRound className="w-4 h-4 mr-1" />
        Use Email+OnetimePasscode
      </Button>
    </div>
  );
};