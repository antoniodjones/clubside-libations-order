import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MagicLinkFormProps {
  email: string;
  onEmailChange: (email: string) => void;
}

export const MagicLinkForm = ({ email, onEmailChange }: MagicLinkFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleMagicLink = async () => {
    if (!email) {
      toast({ 
        title: "Email required", 
        description: "Please enter your email address first.",
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/menu`
        }
      });
      
      if (error) throw error;
      toast({ 
        title: "Magic link sent!", 
        description: "Check your email for the sign-in link." 
      });
    } catch (error: any) {
      toast({ 
        title: "Failed to send magic link", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        />
      </div>
      
      <Button
        type="button"
        onClick={handleMagicLink}
        disabled={loading || !email}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
        size="lg"
      >
        {loading ? "Sending..." : "Send Magic Link"}
      </Button>
    </div>
  );
};