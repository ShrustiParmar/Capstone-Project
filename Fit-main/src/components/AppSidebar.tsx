
import { Home, User, Calculator, Apple, ShoppingBasket, LineChart, Bell, UtensilsCrossed, Salad, Heart, Carrot, Cookie, Utensils } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", icon: Home, route: "/" },
  { title: "Profile", icon: User, route: "/profile" },
  { title: "Calculator", icon: Calculator, route: "/calculator" },
  { title: "Meal Plans", icon: Salad, route: "/meal-plans" }, // Changed from Apple to Salad
  { title: "Grocery List", icon: Carrot, route: "/grocery" }, // Changed from ShoppingBasket to Carrot
  { title: "Progress", icon: LineChart, route: "/progress" },
  { title: "Reminders", icon: Bell, route: "/reminders" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-app-primary" />
              <span>FitMeal Master</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-app-primary/10">
                    <a href={item.route} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
