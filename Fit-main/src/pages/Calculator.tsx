
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Calculator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "male",
    activityLevel: "moderate",
  });
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate("/auth");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCalories = () => {
    const { age, weight, height, gender, activityLevel } = formData;
    
    // Harris-Benedict Formula
    let bmr;
    if (gender === "male") {
      bmr = 88.362 + (13.397 * Number(weight)) + (4.799 * Number(height)) - (5.677 * Number(age));
    } else {
      bmr = 447.593 + (9.247 * Number(weight)) + (3.098 * Number(height)) - (4.330 * Number(age));
    }

    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const totalCalories = Math.round(bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]);
    setResult(totalCalories);
    
    toast({
      title: "Calculation Complete",
      description: `Your daily calorie needs: ${totalCalories} kcal`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateCalories();
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-app-primary">Calculator</span>
        <h1 className="text-3xl font-bold text-app-text dark:text-white">Calorie Calculator</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Age</label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Weight (kg)</label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Height (cm)</label>
              <Input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Activity Level</label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (exercise 1-3 times/week)</option>
                <option value="moderate">Moderate (exercise 4-5 times/week)</option>
                <option value="active">Active (daily exercise or intense exercise 3-4 times/week)</option>
                <option value="veryActive">Very Active (intense exercise 6-7 times/week)</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full">Calculate</Button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-app-primary/10 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Results</h3>
            <p>Your estimated daily calorie needs: <span className="font-bold">{result} kcal</span></p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Calculator;
