"use client";

interface Props {
  id: number;
  isFavorite: boolean;
  toggleFavorite: (id: number) => void;
}

function ToggleStarButton({ id, isFavorite, toggleFavorite }: Props) {

  const starIcon = isFavorite ? "★" : "☆";
  const buttonTitle = isFavorite ? "Click to Unmark" : "Click to Mark";

  const starStyle = {
    fontSize: "24px",
    cursor: "pointer",
    color: isFavorite ? "gold" : "gray",
    border: "none",
    background: "none",
    padding: "0",
    margin: "0",
  };

  return (
    <button onClick={() => toggleFavorite(id)} style={starStyle} title={buttonTitle}>
      {starIcon}
    </button>
  );
}

export default ToggleStarButton;
