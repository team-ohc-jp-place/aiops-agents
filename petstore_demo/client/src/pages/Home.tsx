import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[#4A90E2]">
          Welcome to PawfectPets
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Find your perfect furry companion
        </p>
        <Link href="/shop">
          <Button size="lg" className="bg-[#F7A072] hover:bg-[#F78C5C]">
            Browse Pets
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Wide Selection</CardTitle>
            <CardDescription>Find the perfect pet for your home</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Browse through our carefully curated selection of pets, from playful
              puppies to gentle cats.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expert Care</CardTitle>
            <CardDescription>
              All pets receive top-quality veterinary care
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Every pet in our shop is thoroughly checked and cared for by licensed
              veterinarians.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>Lifetime guidance for pet parents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Get expert advice and support throughout your journey as a pet
              parent.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
