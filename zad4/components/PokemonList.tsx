"use client";

import type { PokemonDetailsCache, PokemonListArray } from "@/types";
import { PokemonCard } from "./PokemonCard";

interface PokemonListProps {
  pokemons: PokemonListArray;
  detailsCache: PokemonDetailsCache;
  favorites: number[];
  toggleFavorite: (id: number) => void;
}

// Komponent serwerowy (domyślnie w Next.js App Router)
export function PokemonList({
  pokemons,
  detailsCache,
  favorites,
  toggleFavorite,
}: PokemonListProps) {
  const listClasses =
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 list-none";

  return (
    <ol className={listClasses}>
      {pokemons.map((obj) => {
        const details = detailsCache[obj.name];

        if (!details) return null;

        return (
          <PokemonCard
            key={details.id}
            id={details.id}
            name={obj.name}
            imgSrc={details.sprites.front_default}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        );
      })}
      {pokemons.length === 0 && (
        <p className="col-span-full text-center text-xl mt-10">
          Nie znaleziono pokemona :/
        </p>
      )}
    </ol>
  );
}
