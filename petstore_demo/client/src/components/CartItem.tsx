import { Pet } from "db/schema";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface CartItemProps {
  item: Pet & { quantity: number };
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0 && newQuantity <= item.stock) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        
        <div className="flex-grow">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <p className="text-sm text-gray-600">
            {item.breed} {item.species}
          </p>
          <p className="font-bold mt-1">
            ${Number(item.price).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-24">
            <Input
              type="number"
              min="1"
              max={item.stock}
              value={item.quantity}
              onChange={handleQuantityChange}
              className="text-center"
            />
          </div>
          
          <div className="text-right">
            <p className="font-bold mb-2">
              ${(Number(item.price) * item.quantity).toFixed(2)}
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
