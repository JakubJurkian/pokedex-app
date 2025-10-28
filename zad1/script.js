const container = document.getElementById("container");

let pokemonsArray = [];
const pokemonDetailsCache = {};
let isLoading = false;

const renderList = (arr, pokemonList) => {
  pokemonList.innerHTML = "";
  if (arr.length === 0) {
    const p = document.createElement("p");
    p.textContent = "Nie znaleziono pokemona :/";
    pokemonList.append(p);
    return;
  }

  const limitedArr = arr.slice(0, 20);

  const listElements = limitedArr.map((obj) => {
    const el = document.createElement("li");
    el.classList.add("pokemon-list-element");
    const h3 = document.createElement("h3");
    const img = document.createElement("img");

    h3.textContent = obj.name;
    img.src = pokemonDetailsCache[obj.name].sprites.front_default;

    el.append(h3, img);
    el.addEventListener("click", () => {
      getPokemonInfo(obj.name);
    });

    return el;
  });

  pokemonList.append(...listElements);
};

const fetchPokemons = async (pokemonSection, pokemonList) => {
  const p = document.createElement("p");
  p.textContent = "Trwa pobieranie danych...";
  try {
    isLoading = true;
    pokemonSection.append(p);
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
    renderList(pokemonsArray, pokemonList);
  } catch (err) {
    console.log(err.message);
    const p = document.createElement("p");
    p.textContent = "Nie udało się pobrać danych.";
    pokemonList.append(p);
  }
  isLoading = false;
  pokemonSection.removeChild(p);
};

const mainPage = (fromDetails) => {
  container.innerHTML = "";
  const pokemonSection = document.createElement("section");
  const pokemonSearch = document.createElement("input");
  const pokemonList = document.createElement("ol");
  const h1 = document.createElement("h1");
  h1.textContent = "POKEDEX";
  h1.classList.add("main-page-h1");

  pokemonSearch.placeholder = "Wyszukaj pokemona";
  pokemonList.classList.add("pokemon-list");
  pokemonSearch.classList.add("pokemon-search");

  pokemonSection.append(pokemonList);
  container.append(h1);
  container.append(pokemonSearch);
  container.append(pokemonSection);

  if (!fromDetails) {
    fetchPokemons(pokemonSection, pokemonList);
  } else renderList(pokemonsArray, pokemonList);

  pokemonSearch.addEventListener("input", (e) => {
    if (isLoading) return;
    const searchText = e.target.value.toLowerCase();
    const filteredArr = pokemonsArray.filter((obj) =>
      obj.name.toLowerCase().startsWith(searchText)
    );
    renderList(filteredArr, pokemonList);
  });
};

mainPage(false);

const getPokemonInfo = (pokemonName) => {
  container.innerHTML = "";
  const section = document.createElement("section");
  const h1 = document.createElement("h1");
  const img = document.createElement("img");
  section.classList.add("pokemon-details");
  h1.textContent = pokemonName;
  img.src = pokemonDetailsCache[pokemonName].sprites.front_default;

  const pokemon = pokemonDetailsCache[pokemonName];

  const basicDl = document.createElement("dl");

  const types = pokemon.types.map((type) => type.type.name).join(", ");
  basicDl.append(...createDLListItem("Type:", types));

  basicDl.append(...createDLListItem("Height:", `${pokemon.height * 10} cm`));
  basicDl.append(...createDLListItem("Weight:", `${pokemon.weight / 10} kg`));
  basicDl.append(
    ...createDLListItem("Base Exp:", pokemon.base_experience || "Unknown")
  );

  const statsDl = document.createElement("dl");
  statsDl.classList.add("stats");

  pokemon.stats.forEach((stat) => {
    const statName = stat.stat.name.replace("-", " ");
    statsDl.append(...createDLListItem(`${statName}:`, stat.base_stat));
  });

  const abilitiesDl = document.createElement("dl");
  abilitiesDl.classList.add("abilities");

  const abilities = pokemon.abilities
    .map((ability) => ability.ability.name)
    .join(", ");
  abilitiesDl.append(...createDLListItem("Abilities:", abilities));

  abilitiesDl.append(...createDLListItem("ID:", `#${pokemon.id}`));

  section.append(h1, img, basicDl, statsDl, abilitiesDl);
  container.append(section);

  const btn = document.createElement("button");
  btn.addEventListener("click", () => {
    mainPage(true);
  });
  btn.textContent = "Back";
  btn.classList.add("back-btn");
  container.append(btn);
};

const createDLListItem = (property, value) => {
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = property;
  dd.textContent = value;
  return [dt, dd];
};
