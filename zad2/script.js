let pokemonsArray = [];
const pokemonDetailsCache = {};
let isLoading = false;
let isDataLoaded = false;
let currentView = "list"; // 'list' lub 'details'
let selectedPokemonName = null;
let globalFilteredArray = null;

const GetPokemonInfoJSX = ({ pokemonName }) => {
  const pokemon = pokemonDetailsCache[pokemonName];

  console.log(pokemon);
  return (
    <section className="pokemon-details">
      <h1>{pokemonName}</h1>
      <img
        src={pokemonDetailsCache[pokemonName].sprites.front_default}
        alt="..."
      />
      <dl>
        <CreateDLListItem
          property={"Type:"}
          value={pokemon.types.map((type) => type.type.name).join(", ")}
        />
        <CreateDLListItem
          property={"Height:"}
          value={`${pokemon.height * 10} cm`}
        />
        <CreateDLListItem
          property={"Weight:"}
          value={`${pokemon.weight / 10} kg`}
        />
        <CreateDLListItem
          isBar
          property={"Base Exp:"}
          value={pokemon.base_experience || "Unknown"}
        />
      </dl>
      <dl className="stats">
        {pokemon.stats.map((stat) => {
          return (
            <CreateDLListItem
              isBar
              key={stat.stat.name}
              property={`${stat.stat.name.replace("-", " ")}:`}
              value={stat.base_stat}
            />
          );
        })}
      </dl>
      <dl className="abilities">
        <CreateDLListItem
          property={"Abilities:"}
          value={pokemon.abilities
            .filter((ability) => {
              return !ability.is_hidden;
            })
            .map((ability) => ability.ability.name)
            .join(", ")}
        />
        <CreateDLListItem property={"ID:"} value={pokemon.id} />
      </dl>
      <dl className="hidden-abilities">
        <CreateDLListItem
          property={"Hidden Abilities:"}
          value={pokemon.abilities
            .filter((ability) => {
              return ability.is_hidden;
            })
            .map((ability) => ability.ability.name)
            .join(", ")}
        />
      </dl>

      <button
        className="back-btn"
        onClick={() => {
          currentView = "list";
          selectedPokemonName = null;
          renderApp();
        }}
      >
        Back
      </button>
    </section>
  );
};

const CreateDLListItem = ({ property, value, isBar }) => {
  let backgroundColor = null;
  if (isBar) {
    if (value < 50) backgroundColor = "red";
    else if (value < 75) backgroundColor = "yellow";
    else backgroundColor = "green";
  }
  return (
    <>
      <dt>{property}</dt>
      {isBar && (
        <dd>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${value}%`, backgroundColor: backgroundColor }}
            >
              <span className="progress-value">{value}</span>
            </div>
          </div>
        </dd>
      )}
      {!isBar && <dd>{value}</dd>}
    </>
  );
};

const RenderListJSX = ({ arr }) => {
  return (
    <>
      {arr.length === 0 && <p>Nie znaleziono pokemona :/</p>}
      {arr.slice(0, 50).map((obj) => {
        return (
          <>
            <li
              className="pokemon-list-element"
              key={obj.id}
              onClick={() => {
                selectedPokemonName = obj.name;
                currentView = "details";
                renderApp();
              }}
            >
              <h3>{obj.name}</h3>
              <img src={pokemonDetailsCache[obj.name].sprites.front_default} />
            </li>
          </>
        );
      })}
    </>
  );
};

const fetchPokemons = async () => {
  isLoading = true;
  renderApp(); //wymuszamy renderowanie, aby pokazać ładowanie

  try {
    const res = await fetch("https://pokeapi.co//api/v2/pokemon?limit=1302");
    const parsed = await res.json();
    pokemonsArray = parsed.results;
    console.log(parsed.results);

    const detailPromises = pokemonsArray.map(async (obj) => {
      const resDetail = await fetch(obj.url);
      const parsedDetail = await resDetail.json();
      pokemonDetailsCache[obj.name] = parsedDetail;
    });
    await Promise.all(detailPromises);
    isDataLoaded = true;
  } catch (err) {
    console.error("Błąd pobierania:", err);
  } finally {
    isLoading = false;
    renderApp();
  }
};

const onInputChangeHandler = (event) => {
  if (isLoading) return;

  const searchText = event.target.value.toLowerCase();
  const filteredArr = pokemonsArray.filter((obj) => {
    const isId = /^\d/.test(searchText);
    if (isId) return searchText == pokemonDetailsCache[obj.name].id;
    else return obj.name.toLowerCase().startsWith(searchText);
  });

  globalFilteredArray = filteredArr;
  renderApp();
};

const MainPageJSX = ({ fromDetails = false }) => {
  if (!fromDetails && !isDataLoaded && !isLoading) fetchPokemons();

  let content;
  if (isLoading) {
    content = <p>Trwa pobieranie danych...</p>;
  } else if (currentView === "details" && selectedPokemonName) {
    content = <GetPokemonInfoJSX pokemonName={selectedPokemonName} />;
  } else {
    // Użyj listy filtrowanej (jeśli istnieje) lub pełnej
    const arrToRender = globalFilteredArray || pokemonsArray;
    content = isDataLoaded ? <RenderListJSX arr={arrToRender} /> : null;
  }

  return (
    <>
      <h1 className="main-page-h1">POKEDEX</h1>
      <input
        className="pokemon-search"
        placeholder="Wyszukaj pokemona"
        onChange={onInputChangeHandler}
      ></input>
      <section>
        <ol className="pokemon-list">{content}</ol>
      </section>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
const renderApp = () => {
  // Renderuje główny komponent, który sam zdecyduje, co pokazać
  root.render(<MainPageJSX />);
};
renderApp();
