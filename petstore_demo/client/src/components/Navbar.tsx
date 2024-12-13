import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { useCart } from "@/hooks/use-cart";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  const { user, logout } = useUser();
  const { items } = useCart();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-[#4A90E2]">
            PawfectPets
          </Link>

          <NavigationMenu>
            <NavigationMenuList className="flex items-center space-x-4">
              <NavigationMenuItem>
                <Link href="/shop">
                  <NavigationMenuLink className="cursor-pointer">
                    Shop
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link href="/cart">
                  <NavigationMenuLink className="cursor-pointer">
                    Cart ({items.length})
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {user ? (
                <>
                  <NavigationMenuItem>
                    <Link href="/profile">
                      <NavigationMenuLink className="cursor-pointer">
                        Profile
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  {user.isAdmin && (
                    <NavigationMenuItem>
                      <Link href="/admin">
                        <NavigationMenuLink className="cursor-pointer">
                          Admin
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => logout()}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button>Login</Button>
                </Link>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
