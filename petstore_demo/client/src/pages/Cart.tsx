import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/components/CartItem";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useLocation } from "wouter";

export function Cart() {
  const { items, total, clearCart } = useCart();
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to checkout",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      // Format items properly for the API
      const orderItems = items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price)
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: orderItems }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Checkout failed");
      }

      clearCart();
      toast({
        title: "Order placed!",
        description: "Thank you for your purchase",
      });
      navigate("/profile");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">Shopping Cart</h2>
      
      <div className="grid gap-6 mb-8">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xl font-bold">
          Total: ${total.toFixed(2)}
        </div>
        <div className="space-x-4">
          <Button variant="outline" onClick={clearCart}>
            Clear Cart
          </Button>
          <Button 
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Checkout"}
          </Button>
        </div>
      </div>
    </div>
  );
}
