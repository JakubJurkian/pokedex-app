// For elements like ability, stat, or type names
export interface NamedAPIResource {
  name: string;
  url: string;
}

// For abilities (which includes the resource and extra fields)
export interface PokemonAbility {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

// For stats (which includes the resource and base_stat)
export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

// For types
export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonDetails {
  id: number;
  name: string;
  base_experience: number | null;
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  types: PokemonType[];
  sprites: {
    front_default: string;
  };
  // The API returns many other properties, but these are the ones used in my components.
}

// The object structure in pokemonsArray (the list of all pokemons)
export interface PokemonListItem {
  name: string;
  url: string;
}

export type PokemonListArray = PokemonListItem[];

export type PokemonDetailsCache = {
  [key: string]: PokemonDetails; // key is the pokemon name (string), value is the detailed object
};

export type Favorites = number[];
