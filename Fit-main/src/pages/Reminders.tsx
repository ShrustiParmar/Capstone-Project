
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Bell, Filter, Calendar, Sparkles } from "lucide-react";
import { ReminderForm } from "@/components/reminder/ReminderForm";
import { ReminderCard } from "@/components/reminder/ReminderCard";
import { NotificationSettingsPanel } from "@/components/reminder/NotificationSettings";
import { SuggestedReminders } from "@/components/reminder/SuggestedReminders";
import { Reminder, NotificationSettings, ReminderPriority, RecurrencePattern } from "@/types/reminder";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  email: false,
  push: false,
  sms: false,
  digestMode: 'immediate',
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
};

const Reminders = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filteredReminders, setFilteredReminders] = useState<Reminder[]>([]);
  const [reminderDialog, setReminderDialog] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Partial<Reminder> | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [suggestedReminders, setSuggestedReminders] = useState<Partial<Reminder>[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    checkAuth();
    loadReminders();
    loadNotificationSettings();
    generateSuggestedReminders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reminders, searchQuery, filterCategory, filterPriority, activeTab]);

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

  const loadReminders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      if (data) {
        // Type checking and converting the data to match our Reminder interface
        const typedReminders: Reminder[] = data.map(item => ({
          id: item.id,
          title: item.title,
          time: item.time,
          days: item.days,
          user_id: item.user_id,
          created_at: item.created_at,
          priority: (item.priority as ReminderPriority) || 'medium',
          category: item.category || 'Other',
          recurrence: (item.recurrence as RecurrencePattern) || 'weekly',
          location: item.location || undefined,
          lastSuggested: item.last_suggested || undefined,
          quietHours: undefined // Add if you have this in your database
        }));
        
        setReminders(typedReminders);
        setFilteredReminders(typedReminders);
      }
    } catch (error: any) {
      toast({
        title: "Error loading reminders",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loadNotificationSettings = async () => {
    // In a real app, you would load these from a user preferences table
    // For now, we'll use default values
    setNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS);
  };

  const generateSuggestedReminders = async () => {
    // In a real app, this would use ML or pattern recognition
    // Here we'll just create some examples
    const suggestions: Partial<Reminder>[] = [
      {
        title: "Morning Workout",
        time: "07:00",
        days: ["Mon", "Wed", "Fri"],
        priority: "medium",
        category: "Fitness",
        recurrence: "weekly"
      },
      {
        title: "Take Vitamins",
        time: "08:30",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        priority: "high",
        category: "Health",
        recurrence: "daily"
      },
      {
        title: "Team Meeting",
        time: "10:00",
        days: ["Mon"],
        priority: "high",
        category: "Work",
        recurrence: "weekly"
      }
    ];
    
    setSuggestedReminders(suggestions);
  };

  const applyFilters = () => {
    let filtered = [...reminders];
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(reminder => 
        reminder.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter(reminder => reminder.category === filterCategory);
    }
    
    // Apply priority filter
    if (filterPriority) {
      filtered = filtered.filter(reminder => reminder.priority === filterPriority);
    }
    
    // Apply tab filter
    if (activeTab === 'today') {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3);
      filtered = filtered.filter(reminder => reminder.days.includes(today));
    } else if (activeTab === 'high') {
      filtered = filtered.filter(reminder => reminder.priority === 'high');
    }
    
    setFilteredReminders(filtered);
  };

  const openAddReminderDialog = () => {
    // Set default values for the new reminder
    setEditingReminder({
      id: "",
      title: "",
      time: "12:00",
      days: ["Mon"],
      user_id: "",
      priority: "medium",
      category: "Other",
      recurrence: "weekly"
    });
    setReminderDialog(true);
  };

  const openEditReminderDialog = (reminder: Reminder) => {
    setEditingReminder({ ...reminder });
    setReminderDialog(true);
  };

  const handleReminderSave = async (reminderData: Partial<Reminder>) => {
    try {
      if (!reminderData) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Add user_id if this is a new reminder
      if (!reminderData.user_id) {
        reminderData.user_id = user.id;
      }

      // Ensure required fields are present
      if (!reminderData.title || !reminderData.time || !reminderData.days) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      if (!reminderData.id) {
        // Creating a new reminder - ensure we have all required fields
        const newReminder = {
          title: reminderData.title,
          time: reminderData.time,
          days: reminderData.days,
          user_id: reminderData.user_id,
          priority: reminderData.priority || 'medium',
          category: reminderData.category || 'Other',
          recurrence: reminderData.recurrence || 'weekly',
          location: reminderData.location
        };

        const { data, error } = await supabase
          .from('reminders')
          .insert([newReminder])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          // Convert the returned data to match our Reminder interface
          const typedReminder: Reminder = {
            id: data.id,
            title: data.title,
            time: data.time,
            days: data.days,
            user_id: data.user_id,
            created_at: data.created_at,
            priority: (data.priority as ReminderPriority) || 'medium',
            category: data.category || 'Other',
            recurrence: (data.recurrence as RecurrencePattern) || 'weekly',
            location: data.location || undefined,
            lastSuggested: data.last_suggested || undefined,
            quietHours: undefined
          };
          
          setReminders([...reminders, typedReminder]);
          toast({
            title: "Reminder Added",
            description: "New reminder has been created successfully.",
          });
        }
      } else {
        // Updating existing reminder
        const { error } = await supabase
          .from('reminders')
          .update({
            title: reminderData.title,
            time: reminderData.time,
            days: reminderData.days,
            priority: reminderData.priority,
            category: reminderData.category,
            recurrence: reminderData.recurrence,
            location: reminderData.location
          })
          .eq('id', reminderData.id);

        if (error) throw error;
        
        // Update local state with type casting for safety
        setReminders(reminders.map(r => {
          if (r.id === reminderData.id) {
            return { 
              ...r, 
              ...reminderData,
              priority: (reminderData.priority as ReminderPriority) || r.priority
            } as Reminder;
          }
          return r;
        }));
        
        toast({
          title: "Reminder Updated",
          description: "The reminder has been updated successfully.",
        });
      }
      
      setReminderDialog(false);
    } catch (error: any) {
      toast({
        title: "Error saving reminder",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReminders(reminders.filter((reminder) => reminder.id !== id));
      toast({
        title: "Reminder Deleted",
        description: "The reminder has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error removing reminder",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateNotificationSettings = async (settings: NotificationSettings) => {
    // In a real app, you would save these to the database
    setNotificationSettings(settings);
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
    return Promise.resolve();
  };

  const handleAddSuggestion = (suggestion: Partial<Reminder>) => {
    setEditingReminder(suggestion);
    setReminderDialog(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterCategory(null);
    setFilterPriority(null);
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const uniqueCategories = [...new Set(reminders.map(r => r.category).filter(Boolean))];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-app-primary">Reminders</span>
        <h1 className="text-3xl font-bold text-app-text dark:text-white">Your Reminders</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search reminders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        
        <div className="flex gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterCategory(null)}>
                All Categories
              </DropdownMenuItem>
              {uniqueCategories.map(category => (
                <DropdownMenuItem 
                  key={category} 
                  onClick={() => setFilterCategory(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Priority
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterPriority(null)}>
                All Priorities
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority('high')}>
                High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority('medium')}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority('low')}>
                Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={openAddReminderDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </div>
      </div>

      <SuggestedReminders 
        suggestions={suggestedReminders} 
        onAddSuggestion={handleAddSuggestion}
      />

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Bell className="h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="today" className="gap-2">
            <Calendar className="h-4 w-4" />
            Today
          </TabsTrigger>
          <TabsTrigger value="high" className="gap-2">
            <Sparkles className="h-4 w-4" />
            High Priority
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">All Reminders</h2>
              {(filterCategory || filterPriority || searchQuery) && (
                <Button variant="ghost" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>

            {filteredReminders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReminders.map((reminder) => (
                  <ReminderCard 
                    key={reminder.id}
                    reminder={reminder}
                    onEdit={openEditReminderDialog}
                    onDelete={removeReminder}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No reminders found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery || filterCategory || filterPriority ? 
                    "Try adjusting your filters or search query" : 
                    "Create your first reminder to get started"
                  }
                </p>
                <Button 
                  onClick={openAddReminderDialog} 
                  className="mt-4"
                >
                  Create Reminder
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="today" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Today's Reminders</h2>
            
            {filteredReminders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReminders.map((reminder) => (
                  <ReminderCard 
                    key={reminder.id}
                    reminder={reminder}
                    onEdit={openEditReminderDialog}
                    onDelete={removeReminder}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No reminders for today</h3>
                <p className="text-muted-foreground mt-1">
                  You're all caught up for today!
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="high" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">High Priority Reminders</h2>
            
            {filteredReminders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReminders.map((reminder) => (
                  <ReminderCard 
                    key={reminder.id}
                    reminder={reminder}
                    onEdit={openEditReminderDialog}
                    onDelete={removeReminder}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No high priority reminders</h3>
                <p className="text-muted-foreground mt-1">
                  You don't have any high priority reminders at the moment
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <NotificationSettingsPanel
        settings={notificationSettings}
        onUpdate={updateNotificationSettings}
      />

      {/* Reminder Edit Dialog */}
      <Dialog open={reminderDialog} onOpenChange={setReminderDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingReminder?.id ? 'Edit Reminder' : 'Add Reminder'}</DialogTitle>
          </DialogHeader>
          {editingReminder && (
            <ReminderForm 
              reminder={editingReminder} 
              onSave={handleReminderSave}
              onCancel={() => setReminderDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reminders;
