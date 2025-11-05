"use client"; // WAŻNE: To deklaruje komponent kliencki

import React from "react";

interface ToggleButtonProps {
  id: string; // Unikalne ID dla kontenera zawartości
  initialText: string;
  toggleText: string;
  children: React.ReactNode;
}

const handleToggle = (
  contentId: string,
  buttonElement: HTMLButtonElement,
  initialText: string,
  toggleText: string
) => {
  const contentElement = document.getElementById(contentId);

  if (contentElement) {
    const isHidden =
      contentElement.style.display === "none" ||
      contentElement.style.display === "";
    contentElement.style.display = isHidden ? "block" : "none";

    buttonElement.textContent = isHidden ? toggleText : initialText;
  }
};

export function ToggleButton({
  id,
  initialText,
  toggleText,
  children,
}: ToggleButtonProps) {

  const buttonClasses =
    "mt-4 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300";
  const contentWrapperClasses =
    "border border-purple-500 rounded-md p-4 mt-2 bg-purple-900 bg-opacity-20";

  return (
    <div>
      <button
        className={buttonClasses}
        // Używamy funkcji anonimowej w onClick, aby przekazać argumenty,
        // w tym referencję do samego przycisku (e.currentTarget)
        onClick={(e) =>
          handleToggle(
            id,
            e.currentTarget, // Referencja do elementu <button>
            initialText,
            toggleText
          )
        }
      >
        {initialText}
      </button>

      {/* Kontener na dzieci, którego widoczność będzie przełączana */}
      <div
        id={id}
        className={contentWrapperClasses}
        style={{ display: "none" }}
      >
        {children}
      </div>
    </div>
  );
}
