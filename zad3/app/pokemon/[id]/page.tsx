import type { PokemonDetails } from "@/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ToggleButton } from "@/components/ToggleButton";
import Image from "next/image";
import DLListItem from "@/components/DLListItem";

// 1. Fetching Details for SSG
async function getPokemonDetails(id: string): Promise<PokemonDetails | null> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
    cache: "force-cache",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function PokemonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await params;
  const pokemonId = res.id;

  const pokemon = await getPokemonDetails(pokemonId);

  if (!pokemon) {
    notFound();
  }

  const types = pokemon.types.map((t) => t.type.name).join(", ");
  const abilities = pokemon.abilities
    .filter((a) => !a.is_hidden)
    .map((a) => a.ability.name)
    .join(", ");
  const hiddenAbilities = pokemon.abilities
    .filter((a) => a.is_hidden)
    .map((a) => a.ability.name)
    .join(", ");
  const sumOfStats = pokemon.stats.reduce(
    (acc, curr) => acc + curr.base_stat,
    0
  );

  const detailsClasses =
    "p-8 mx-auto my-5 w-full max-w-lg linear-background-2 border-2 border-gray-600 rounded-xl shadow-2xl text-center transform scale-100 opacity-100 transition duration-400";

  return (
    <div className={detailsClasses}>
      <h1 className="capitalize text-4xl font-extrabold mb-4">
        {pokemon.name}
      </h1>

      <div className="relative w-40 h-40 mx-auto my-4 rounded-full pokemon-details-img-bg p-3 shadow-lg hover:scale-[1.05] transition duration-300">
        <Image
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          width={160}
          height={160}
          priority
          className="rounded-full"
        />
      </div>

      <dl className="grid grid-cols-2 gap-x-5 gap-y-3 p-4 bg-black/20 rounded-lg my-4">
        <DLListItem property="Type:" value={types} />
        <DLListItem
          property="Height:"
          value={`${Math.round(pokemon.height * 10)} cm`}
        />
        <DLListItem
          property="Weight:"
          value={`${Number((pokemon.weight / 10).toFixed(1))} kg`}
        />
        <DLListItem
          property="Base Exp:"
          value={pokemon.base_experience ?? "Unknown"}
        />
      </dl>

      <dl className="stats bg-linear-to-br from-yellow-50/5 to-orange-50/5 border border-yellow-400/10 rounded-lg p-4 my-4 grid grid-cols-2 gap-3">
        {pokemon.stats.map((stat) => (
          <DLListItem
            key={stat.stat.name}
            isBar
            property={`${stat.stat.name.replace("-", " ")}:`}
            value={stat.base_stat}
          />
        ))}

        <DLListItem property={"Sum of all stats:"} value={sumOfStats} />
      </dl>

      <dl className="abilities bg-linear-to-br from-pink-600/10 to-red-600/10 border border-red-500/20 rounded-lg p-4 my-4 grid grid-cols-2 gap-3">
        <DLListItem property={"Abilities:"} value={abilities || "Brak"} />
        <DLListItem property={"ID:"} value={pokemon.id} />
      </dl>

      {hiddenAbilities.length > 0 && (
        <dl className="hidden-abilities bg-linear-to-br from-gray-600/10 to-purple-600/10 border border-gray-700/20 rounded-lg p-4 my-4 grid grid-cols-2 gap-3">
          <DLListItem
            property={"Base Experience:"}
            value={pokemon.base_experience ?? "Unknown"}
          />
        </dl>
      )}

      <ToggleButton
        id={`toggle-info-${pokemon.id}`}
        initialText="Show extra informations"
        toggleText="Hide extra informations"
      >
        <dl className="p-4 bg-gray-900/50 rounded-lg mt-4 text-sm text-gray-300 grid grid-cols-2 gap-3">
          <DLListItem property="hidden abilities:" value={hiddenAbilities} />
        </dl>
      </ToggleButton>

      <Link
        href="/"
        className="inline-block mt-8 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
      >
        Go Back
      </Link>
    </div>
  );
}
