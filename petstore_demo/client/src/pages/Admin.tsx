import { useUser } from "@/hooks/use-user";
import { Pet } from "db/schema";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR, { mutate } from "swr";

const petSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.string().min(1, "Species is required"),
  breed: z.string().min(1, "Breed is required"),
  age: z.number().min(0, "Age must be positive"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  stock: z.number().min(0, "Stock must be positive"),
});

export function Admin() {
  const { user } = useUser();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { data: pets, error } = useSWR<Pet[]>("/api/pets");
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const form = useForm<z.infer<typeof petSchema>>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      age: 0,
      price: 0,
      description: "",
      imageUrl: "",
      stock: 0,
    },
  });

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      toast({
        title: "Unauthorized",
        description: "You must be an admin to access this page",
        variant: "destructive",
      });
    }
  }, [user, navigate, toast]);

  useEffect(() => {
    if (editingPet) {
      form.reset({
        ...editingPet,
        price: Number(editingPet.price), // `price` を数値に変換
      });
    }
  }, [editingPet, form]);

  const onSubmit = async (values: z.infer<typeof petSchema>) => {
    try {
      const response = await fetch(
        editingPet ? `/api/pets/${editingPet.id}` : "/api/pets",
        {
          method: editingPet ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) throw new Error("Failed to save pet");

      toast({
        title: "Success",
        description: `Pet ${editingPet ? "updated" : "created"} successfully`,
      });

      mutate("/api/pets");
      form.reset();
      setEditingPet(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save pet",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/pets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete pet");

      toast({
        title: "Success",
        description: "Pet deleted successfully",
      });

      mutate("/api/pets");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete pet",
        variant: "destructive",
      });
    }
  };

  if (!user?.isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {editingPet ? "Edit Pet" : "Add New Pet"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="species"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Species</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breed</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                {editingPet && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingPet(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {editingPet ? "Update" : "Add"} Pet
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Current Inventory</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets?.map((pet) => (
          <Card key={pet.id}>
            <CardContent className="p-4">
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold">{pet.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {pet.breed} {pet.species}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold">${pet.price}</span>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPet(pet)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(pet.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
