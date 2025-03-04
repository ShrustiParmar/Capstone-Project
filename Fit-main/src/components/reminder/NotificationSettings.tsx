
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationSettings } from "@/types/reminder";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Clock, MessageSquare, Mail, Zap } from "lucide-react";

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onUpdate: (settings: NotificationSettings) => Promise<void>;
}

export const NotificationSettingsPanel = ({ settings, onUpdate }: NotificationSettingsProps) => {
  const [currentSettings, setCurrentSettings] = useState<NotificationSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(currentSettings);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
      
      <div className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="font-medium">Email Notifications</span>
                <p className="text-sm text-muted-foreground">Receive reminders via email</p>
              </div>
            </div>
            <Switch 
              checked={currentSettings.email}
              onCheckedChange={(checked) => 
                setCurrentSettings({...currentSettings, email: checked})
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="font-medium">Push Notifications</span>
                <p className="text-sm text-muted-foreground">Receive reminders via browser notifications</p>
              </div>
            </div>
            <Switch 
              checked={currentSettings.push}
              onCheckedChange={(checked) => 
                setCurrentSettings({...currentSettings, push: checked})
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="font-medium">SMS Notifications</span>
                <p className="text-sm text-muted-foreground">Receive reminders via text message</p>
              </div>
            </div>
            <Switch 
              checked={currentSettings.sms}
              onCheckedChange={(checked) => 
                setCurrentSettings({...currentSettings, sms: checked})
              }
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Delivery Preferences</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="digest-mode" className="text-right">
                Notification Mode
              </Label>
              <Select 
                value={currentSettings.digestMode} 
                onValueChange={(value: 'immediate' | 'daily' | 'weekly') => 
                  setCurrentSettings({...currentSettings, digestMode: value})
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select digest mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">Quiet Hours</h4>
                </div>
                <Switch 
                  checked={currentSettings.quietHoursEnabled}
                  onCheckedChange={(checked) => 
                    setCurrentSettings({...currentSettings, quietHoursEnabled: checked})
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={currentSettings.quietHoursStart}
                    onChange={(e) => setCurrentSettings({
                      ...currentSettings, 
                      quietHoursStart: e.target.value
                    })}
                    disabled={!currentSettings.quietHoursEnabled}
                  />
                </div>
                <div>
                  <Label htmlFor="quiet-end">End Time</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={currentSettings.quietHoursEnd}
                    onChange={(e) => setCurrentSettings({
                      ...currentSettings, 
                      quietHoursEnd: e.target.value
                    })}
                    disabled={!currentSettings.quietHoursEnabled}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  );
};
