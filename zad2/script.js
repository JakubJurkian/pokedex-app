let pokemonsArray = [];
const pokemonDetailsCache = {};
let isLoading = false;
let isDataLoaded = false;
let currentView = "list"; // 'list' lub 'details'
let currentComponentView = "jsx"; // 'jsx' lub 'createElement'
let selectedPokemonName = null;
let globalFilteredArray = null;
let selectedTypes = new Set();

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

// Component responsible for rendering pokemon details
const RenderPokemonInfo = ({ pokemonName }) => {
  const pokemon = pokemonDetailsCache[pokemonName];
  console.log(pokemon);

  const hiddenAbilities = pokemon.abilities
    .filter((ability) => ability.is_hidden)
    .map((ability) => ability.ability.name)
    .join(", ");

  return (
    <section className="pokemon-details">
      <h1>{pokemonName}</h1>
      <img
        src={pokemonDetailsCache[pokemonName].sprites.front_default}
        alt={pokemonName}
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
        <CreateDLListItem
          property={"Sum of all stats:"}
          value={pokemon.stats.reduce((acc, currVal) => {
            return acc + currVal.base_stat;
          }, 0)}
        />
      </dl>
      <dl className="abilities">
        <CreateDLListItem
          property={"Abilities:"}
          value={pokemon.abilities
            .filter((ability) => !ability.is_hidden)
            .map((ability) => ability.ability.name)
            .join(", ")}
        />
        <CreateDLListItem property={"ID:"} value={pokemon.id} />
      </dl>

      {hiddenAbilities.length > 0 && (
        <dl className="hidden-abilities">
          <CreateDLListItem
            property={"Hidden Abilities:"}
            value={pokemon.abilities
              .filter((ability) => ability.is_hidden)
              .map((ability) => ability.ability.name)
              .join(", ")}
          />
        </dl>
      )}

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
      <button
        className="btn"
        onClick={() => {
          currentComponentView =
            currentComponentView === "jsx" ? "createElement" : "jsx";
          renderApp();
        }}
      >
        Change to {currentComponentView === "jsx" ? "createElement" : "jsx"}
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
              style={{
                width: `${value / 2}%`,
                backgroundColor: backgroundColor,
              }}
            ></div>
            <span className="progress-value">{value}</span>
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
          <li
            className="pokemon-list-element"
            key={obj.name}
            onClick={() => {
              selectedPokemonName = obj.name;
              currentView = "details";
              renderApp();
            }}
          >
            <h3>{obj.name}</h3>
            <img src={pokemonDetailsCache[obj.name].sprites.front_default} />
          </li>
        );
      })}
    </>
  );
};

// Creating RenderList component using React.CreateElement syntax
const RenderListReactCreateElement = ({ arr }) => {
  return React.createElement(
    React.Fragment,
    null,
    arr.length === 0
      ? React.createElement("p", null, "Nie znaleziono pokemona :/")
      : null,
    arr.slice(0, 50).map((obj) =>
      React.createElement(
        "li",
        {
          className: "pokemon-list-element",
          key: obj.name,
          onClick: () => {
            selectedPokemonName = obj.name;
            currentView = "details";
            renderApp();
          },
        },
        React.createElement("h3", null, obj.name),
        React.createElement("img", {
          src: pokemonDetailsCache[obj.name].sprites.front_default,
        })
      )
    )
  );
};

// fetching data (pokemons) from the API
const fetchPokemons = async () => {
  isLoading = true;
  renderApp();

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

const filterByType = (pokemonType) => {
  // Toggle selection
  if (selectedTypes.has(pokemonType)) selectedTypes.delete(pokemonType);
  else selectedTypes.add(pokemonType);

  const typesSetToArr = Array.from(selectedTypes);
  // Keep only pokemons whose cached details include ALL required types
  globalFilteredArray = (globalFilteredArray || pokemonsArray).filter((obj) => {
    const details = pokemonDetailsCache[obj.name];
    const types = details.types.map((t) => t.type.name);
    // require every selected type to be included
    return typesSetToArr.every((r) => types.includes(r));
  });

  renderApp();
};

const MainPage = () => {
  let content, input;
  if (isLoading) {
    content = <p>Trwa pobieranie danych...</p>;
  } else if (currentView === "details" && selectedPokemonName) {
    input = null;
    content = <RenderPokemonInfo pokemonName={selectedPokemonName} />;
  } else {
    input = (
      <>
        <div className="type-filters">
          {POKEMON_TYPES.map((type) => {
            return (
              <button
                key={type}
                className={`type-btn ${
                  selectedTypes.has(type) ? "checked" : ""
                }`}
                onClick={() => {
                  filterByType(type);
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
        <input
          className="pokemon-search"
          placeholder="Wyszukaj pokemona"
          onChange={onInputChangeHandler}
        ></input>
      </>
    );
    // Use filtered list (if exists) or original one
    const arrToRender = globalFilteredArray || pokemonsArray;
    content = isDataLoaded ? (
      currentComponentView === "jsx" ? (
        <RenderListJSX arr={arrToRender} />
      ) : (
        <RenderListReactCreateElement arr={arrToRender} />
      )
    ) : null;
  }

  return (
    <>
      <h1 className="main-page-h1">POKEDEX</h1>
      {input}
      <section>
        <ol className="pokemon-list">{content}</ol>
      </section>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
const renderApp = () => {
  // Renders the main component to update the UI
  root.render(<MainPage />);
};

fetchPokemons();
