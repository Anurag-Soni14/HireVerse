import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import FileUpload from '@/components/FileUpload';
import axios from 'axios';

export default function CandidateProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    title: '',
    bio: '',
    experience: '',
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [resumeFile, setResumeFile] = useState(null); // ✅ store selected resume file
  const [resumeUrl, setResumeUrl] = useState(null);   // ✅ store uploaded resume path for preview/download

  // Fetch profile from backend
  useEffect(() => {
    (async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get('http://localhost:5000/api/candidates/profile', {
          withCredentials: true,
        });

        const data = res.data;

        setProfile({
          name: data.user?.name || '',
          email: data.user?.email || '',
          phone: data.phone || '',
          location: data.location || '',
          title: data.title || '',
          bio: data.bio || '',
          experience: data.experience || '',
        });

        setSkills(data.skills || []);
        if (data.resumeUrl) setResumeUrl(`http://localhost:5000/${data.resumeUrl}`);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    })();
  }, [user]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // ✅ Handle save with file upload
  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('skills', skills.join(','));
      if (resumeFile) formData.append('resume', resumeFile);

      const res = await axios.put(
        'http://localhost:5000/api/candidates/update-profile',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      setResumeUrl(res.data.resumeUrl ? `http://localhost:5000/${res.data.resumeUrl}` : null);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your professional information</p>
      </div>

      {/* Personal Information */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="San Francisco, CA"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                placeholder="Senior Frontend Developer"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                value={profile.experience}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                placeholder="5+ years"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Add your technical and professional skills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <Button onClick={handleAddSkill} variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resume Upload */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Resume</CardTitle>
          <CardDescription>Upload your latest resume (PDF format)</CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFileSelect={(file) => {
              if (file) {
                setResumeFile(file);
                toast.success('Resume selected!');
              }
            }}
            acceptedTypes=".pdf,.doc,.docx"
            maxSize={5 * 1024 * 1024}
          />

          {resumeUrl && (
            <div className="mt-3">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Uploaded Resume
              </a>
            </div>
          )}
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
