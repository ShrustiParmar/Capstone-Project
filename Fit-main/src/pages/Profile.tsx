import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    goal: "weight-loss",
    dietaryPreference: "balanced",
    currentWeight: "",
    targetWeight: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          name: data.name || "",
          email: user.email || "",
          goal: data.goal || "weight-loss",
          dietaryPreference: data.dietary_preference || "balanced",
          currentWeight: data.current_weight?.toString() || "",
          targetWeight: data.target_weight?.toString() || "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name,
          goal: profile.goal,
          dietary_preference: profile.dietaryPreference,
          current_weight: parseFloat(profile.currentWeight) || null,
          target_weight: parseFloat(profile.targetWeight) || null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated!",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-app-primary">Profile</span>
        <h1 className="text-3xl font-bold text-app-text dark:text-white">Your Profile</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={profile.email}
                disabled
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fitness Goal</label>
              <select
                className="w-full p-2 border rounded-md"
                value={profile.goal}
                onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
              >
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="performance">Performance</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dietary Preference</label>
              <select
                className="w-full p-2 border rounded-md"
                value={profile.dietaryPreference}
                onChange={(e) => setProfile({ ...profile, dietaryPreference: e.target.value })}
              >
                <option value="balanced">Balanced</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Current Weight (kg)</label>
              <Input
                type="number"
                value={profile.currentWeight}
                onChange={(e) => setProfile({ ...profile, currentWeight: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Weight (kg)</label>
              <Input
                type="number"
                value={profile.targetWeight}
                onChange={(e) => setProfile({ ...profile, targetWeight: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <div className="space-y-4">
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">Change Password</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <Button type="submit" className="w-full">Update Password</Button>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            className="w-full text-destructive"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
