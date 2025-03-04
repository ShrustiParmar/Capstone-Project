
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
  user_id: string;
}

const GroceryList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadItems();
  }, []);

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

  const loadItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('grocery_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      if (data) setItems(data);
    } catch (error: any) {
      toast({
        title: "Error loading grocery items",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newGroceryItem = {
        name: newItem.trim(),
        checked: false,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('grocery_items')
        .insert([newGroceryItem])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setItems([...items, data]);
        setNewItem("");
        toast({
          title: "Item Added",
          description: "New item has been added to your grocery list.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error adding item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleItem = async (id: string) => {
    try {
      const item = items.find(i => i.id === id);
      if (!item) return;

      const { error } = await supabase
        .from('grocery_items')
        .update({ checked: !item.checked })
        .eq('id', id);

      if (error) throw error;

      setItems(items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ));
    } catch (error: any) {
      toast({
        title: "Error updating item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('grocery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(items.filter(item => item.id !== id));
      toast({
        title: "Item Removed",
        description: "Item has been removed from your grocery list.",
      });
    } catch (error: any) {
      toast({
        title: "Error removing item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-app-primary">Grocery</span>
        <h1 className="text-3xl font-bold text-app-text dark:text-white">Shopping List</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={addItem} className="flex gap-4 mb-6">
          <Input
            placeholder="Add new item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <Button type="submit">
            <Plus className="h-4 w-4" />
            <span className="ml-2">Add</span>
          </Button>
        </form>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-background rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    item.checked ? "bg-app-primary border-app-primary" : ""
                  }`}
                >
                  {item.checked && <Check className="h-4 w-4 text-white" />}
                </button>
                <span className={item.checked ? "line-through text-muted-foreground" : ""}>
                  {item.name}
                </span>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default GroceryList;
