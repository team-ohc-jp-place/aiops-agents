import { useParams } from "wouter";
import useSWR from "swr";
import { Pet } from "db/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: pet, error } = useSWR<Pet>(`/api/pets/${id}`);
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (error) return <div>Failed to load pet details</div>;
  if (!pet) return <div>Loading...</div>;

  const handleAddToCart = () => {
    addToCart(pet);
    toast({
      title: "Added to cart",
      description: `${pet.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden">
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{pet.name}</h1>
          <p className="text-xl mb-2">
            {pet.breed} {pet.species}
          </p>
          <p className="text-lg mb-4">Age: {pet.age} years</p>
          <p className="text-2xl font-bold mb-6">${pet.price}</p>
          <p className="mb-8">{pet.description}</p>

          <Button
            onClick={handleAddToCart}
            disabled={pet.stock === 0}
            className="w-full md:w-auto"
          >
            {pet.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
