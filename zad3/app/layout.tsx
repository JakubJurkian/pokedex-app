import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center">
        <h1 className="m-7 text-5xl rounded-sm p-2 tracking-wide linear-background">
          POKEDEX
        </h1>
        {children}
      </body>
    </html>
  );
}
