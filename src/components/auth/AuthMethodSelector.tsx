import { Mail, Link, Key } from "lucide-react";

interface AuthMethodSelectorProps {
  authMethod: "password" | "magic" | "otp";
  onMethodChange: (method: "password" | "magic" | "otp") => void;
}

export const AuthMethodSelector = ({ authMethod, onMethodChange }: AuthMethodSelectorProps) => {
  return (
    <div className="flex flex-col space-y-3 mb-4">
      <button
        type="button"
        onClick={() => onMethodChange("password")}
        className={`flex items-center text-left transition-colors ${
          authMethod === "password" 
            ? "text-yellow-400" 
            : "text-gray-300 hover:text-white"
        }`}
      >
        <Mail className="w-4 h-4 mr-3" />
        <span className="text-sm">Email+Password (By Default)</span>
      </button>
      
      <button
        type="button"
        onClick={() => onMethodChange("magic")}
        className={`flex items-center text-left transition-colors ${
          authMethod === "magic" 
            ? "text-yellow-400" 
            : "text-gray-300 hover:text-white"
        }`}
      >
        <Link className="w-4 h-4 mr-3" />
        <span className="text-sm">Email+VerifyLink (sent to email)</span>
      </button>
      
      <button
        type="button"
        onClick={() => onMethodChange("otp")}
        className={`flex items-center text-left transition-colors ${
          authMethod === "otp" 
            ? "text-yellow-400" 
            : "text-gray-300 hover:text-white"
        }`}
      >
        <Key className="w-4 h-4 mr-3" />
        <span className="text-sm">Email+OneTimeCode (sent to email)</span>
      </button>
    </div>
  );
};