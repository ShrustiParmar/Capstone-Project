
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";
import { Reminder } from "@/types/reminder";

interface SuggestedRemindersProps {
  suggestions: Partial<Reminder>[];
  onAddSuggestion: (reminder: Partial<Reminder>) => void;
}

export const SuggestedReminders = ({ suggestions, onAddSuggestion }: SuggestedRemindersProps) => {
  if (!suggestions.length) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h2 className="text-lg font-medium">Suggested Reminders</h2>
      </div>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium">{suggestion.title}</h4>
              <p className="text-sm text-muted-foreground">
                {suggestion.time} • {suggestion.days?.join(", ")}
              </p>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => onAddSuggestion(suggestion)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};
