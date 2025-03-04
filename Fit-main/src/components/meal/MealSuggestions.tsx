
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MealItem, MealCategory } from "@/types/meal";
import { UtensilsCrossed, ShoppingCart, Check } from "lucide-react";

interface MealSuggestionsProps {
  groceryItems: string[];
  mealOptions: Record<MealCategory, MealItem[]>;
  onSelectMeal: (mealType: MealCategory, meal: MealItem) => void;
}

export const MealSuggestions = ({ groceryItems, mealOptions, onSelectMeal }: MealSuggestionsProps) => {
  const [expandedCategory, setExpandedCategory] = useState<MealCategory | null>(null);
  
  if (!groceryItems.length) {
    return (
      <Card className="p-6 bg-muted/30">
        <div className="flex flex-col items-center justify-center text-center py-4">
          <ShoppingCart className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No Grocery Items</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Add items to your grocery list to see meal suggestions
          </p>
        </div>
      </Card>
    );
  }

  // Simple matching algorithm to find meals containing grocery items
  const findMatchingMeals = (category: MealCategory): MealItem[] => {
    // In a real app, this would be more sophisticated, check for ingredients
    // This is a simplified version
    return mealOptions[category].filter(meal => 
      groceryItems.some(item => 
        meal.name.toLowerCase().includes(item.toLowerCase())
      )
    );
  };

  const mealCategories: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snacks'];
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-app-primary" />
          <h2 className="text-lg font-medium">Suggested Meals from Your Groceries</h2>
        </div>
      </div>

      <div className="space-y-4">
        {mealCategories.map(category => {
          const matchingMeals = findMatchingMeals(category);
          const isExpanded = expandedCategory === category;
          
          if (!matchingMeals.length) return null;
          
          return (
            <div key={category} className="border rounded-lg overflow-hidden">
              <button 
                className="w-full p-4 text-left flex items-center justify-between bg-background hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
              >
                <h3 className="text-md font-medium capitalize">{category}</h3>
                <span className="text-sm text-muted-foreground">
                  {matchingMeals.length} suggestions
                </span>
              </button>
              
              {isExpanded && (
                <div className="divide-y">
                  {matchingMeals.map((meal, index) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-muted/20">
                      <div>
                        <h4 className="font-medium">{meal.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {meal.calories} kcal • {meal.protein}g protein
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="gap-1"
                        onClick={() => onSelectMeal(category, meal)}
                      >
                        <Check className="h-4 w-4" />
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
