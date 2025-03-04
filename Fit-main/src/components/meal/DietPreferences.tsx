
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DietPreferencesProps {
  isVegetarian: boolean;
  onToggleVegetarian: (value: boolean) => void;
}

export const DietPreferences = ({ isVegetarian, onToggleVegetarian }: DietPreferencesProps) => {
  return (
    <Card className="diet-preferences-card p-6">
      <div className="preference-container flex items-center justify-between mb-6">
        <div className="preference-controls flex items-center gap-4">
          <h2 className="preference-title text-xl font-semibold">Diet Preference</h2>
          <div className="diet-toggle-buttons flex gap-2">
            <Button 
              variant={!isVegetarian ? "default" : "outline"}
              onClick={() => onToggleVegetarian(false)}
              className="diet-button non-veg-button"
            >
              Non-Vegetarian
            </Button>
            <Button 
              variant={isVegetarian ? "default" : "outline"}
              onClick={() => onToggleVegetarian(true)}
              className="diet-button veg-button"
            >
              Vegetarian
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
