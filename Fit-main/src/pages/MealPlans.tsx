
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DailyMealPlan, MealCategory, MealItem } from "@/types/meal";
import { mealOptions } from "@/data/mealOptions";
import { MealCard } from "@/components/meal/MealCard";
import { DietPreferences } from "@/components/meal/DietPreferences";
import { MealSuggestions } from "@/components/meal/MealSuggestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ShoppingCart, Sparkles } from "lucide-react";

const MealPlans = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [weekPlan, setWeekPlan] = useState<DailyMealPlan[]>([]);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [groceryItems, setGroceryItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    checkAuth();
    loadMealPlan();
    loadGroceryItems();
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

  const loadMealPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0]);

      if (error) throw error;

      const filteredMealOptions = Object.fromEntries(
        Object.entries(mealOptions).map(([type, meals]) => [
          type,
          meals.filter(meal => isVegetarian ? meal.isVegetarian : true)
        ])
      );

      // Default plan for today
      const defaultPlan: DailyMealPlan = {
        date: "Today",
        meals: {
          breakfast: filteredMealOptions.breakfast[0],
          lunch: filteredMealOptions.lunch[0],
          dinner: filteredMealOptions.dinner[0],
          snacks: filteredMealOptions.snacks[0]
        }
      };

      // Generate plan for tomorrow
      const tomorrowPlan: DailyMealPlan = {
        date: "Tomorrow",
        meals: {
          breakfast: filteredMealOptions.breakfast[1],
          lunch: filteredMealOptions.lunch[1],
          dinner: filteredMealOptions.dinner[1],
          snacks: filteredMealOptions.snacks[1]
        }
      };

      setWeekPlan([defaultPlan, tomorrowPlan]);
    } catch (error: any) {
      toast({
        title: "Error loading meal plan",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const loadGroceryItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('grocery_items')
        .select('name')
        .eq('user_id', user.id)
        .eq('checked', false);

      if (error) throw error;
      if (data) {
        setGroceryItems(data.map(item => item.name));
      }
    } catch (error: any) {
      console.error('Error loading grocery items:', error);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      generateWeekPlan();
    }
  }, [isVegetarian]);

  const generateWeekPlan = async () => {
    try {
      toast({
        title: "Generating Plan",
        description: "Your new meal plan is being generated...",
      });
      
      const filteredMealOptions = Object.fromEntries(
        Object.entries(mealOptions).map(([type, meals]) => [
          type,
          meals.filter(meal => isVegetarian ? meal.isVegetarian : true)
        ])
      ) as Record<MealCategory, MealItem[]>;

      // Create plans for today and tomorrow
      const newPlans: DailyMealPlan[] = ["Today", "Tomorrow"].map(date => ({
        date,
        meals: {
          breakfast: filteredMealOptions.breakfast[Math.floor(Math.random() * filteredMealOptions.breakfast.length)],
          lunch: filteredMealOptions.lunch[Math.floor(Math.random() * filteredMealOptions.lunch.length)],
          dinner: filteredMealOptions.dinner[Math.floor(Math.random() * filteredMealOptions.dinner.length)],
          snacks: filteredMealOptions.snacks[Math.floor(Math.random() * filteredMealOptions.snacks.length)]
        }
      }));

      setWeekPlan(newPlans);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const today = new Date().toISOString().split('T')[0];
        
        await supabase
          .from('meal_plans')
          .delete()
          .eq('user_id', user.id)
          .eq('date', today);

        const mealsToInsert = Object.entries(newPlans[0].meals).map(([type, meal]) => ({
          user_id: user.id,
          date: today,
          meal_type: type,
          meal_name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat
        }));

        const { error } = await supabase
          .from('meal_plans')
          .insert(mealsToInsert);

        if (error) throw error;
      }

      toast({
        title: "Plan Generated",
        description: `Your new ${isVegetarian ? 'vegetarian' : ''} meal plan has been created successfully!`,
      });
    } catch (error: any) {
      toast({
        title: "Error generating plan",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const swapMeal = (date: string, mealType: string) => {
    try {
      toast({
        title: "Swapping Meal",
        description: `Finding alternative options for ${mealType}...`,
      });

      const filteredMeals = mealOptions[mealType as MealCategory].filter(
        meal => isVegetarian ? meal.isVegetarian : true
      );

      const newMeal = filteredMeals[Math.floor(Math.random() * filteredMeals.length)];

      setWeekPlan(weekPlan.map(day => {
        if (day.date === date) {
          return {
            ...day,
            meals: {
              ...day.meals,
              [mealType]: newMeal
            }
          };
        }
        return day;
      }));

      toast({
        title: "Meal Swapped",
        description: `Successfully swapped ${mealType} to ${newMeal.name}`,
      });
    } catch (error: any) {
      toast({
        title: "Error swapping meal",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleSelectMeal = (mealType: MealCategory, meal: MealItem) => {
    setWeekPlan(weekPlan.map(day => {
      if (day.date === "Today") {
        return {
          ...day,
          meals: {
            ...day.meals,
            [mealType]: meal
          }
        };
      }
      return day;
    }));
    
    toast({
      title: "Meal Selected",
      description: `Added ${meal.name} to your ${mealType} plan`,
    });
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-app-primary">Meal Plans</span>
        <h1 className="text-3xl font-bold text-app-text dark:text-white">Your Meal Plans</h1>
      </div>

      <DietPreferences 
        isVegetarian={isVegetarian}
        onToggleVegetarian={setIsVegetarian}
      />
      
      <MealSuggestions 
        groceryItems={groceryItems} 
        mealOptions={mealOptions as Record<MealCategory, MealItem[]>}
        onSelectMeal={handleSelectMeal}
      />

      <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="today" className="gap-2">
            <Calendar className="h-4 w-4" />
            Today
          </TabsTrigger>
          <TabsTrigger value="tomorrow" className="gap-2">
            <Calendar className="h-4 w-4" />
            Tomorrow
          </TabsTrigger>
          <TabsTrigger value="grocery" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Grocery Based
          </TabsTrigger>
        </TabsList>

        {weekPlan.map((day, index) => (
          <TabsContent key={day.date} value={day.date.toLowerCase()} className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">{day.date}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(day.meals).map(([mealType, meal]) => (
                  <MealCard
                    key={mealType}
                    mealType={mealType}
                    meal={meal}
                    onSwap={() => swapMeal(day.date, mealType)}
                  />
                ))}
              </div>
            </Card>
          </TabsContent>
        ))}
        
        <TabsContent value="grocery" className="mt-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="h-5 w-5 text-app-primary" />
              <h2 className="text-xl font-semibold">Grocery-Based Meal Planner</h2>
            </div>
            
            {groceryItems.length > 0 ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Your Available Groceries</h3>
                  <div className="flex flex-wrap gap-2">
                    {groceryItems.map((item, index) => (
                      <div key={index} className="px-3 py-1 bg-muted rounded-full text-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Select the "Suggested Meals from Your Groceries" section above to see meal options based on what you have.
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Grocery Items Found</h3>
                <p className="text-muted-foreground mt-1">
                  Add items to your grocery list to see meal suggestions based on what you have.
                </p>
                <Button 
                  onClick={() => navigate('/grocery-list')} 
                  className="mt-4"
                >
                  Go to Grocery List
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Generate New Plan</h2>
          <Button onClick={generateWeekPlan}>Generate Week Plan</Button>
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Click the button above to generate a new {isVegetarian ? 'vegetarian' : ''} meal plan based on your preferences and goals.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MealPlans;
