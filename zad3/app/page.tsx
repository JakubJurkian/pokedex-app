import PokemonList from "../components/PokemonList";

export default function HomePage() {
  let pokemonsArray: { url: string | URL | Request; name: string }[] = [];
  const pokemonDetailsCache: Record<string, unknown> = {};

  const fetchPokemons = async () => {
    try {
      const res = await fetch("https://pokeapi.co//api/v2/pokemon?limit=50");
      const parsed = await res.json();
      // eslint-disable-next-line react-hooks/immutability
      pokemonsArray = parsed.results;
      console.log(parsed.results);

      const detailPromises = pokemonsArray.map(
        async (obj: { url: string | URL | Request; name: string | number }) => {
          const resDetail = await fetch(obj.url);
          const parsedDetail = await resDetail.json();
          pokemonDetailsCache[String(obj.name)] = parsedDetail;
        }
      );
      await Promise.all(detailPromises);
    } catch (err) {
      console.error("Błąd pobierania:", err);
    }
  };

  fetchPokemons();

  return (
    <>
      <h1 className="main-page-h1">POKEDEX</h1>
      <section>
        <ol className="pokemon-list">
          <PokemonList arr={pokemonsArray} />
        </ol>
      </section>
    </>
  );
}
