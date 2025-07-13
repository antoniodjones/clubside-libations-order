import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

interface ProfileEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Tables<"profiles"> | null;
  onProfileUpdate: (profile: Tables<"profiles">) => void;
}

export const ProfileEditForm = ({ isOpen, onClose, profile, onProfileUpdate }: ProfileEditFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    birthday: "",
    gender: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country_code: "US", // Default to US
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        mobile_number: profile.mobile_number || "",
        birthday: profile.birthday || "",
        gender: profile.gender || "",
        address_line_1: profile.address_line_1 || "",
        address_line_2: profile.address_line_2 || "",
        city: profile.city || "",
        state: profile.state || "",
        postal_code: profile.postal_code || "",
        country_code: profile.country_code || "US",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("user_id", profile.user_id)
        .select()
        .single();

      if (error) throw error;

      onProfileUpdate(data);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderAddressFields = () => {
    const { country_code } = formData;

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address_line_1">
            {country_code === "GB" ? "Address Line 1" : "Street Address"}
          </Label>
          <Input
            id="address_line_1"
            value={formData.address_line_1}
            onChange={(e) => handleInputChange("address_line_1", e.target.value)}
            placeholder={country_code === "GB" ? "House number and street name" : "Enter street address"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address_line_2">
            {country_code === "GB" ? "Address Line 2 (optional)" : "Address Line 2"}
          </Label>
          <Input
            id="address_line_2"
            value={formData.address_line_2}
            onChange={(e) => handleInputChange("address_line_2", e.target.value)}
            placeholder={
              country_code === "GB" 
                ? "Apartment, suite, etc. (optional)" 
                : country_code === "CA"
                ? "Apartment, unit, etc. (optional)"
                : "Apartment, suite, etc. (optional)"
            }
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">
              {country_code === "GB" ? "Town/City" : "City"}
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder={country_code === "GB" ? "Enter town or city" : "Enter city"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">
              {country_code === "CA" ? "Province" : country_code === "GB" ? "County" : "State"}
            </Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              placeholder={
                country_code === "CA" 
                  ? "Enter province" 
                  : country_code === "GB"
                  ? "Enter county"
                  : "Enter state"
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code">
              {country_code === "US" ? "ZIP Code" : country_code === "GB" ? "Postcode" : "Postal Code"}
            </Label>
            <Input
              id="postal_code"
              value={formData.postal_code}
              onChange={(e) => handleInputChange("postal_code", e.target.value)}
              placeholder={
                country_code === "US" 
                  ? "Enter ZIP code" 
                  : country_code === "GB"
                  ? "Enter postcode"
                  : "Enter postal code"
              }
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) => handleInputChange("birthday", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country_code">Country</Label>
                <Select value={formData.country_code} onValueChange={(value) => handleInputChange("country_code", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile_number">Mobile Number</Label>
                <Input
                  id="mobile_number"
                  value={formData.mobile_number}
                  onChange={(e) => handleInputChange("mobile_number", e.target.value)}
                  placeholder="Enter mobile number"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Address</h3>
            {renderAddressFields()}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};