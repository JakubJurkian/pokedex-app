import { PokemonDetailsCache, PokemonListItem } from "@/types";
import { PokemonList } from "../components/PokemonList";

async function fetchInitialPokemonList(): Promise<PokemonListItem[]> {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=50";
  const res = await fetch(url, { cache: "force-cache" }); // Użycie domyślnego cache Next.js dla SSG
  if (!res.ok) throw new Error("Failed to fetch initial list");
  const data = await res.json();
  return data.results;
}

export default async function HomePage() {
  const pokemonsArray = await fetchInitialPokemonList();

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
    }
  });

  return (
    <>
      <a
        href="/search"
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
      >
        Go to Search (SSR)
      </a>
      <section>
        <PokemonList
          pokemons={pokemonsArray}
          detailsCache={pokemonDetailsCache}
        />
      </section>
    </>
  );
}
