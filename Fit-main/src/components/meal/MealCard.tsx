
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MealItem } from "@/types/meal";

interface MealCardProps {
  mealType: string;
  meal: MealItem;
  onSwap: () => void;
}

export const MealCard = ({ mealType, meal, onSwap }: MealCardProps) => {
  return (
    <Card className="meal-card p-4">
      <header className="meal-card-header">
        <h3 className="meal-type font-semibold capitalize mb-2">{mealType}</h3>
        <p className="meal-name text-lg mb-4">{meal.name}</p>
      </header>
      <div className="nutrition-info space-y-2 text-sm text-muted-foreground">
        <p className="nutrition-item">Calories: {meal.calories} kcal</p>
        <p className="nutrition-item">Protein: {meal.protein}g</p>
        <p className="nutrition-item">Carbs: {meal.carbs}g</p>
        <p className="nutrition-item">Fat: {meal.fat}g</p>
      </div>
      <Button 
        variant="outline" 
        className="swap-button w-full mt-4"
        onClick={onSwap}
      >
        Swap Meal
      </Button>
    </Card>
  );
};
