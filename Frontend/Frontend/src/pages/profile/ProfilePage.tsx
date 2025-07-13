import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { SkillForm } from '@/components/skills/SkillForm';
import { SkillList } from '@/components/skills/SkillList';
import { Skill, User } from '@/types';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, isAuthenticated, updateCurrentUser } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  const [profileData, setProfileData] = useState({
    name: user.name,
    location: user.location || '',
    photoUrl: user.photoUrl || '',
    availability: [...user.availability],
    isPublic: user.isPublic,
  });

  const [skillsOffered, setSkillsOffered] = useState<Skill[]>(user.skillsOffered);
  const [skillsWanted, setSkillsWanted] = useState<Skill[]>(user.skillsWanted);

  const availabilityOptions = [
    { id: 'weekday-mornings', label: 'Weekday Mornings' },
    { id: 'weekday-afternoons', label: 'Weekday Afternoons' },
    { id: 'weekday-evenings', label: 'Weekday Evenings' },
    { id: 'weekend-mornings', label: 'Weekend Mornings' },
    { id: 'weekend-afternoons', label: 'Weekend Afternoons' },
    { id: 'weekend-evenings', label: 'Weekend Evenings' },
  ];

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (id: string, isChecked: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      availability: isChecked
        ? [...prev.availability, id]
        : prev.availability.filter((item) => item !== id),
    }));
  };

  const handleVisibilityChange = (isChecked: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      isPublic: isChecked,
    }));
  };

  const handleAddSkillOffered = (skill: Skill) => {
    setSkillsOffered((prev) => [...prev, skill]);
  };

  const handleAddSkillWanted = (skill: Skill) => {
    setSkillsWanted((prev) => [...prev, skill]);
  };

  const handleSave = () => {
    const updatedUser: User = {
      ...user,
      ...profileData,
      skillsOffered,
      skillsWanted,
    };

    updateCurrentUser(updatedUser);
    toast.success('Profile updated successfully');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-5xl py-10 px-4 mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold">Your Profile</h1>
        <Button onClick={handleSave} size="lg" className="px-6">
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2 bg-gray-100 p-1 rounded-md">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2 text-sm font-medium"
          >
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            value="skills-offered"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2 text-sm font-medium"
          >
            Skills You Offer
          </TabsTrigger>
          <TabsTrigger
            value="skills-wanted"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2 text-sm font-medium"
          >
            Skills You Want
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name & Location */}
            <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="space-y-3">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  name="location"
                  value={profileData.location}
                  onChange={handleProfileChange}
                  placeholder="e.g., New York, NY"
                  className="h-12"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="photoUrl">Profile Photo URL (Optional)</Label>
                <Input
                  id="photoUrl"
                  name="photoUrl"
                  value={profileData.photoUrl}
                  onChange={handleProfileChange}
                  placeholder="https://example.com/photo.jpg "
                  className="h-12"
                />
              </div>
            </div>

            {/* Availability & Visibility */}
            <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="space-y-3">
                <Label>Availability</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availabilityOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={profileData.availability.includes(option.id)}
                        onCheckedChange={(checked) =>
                          handleAvailabilityChange(option.id, checked === true)
                        }
                      />
                      <label htmlFor={option.id}>{option.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={profileData.isPublic}
                    onCheckedChange={(checked) => handleVisibilityChange(checked === true)}
                  />
                  <label htmlFor="isPublic">Make my profile public</label>
                </div>
                {!profileData.isPublic && (
                  <p className="text-sm text-muted-foreground pl-7">
                    Your profile is private. Only you and admins can see it.
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Skills Offered Tab */}
        <TabsContent value="skills-offered" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
              <h3 className="text-xl font-semibold mb-4">Your Offered Skills</h3>
              {skillsOffered.length > 0 ? (
                <div className="space-y-4">
                  {skillsOffered.map((skill) => (
                    <div key={skill.id} className="p-4 border rounded-md hover:bg-gray-50 transition">
                      <h4 className="font-medium">{skill.name}</h4>
                      <p className="text-sm text-muted-foreground">{skill.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No skills added yet.</p>
              )}
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
              <SkillForm onSave={handleAddSkillOffered} title="Add a skill you can offer" />
            </div>
          </div>
        </TabsContent>

        {/* Skills Wanted Tab */}
        <TabsContent value="skills-wanted" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
              <h3 className="text-xl font-semibold mb-4">Skills You Want to Learn</h3>
              {skillsWanted.length > 0 ? (
                <div className="space-y-4">
                  {skillsWanted.map((skill) => (
                    <div key={skill.id} className="p-4 border rounded-md hover:bg-gray-50 transition">
                      <h4 className="font-medium">{skill.name}</h4>
                      <p className="text-sm text-muted-foreground">{skill.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No skills added yet.</p>
              )}
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
              <SkillForm onSave={handleAddSkillWanted} title="Add a skill you want to learn" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}