export default function PokemonCard({ name, img}: { name: string; img: string }) {
  return (
    <li
      className="pokemon-list-element"
      key={name}
      onClick={() => {
        //   selectedPokemonName = obj.name;
        //   currentView = "details";
        //   renderApp();
      }}
    >
      <h3>{name}</h3>
      <Image src={img} alt={name} />
    </li>
  );
}