import Link from "next/link";
import { PokemonDetailsCache, PokemonListItem, PokemonDetails } from "@/types";
import { PokemonList } from "@/components/PokemonList";

// WAŻNE: Wymóg SSR - wymusza dynamiczne renderowanie dla każdego zapytania.
export const dynamic = "force-dynamic";

interface SearchPageProps {
  // searchParams są automatycznie dostarczane przez Next.js do komponentu serwerowego
  searchParams: {
    name?: string;
    type?: string;
  };
}

const POKEMON_TYPES = [
  "grass",
  "poison",
  "fire",
  "flying",
  "water",
  "bug",
  "normal",
  "electric",
  "ground",
  "fairy",
  "fighting",
  "psychic",
  "rock",
  "ice",
  "dragon",
  "steel",
  "ghost",
  "dark",
];

// Funkcja wykonująca całą logikę pobierania i filtrowania na serwerze
async function fetchAndFilterPokemons(searchName: string, searchType: string) {
  // Pobieramy szerszą listę Pokemonów (do 1000)
  const allPokemonRes = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=1000",
    { cache: "no-store" }
  );
  if (!allPokemonRes.ok) throw new Error("Failed to fetch full pokemon list");
  const data = await allPokemonRes.json();
  let pokemonsArray: PokemonListItem[] = data.results;

  const pokemonDetailsCache: PokemonDetailsCache = {};
  let filteredList: PokemonListItem[] = [];

  // Wstępne filtrowanie po nazwie, aby ograniczyć liczbę detali do pobrania
  if (searchName) {
    const searchTextLower = searchName.toLowerCase();
    pokemonsArray = pokemonsArray.filter((obj) =>
      obj.name.toLowerCase().includes(searchTextLower)
    );
  }

  // Jeśli nie ma nazwy i nie ma typu, nie filtrujemy, ale też nie chcemy pobierać 1000 detali
  const shouldFilter = searchName || searchType;

  if (shouldFilter) {
    // 1. Pobierz detale dla potencjalnych kandydatów
    const detailPromises = pokemonsArray.map(async (obj) => {
      // Użycie no-store zapewnia, że to jest fresh fetch (wymóg SSR)
      const resDetail = await fetch(obj.url, { cache: "no-store" });
      if (!resDetail.ok) return null;
      return (await resDetail.json()) as PokemonDetails;
    });

    const rawDetails = await Promise.all(detailPromises);

    // 2. Finalne filtrowanie po typie i budowanie cache
    rawDetails.forEach((detail) => {
      if (detail) {
        pokemonDetailsCache[detail.name] = detail;

        const types = detail.types.map((t) => t.type.name);

        // Filtr typów: jeśli podano typ, Pokemon musi go posiadać
        if (searchType && !types.includes(searchType)) {
          return; // Pomijamy, jeśli nie pasuje do typu
        }

        filteredList.push({
          name: detail.name,
          url: `https://pokeapi.co/api/v2/pokemon/${detail.id}`,
        });
      }
    });
  } else {
    // Brak filtrów (tylko wyświetlamy pierwsze 50 dla estetyki)
    filteredList = pokemonsArray.slice(0, 50);
    // W tym przypadku musimy pobrać detale dla tych 50, aby PokemonList mógł działać
    const initial50Promises = filteredList.map(async (obj) => {
      const resDetail = await fetch(obj.url, { cache: "no-store" });
      if (!resDetail.ok) return null;
      return (await resDetail.json()) as PokemonDetails;
    });

    const initialDetails = await Promise.all(initial50Promises);
    initialDetails.forEach((detail) => {
      if (detail) pokemonDetailsCache[detail.name] = detail;
    });
  }

  return { filteredList, pokemonDetailsCache };
}

// Główny Komponent Strony (SSR)
export default async function SearchPage({ searchParams }: SearchPageProps) {
  // In Next.js searchParams can be a Promise in the app router — await it first
  const sp = await (searchParams as unknown as Promise<
    { name?: string; type?: string } | { name?: string; type?: string }
  >);
  const searchName = (sp?.name ?? "").toLowerCase().trim();
  const searchType = (sp?.type ?? "").toLowerCase().trim();

  // Wymóg: Timestamp renderowania
  const timestamp = new Date().toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  let resultsList: PokemonListItem[] = [];
  let detailsCache: PokemonDetailsCache = {};
  let error = "";

  try {
    // Wykonaj filtrowanie na serwerze (synchronizacja z searchParams)
    ({ filteredList: resultsList, pokemonDetailsCache: detailsCache } =
      await fetchAndFilterPokemons(searchName, searchType));
  } catch (e) {
    console.error("Search error:", e);
    error = "Wystąpił błąd podczas pobierania danych.";
  }

 
  const h1Classes = "text-4xl font-bold mb-4";
  const formClasses =
    "w-full max-w-xl p-6 bg-gray-800 rounded-xl shadow-2xl mb-8 border border-gray-700";

  return (
    <main className="flex flex-col items-center w-full max-w-7xl px-4 py-8">
      <h1 className={h1Classes}>Search (SSR)</h1>

      <p className="text-sm text-gray-400 mb-6 p-2 bg-gray-800 rounded-lg">
        Rendered on the server (SSR) at: **{timestamp}**
      </p>

      <Link
        href="/"
        className="mb-6 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Go back (SSG)
      </Link>

      <form action="/search" method="GET" className={formClasses}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name" // Kluczowe dla searchParams
            defaultValue={searchName}
            placeholder="e.g. bulbasaur"
            className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Type
          </label>
          <select
            id="type"
            name="type" // Kluczowe dla searchParams
            defaultValue={searchType}
            className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-yellow-500 focus:border-yellow-500 capitalize"
          >
            <option value="">-- All Types --</option>
            {POKEMON_TYPES.map((type) => (
              <option key={type} value={type} className="capitalize">
                {type}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-300"
        >
          Search
        </button>
      </form>

      <section className="w-full">
        {error && <p className="text-red-500 text-center text-lg">{error}</p>}

        {!error && searchName === "" && searchType === "" && (
          <p className="text-gray-400 text-center text-lg mt-5">
            Type a name or select a type to start searching.
            Displaying the default list of 50 Pokémon:
          </p>
        )}

        {!error &&
        (searchName !== "" || searchType !== "") &&
        resultsList.length === 0 ? (
          <p className="text-xl text-center text-red-400 mt-5">
            Did not find pokemons matching search criteria.
          </p>
        ) : (
          <PokemonList pokemons={resultsList} detailsCache={detailsCache} />
        )}
      </section>
    </main>
  );
}
