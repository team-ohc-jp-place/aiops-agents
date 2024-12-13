import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User } from "lucide-react";
import { useUser } from "@/hooks/use-user";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  const navigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-2xl font-bold text-primary hover:bg-transparent"
              onClick={() => navigate('/')}
            >
              PetShop
            </Button>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Button variant="ghost" onClick={() => navigate('/cart')}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost" onClick={() => navigate('/account')}>
                    <User className="mr-2 h-4 w-4" />
                    {user ? user.username : "Account"}
                  </Button>
                </NavigationMenuItem>
                {user?.isAdmin && (
                  <NavigationMenuItem>
                    <Button variant="ghost" onClick={() => navigate('/admin')}>
                      Admin
                    </Button>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 PetShop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
