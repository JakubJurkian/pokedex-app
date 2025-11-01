export default function Search() {
  return (
    <>
      <div className="type-filters">
        {POKEMON_TYPES.map((type) => {
          return (
            <button
              key={type}
              className={`type-btn ${selectedTypes.has(type) ? "checked" : ""}`}
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
        value={currentSearchText}
      ></input>
    </>
  );
}
