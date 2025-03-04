
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealItem extends NutritionInfo {
  name: string;
  isVegetarian: boolean;
}

export interface DailyMealPlan {
  date: string;
  meals: {
    breakfast: MealItem;
    lunch: MealItem;
    dinner: MealItem;
    snacks: MealItem;
  };
}

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks';
