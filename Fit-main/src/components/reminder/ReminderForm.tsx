
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Reminder, RecurrencePattern, ReminderPriority } from "@/types/reminder";
import { DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Bell, MapPin, CalendarRange, Tag } from "lucide-react";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CATEGORIES = ["Health", "Work", "Personal", "Shopping", "Family", "Fitness", "Other"];

interface ReminderFormProps {
  reminder: Partial<Reminder>;
  onSave: (reminder: Partial<Reminder>) => void;
  onCancel: () => void;
}

export const ReminderForm = ({ reminder, onSave, onCancel }: ReminderFormProps) => {
  const [editingReminder, setEditingReminder] = useState<Partial<Reminder>>(reminder);
  const [selectedCategory, setSelectedCategory] = useState<string>(reminder.category || "Other");

  useEffect(() => {
    setEditingReminder(reminder);
    setSelectedCategory(reminder.category || "Other");
  }, [reminder]);

  const handleDayToggle = (day: string) => {
    const days = editingReminder.days || [];
    const updatedDays = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day];
    
    setEditingReminder({
      ...editingReminder,
      days: updatedDays
    });
  };

  const handleSave = () => {
    if (!editingReminder.title || !editingReminder.time || !(editingReminder.days?.length)) {
      return; // Validation failed
    }
    onSave(editingReminder);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          value={editingReminder.title || ''}
          onChange={(e) => setEditingReminder({...editingReminder, title: e.target.value})}
          className="col-span-3"
          placeholder="Reminder title"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="time" className="text-right">
          Time
        </Label>
        <Input
          id="time"
          type="time"
          value={editingReminder.time || '12:00'}
          onChange={(e) => setEditingReminder({...editingReminder, time: e.target.value})}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="priority" className="text-right">
          Priority
        </Label>
        <Select 
          value={editingReminder.priority || 'medium'} 
          onValueChange={(value) => setEditingReminder({...editingReminder, priority: value as ReminderPriority})}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <Select 
          value={selectedCategory} 
          onValueChange={(value) => {
            setSelectedCategory(value);
            setEditingReminder({...editingReminder, category: value});
          }}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="recurrence" className="text-right">
          Recurrence
        </Label>
        <Select 
          value={editingReminder.recurrence || 'weekly'} 
          onValueChange={(value) => setEditingReminder({...editingReminder, recurrence: value as RecurrencePattern})}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select recurrence pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="location" className="text-right">
          Location
        </Label>
        <div className="col-span-3 flex gap-2">
          <Input
            id="location"
            value={editingReminder.location || ''}
            onChange={(e) => setEditingReminder({...editingReminder, location: e.target.value})}
            className="flex-1"
            placeholder="Optional location trigger"
          />
          <Button variant="outline" size="icon">
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right pt-2">Days</Label>
        <div className="flex flex-wrap gap-2 col-span-3">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox 
                id={`day-${day}`} 
                checked={editingReminder.days?.includes(day) || false}
                onCheckedChange={() => handleDayToggle(day)}
              />
              <label
                htmlFor={`day-${day}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {day}
              </label>
            </div>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" onClick={handleSave}>Save</Button>
      </DialogFooter>
    </div>
  );
};
