
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Progress = () => {
  const { toast } = useToast();
  const [weightData, setWeightData] = useState<any[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWeightLogs();
  }, []);

  const loadWeightLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;

      const formattedData = data.map(log => ({
        date: format(new Date(log.date), 'MM/dd'),
        weight: log.weight,
      }));

      setWeightData(formattedData);
    } catch (error: any) {
      toast({
        title: "Error loading weight logs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('weight_logs')
        .insert({
          user_id: user.id,
          weight: parseFloat(newWeight),
          date: new Date().toISOString().split('T')[0],
        });

      if (error) throw error;

      toast({
        title: "Weight Added",
        description: "Your weight has been logged successfully!",
      });

      setNewWeight("");
      loadWeightLogs(); // Refresh the data
    } catch (error: any) {
      toast({
        title: "Error adding weight",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const startWeight = weightData[0]?.weight;
  const currentWeight = weightData[weightData.length - 1]?.weight;
  const weightChange = currentWeight && startWeight ? (currentWeight - startWeight).toFixed(1) : "0";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-app-primary">Progress</span>
        <h1 className="text-3xl font-bold text-app-text dark:text-white">Your Progress</h1>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Weight Progress</h2>
          <form onSubmit={handleAddWeight} className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter weight (kg)"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              step="0.1"
              min="0"
              className="w-40"
            />
            <Button type="submit">Add Weight</Button>
          </form>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ stroke: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Starting Weight</h3>
          <p className="text-2xl font-bold text-app-primary">{startWeight || "--"} kg</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Current Weight</h3>
          <p className="text-2xl font-bold text-app-primary">{currentWeight || "--"} kg</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Total Change</h3>
          <p className="text-2xl font-bold text-app-primary">{weightChange} kg</p>
        </Card>
      </div>
    </div>
  );
};

export default Progress;

