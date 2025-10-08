import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import FileUpload from "@/components/FileUpload";
import axios from "axios";

export default function RecruiterProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    companyName: "",
    contactName: user?.name || "",
    email: user?.email || "",
    phone: "",
    website: "",
    location: "",
    industry: "",
    size: "",
    description: "",
  });
  

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(
          "http://localhost:5000/api/recruiters/profile",
          { withCredentials: true }
        );
        const data = res.data || {};

        if (!isMounted) return;
        setProfile({
          companyName: data.companyName || "",
          contactName: data.contactName || data.user?.name || "",
          email: data.email || data.user?.email || "",
          phone: data.phone || "",
          website: data.website || "",
          location: data.location || "",
          industry: data.industry || "",
          size: data.size || "",
          description: data.description || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    })();
    return () => { isMounted = false; };
  }, [user]);
  
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/recruiters/${user.id}`,
        profile,
        { withCredentials: true }
      );
      const updated = res.data || {};
      setProfile({
        companyName: updated.companyName || "",
        contactName: updated.contactName || updated.user?.name || "",
        email: updated.email || updated.user?.email || "",
        phone: updated.phone || "",
        website: updated.website || "",
        location: updated.location || "",
        industry: updated.industry || "",
        size: updated.size || "",
        description: updated.description || "",
      });
      toast.success("Company profile updated successfully!");
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Company Profile</h1>
        <p className="text-muted-foreground">Manage your company information</p>
      </div>

      {/* Company Information */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={profile.companyName}
                onChange={(e) =>
                  setProfile({ ...profile, companyName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={profile.contactName}
                onChange={(e) =>
                  setProfile({ ...profile, contactName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={profile.website}
                onChange={(e) =>
                  setProfile({ ...profile, website: e.target.value })
                }
                placeholder="https://www.example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
                placeholder="San Francisco, CA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={profile.industry}
                onChange={(e) =>
                  setProfile({ ...profile, industry: e.target.value })
                }
                placeholder="Technology, Finance, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <Input
                id="size"
                value={profile.size}
                onChange={(e) =>
                  setProfile({ ...profile, size: e.target.value })
                }
                placeholder="1-50, 51-200, etc."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                value={profile.description}
                onChange={(e) =>
                  setProfile({ ...profile, description: e.target.value })
                }
                placeholder="Tell candidates about your company..."
                rows={6}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Logo */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Company Logo</CardTitle>
          <CardDescription>
            Upload your company logo (PNG, JPG format)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFileSelect={(file) => {
              if (file) {
                toast.success("Company logo uploaded successfully!");
              }
            }}
            acceptedTypes=".png,.jpg,.jpeg"
            maxSize={2 * 1024 * 1024}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" variant="success">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
