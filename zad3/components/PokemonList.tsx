import PokemonCard from "./PokemonCard";

type Pokemon = { name: string };

export default function PokemonList({ arr }: { arr: Pokemon[] }) {
  return (
    <>
      {arr.length === 0 && <p>Nie znaleziono pokemona :/</p>}
      {arr.map((obj: Pokemon) => {
        return (
          <PokemonCard
            key={obj.name}
            name={obj.name}
            img={pokemonDetailsCache[obj.name].sprites.front_default}
          />
        );
      })}
    </>
  );
}
