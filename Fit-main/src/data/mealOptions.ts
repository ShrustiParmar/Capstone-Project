
import { MealItem } from "@/types/meal";

export const mealOptions: Record<string, MealItem[]> = {
  breakfast: [
    {
      name: "Oatmeal with Berries",
      calories: 350,
      protein: 12,
      carbs: 55,
      fat: 8,
      isVegetarian: true
    },
    {
      name: "Eggs and Avocado Toast",
      calories: 400,
      protein: 20,
      carbs: 35,
      fat: 15,
      isVegetarian: true
    },
    {
      name: "Protein Smoothie Bowl",
      calories: 380,
      protein: 25,
      carbs: 45,
      fat: 10,
      isVegetarian: true
    },
    {
      name: "Bacon and Eggs",
      calories: 450,
      protein: 28,
      carbs: 20,
      fat: 18,
      isVegetarian: false
    }
  ],
  lunch: [
    {
      name: "Quinoa Buddha Bowl",
      calories: 420,
      protein: 18,
      carbs: 65,
      fat: 15,
      isVegetarian: true
    },
    {
      name: "Chickpea Curry with Rice",
      calories: 380,
      protein: 15,
      carbs: 60,
      fat: 12,
      isVegetarian: true
    },
    {
      name: "Chicken Salad",
      calories: 450,
      protein: 35,
      carbs: 25,
      fat: 22,
      isVegetarian: false
    },
    {
      name: "Turkey Wrap",
      calories: 430,
      protein: 28,
      carbs: 48,
      fat: 18,
      isVegetarian: false
    }
  ],
  dinner: [
    {
      name: "Stir-Fry Tofu with Brown Rice",
      calories: 480,
      protein: 25,
      carbs: 65,
      fat: 18,
      isVegetarian: true
    },
    {
      name: "Lentil and Vegetable Curry",
      calories: 450,
      protein: 20,
      carbs: 70,
      fat: 15,
      isVegetarian: true
    },
    {
      name: "Salmon with Quinoa",
      calories: 550,
      protein: 40,
      carbs: 45,
      fat: 25,
      isVegetarian: false
    },
    {
      name: "Grilled Chicken with Sweet Potato",
      calories: 520,
      protein: 45,
      carbs: 50,
      fat: 20,
      isVegetarian: false
    }
  ],
  snacks: [
    {
      name: "Greek Yogurt with Nuts",
      calories: 250,
      protein: 15,
      carbs: 15,
      fat: 12,
      isVegetarian: true
    },
    {
      name: "Fresh Fruit and Almonds",
      calories: 200,
      protein: 8,
      carbs: 25,
      fat: 10,
      isVegetarian: true
    },
    {
      name: "Protein Bar",
      calories: 220,
      protein: 20,
      carbs: 25,
      fat: 8,
      isVegetarian: true
    },
    {
      name: "Turkey and Cheese Roll-ups",
      calories: 280,
      protein: 22,
      carbs: 5,
      fat: 15,
      isVegetarian: false
    }
  ]
};
