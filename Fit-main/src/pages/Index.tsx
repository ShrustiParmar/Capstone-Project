
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-app-primary">Dashboard</span>
        <h1 className="text-3xl font-bold text-app-text dark:text-white">
          Welcome{profile?.name ? `, ${profile.name}` : ''}!
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/calculator')}>
          <h2 className="text-xl font-semibold mb-2">Calorie Calculator</h2>
          <p className="text-muted-foreground">Calculate your daily caloric needs based on your goals.</p>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/meal-plans')}>
          <h2 className="text-xl font-semibold mb-2">Meal Plans</h2>
          <p className="text-muted-foreground">View and manage your personalized meal plans.</p>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/progress')}>
          <h2 className="text-xl font-semibold mb-2">Track Progress</h2>
          <p className="text-muted-foreground">Monitor your weight and fitness progress over time.</p>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/grocery')}>
          <h2 className="text-xl font-semibold mb-2">Grocery List</h2>
          <p className="text-muted-foreground">Manage your shopping list for meal preparations.</p>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/reminders')}>
          <h2 className="text-xl font-semibold mb-2">Reminders</h2>
          <p className="text-muted-foreground">Set up meal and workout reminders.</p>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/profile')}>
          <h2 className="text-xl font-semibold mb-2">Profile Settings</h2>
          <p className="text-muted-foreground">Update your profile and preferences.</p>
        </Card>
      </div>
    </div>
  );
};

export default Index;
