
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reminder } from "@/types/reminder";
import { Bell, Clock, Trash, Edit, MapPin, CalendarRange, Tag } from "lucide-react";

interface ReminderCardProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

export const ReminderCard = ({ reminder, onEdit, onDelete }: ReminderCardProps) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case 'medium': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case 'low': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default: return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  return (
    <Card className="p-4 shadow-sm hover:shadow transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${getPriorityColor(reminder.priority)}`}>
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium truncate max-w-[200px]">{reminder.title}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" /> 
                {reminder.time}
              </span>
              {reminder.location && (
                <span className="text-sm text-muted-foreground flex items-center">
                  <MapPin className="h-3 w-3 mr-1" /> 
                  {reminder.location}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {reminder.days.map(day => (
                <Badge key={day} variant="outline" className="text-xs">
                  {day}
                </Badge>
              ))}
              {reminder.recurrence && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <CalendarRange className="h-3 w-3" /> 
                  {reminder.recurrence}
                </Badge>
              )}
              {reminder.category && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <Tag className="h-3 w-3" /> 
                  {reminder.category}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            onClick={() => onEdit(reminder)}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onDelete(reminder.id)}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
