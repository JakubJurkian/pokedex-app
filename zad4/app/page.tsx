"use client";

import { PokemonDetailsCache, PokemonListItem } from "@/types";
import { PokemonList } from "../components/PokemonList";
import { useEffect, useState } from "react";
import FavoritesCounter from "@/components/FavoritesCounter";

async function fetchInitialPokemonList(): Promise<PokemonListItem[]> {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=50";
  const res = await fetch(url, { cache: "force-cache" }); // Użycie domyślnego cache Next.js dla SSG
  if (!res.ok) throw new Error("Failed to fetch initial list");
  const data = await res.json();
  return data.results;
}

export default function HomePage() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [pokemonDetailsCache, setPokemonDetailsCache] =
    useState<PokemonDetailsCache>({});

  const toggleFavorite = (pokemonId: number) => {
    if (favorites.includes(pokemonId)) {
      setFavorites((prev) => prev.filter((id) => id !== pokemonId));
    } else {
      if (favorites.length === 12) {
        alert("You can't have more than 12 favorite pokemons!");
        return;
      }
      setFavorites((prev) => [...prev, pokemonId]);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const pokemonsArray = await fetchInitialPokemonList();
      setPokemonList(pokemonsArray);

      const detailPromises = pokemonsArray.map(async (obj) => {
        const resDetail = await fetch(obj.url, { cache: "force-cache" });
        if (!resDetail.ok) return null;
        return await resDetail.json();
      });

      const rawDetails = await Promise.all(detailPromises);
      const pokemonDetailsCache: PokemonDetailsCache = {};

      rawDetails.forEach((detail) => {
        if (detail && detail.name) {
          pokemonDetailsCache[detail.name] = detail;
          setPokemonDetailsCache((prev) => {
            return { ...prev, [detail.name]: detail };
          });
        }
      });
    }
    fetchData();
  }, []);

  return (
    <>
      <FavoritesCounter count={favorites.length} />
      <section>
        <PokemonList
          pokemons={pokemonList}
          detailsCache={pokemonDetailsCache}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      </section>
    </>
  );
}
