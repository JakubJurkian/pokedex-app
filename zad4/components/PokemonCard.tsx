"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

interface PokemonCardProps {
  id: number;
  name: string;
  imgSrc: string;
  favorites: number[];
  toggleFavorite: (id: number) => void;
}

// Komponent serwerowy
export function PokemonCard({
  id,
  name,
  imgSrc,
  favorites,
  toggleFavorite,
}: PokemonCardProps) {
  const isFavorite = favorites.filter((FavId) => FavId === id).length === 1;

  const cardClasses =
    "linear-background-2 p-6 m-4 text-center w-[180px] cursor-pointer rounded-2xl relative overflow-hidden transition-all duration-300 ease-in-out " +
    "/* Custom Neumorphic Styling */" +
    "bg-gradient-to-br from-[#4a4848] to-[#3a3838] border-2 border-[#555] " +
    "shadow-[0_8px_20px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.1)] " +
    "/* Initial State for Animation (requires custom setup) */" +
    "opacity-0 animate-slideInScale " +
    "/* Hover Effects */" +
    "hover:translate-y-[-6px] hover:scale-102 " +
    "hover:shadow-[0_12px_28px_rgba(0,0,0,0.5),inset_0_3px_6px_rgba(255,255,255,0.15)] " +
    "hover:from-[#5a5858] hover:to-[#4a4848] hover:border-[#666] " +
    "/* Active Effect */" +
    "active:translate-y-[-3px] active:scale-101 " +
    "active:shadow-[0_8px_20px_rgba(0,0,0,0.45)]";

  return (
    <li className={cardClasses}>
      <Link href={`/pokemon/${id}`} className="block">
        <h3 className="capitalize text-lg font-semibold mb-3">{name}</h3>
        <div className="relative flex justify-center2">
          <img
            src={imgSrc}
            alt={name}
            width={126}
            className="transition-transform duration-300"
          />
        </div>
      </Link>
      <FavoriteButton
        id={id}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
      />
    </li>
  );
}
