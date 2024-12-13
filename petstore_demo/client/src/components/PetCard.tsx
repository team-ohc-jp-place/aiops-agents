import { Link } from "wouter";
import { Pet } from "db/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();  // Prevent navigation when clicking the button
    addToCart(pet);
    toast({
      title: "Added to cart",
      description: `${pet.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="aspect-square overflow-hidden">
        <img
          src={pet.imageUrl}
          alt={pet.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <Link href={`/pet/${pet.id}`} className="hover:underline">
            {pet.name}
          </Link>
          <Badge variant="secondary">
            {pet.species}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{pet.breed}</p>
        <p className="text-sm text-gray-600">Age: {pet.age} years</p>
        <p className="mt-2 text-lg font-bold">${Number(pet.price).toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={pet.stock === 0}
        >
          {pet.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
