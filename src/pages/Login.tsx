import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AuthMethodSelector } from "@/components/auth/AuthMethodSelector";
import { PasswordLoginForm } from "@/components/auth/PasswordLoginForm";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";
import { OTPForm } from "@/components/auth/OTPForm";
import { GuestOrderButton } from "@/components/auth/GuestOrderButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [authMethod, setAuthMethod] = useState<"password" | "magic" | "otp">("password");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-purple-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to start ordering your favorite drinks with of the following options below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <AuthMethodSelector 
                authMethod={authMethod} 
                onMethodChange={setAuthMethod} 
              />

              {authMethod === "password" && (
                <PasswordLoginForm 
                  email={email} 
                  onEmailChange={setEmail} 
                />
              )}

              {authMethod === "magic" && (
                <MagicLinkForm 
                  email={email} 
                  onEmailChange={setEmail} 
                />
              )}

              {authMethod === "otp" && (
                <OTPForm 
                  email={email} 
                  onEmailChange={setEmail} 
                />
              )}

              <Separator className="bg-white/20" />
              
              <GuestOrderButton />
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Don't have an account?{" "}
                <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;