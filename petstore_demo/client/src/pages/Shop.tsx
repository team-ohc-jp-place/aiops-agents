import { useEffect } from "react";
import useSWR from "swr";
import { Pet } from "db/schema";
import { PetCard } from "@/components/PetCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function Shop() {
  const { data: pets, error } = useSWR<Pet[]>("/api/pets");
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("all");

  const filteredPets = pets?.filter((pet) => {
    const matchesSearch = pet.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesSpecies =
      species === "all" || pet.species.toLowerCase() === species;
    return matchesSearch && matchesSpecies;
  });

  if (error) return <div>Failed to load pets</div>;
  if (!pets) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Search pets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select species" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Species</SelectItem>
            <SelectItem value="dog">Dogs</SelectItem>
            <SelectItem value="cat">Cats</SelectItem>
            <SelectItem value="bird">Birds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPets?.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
}
