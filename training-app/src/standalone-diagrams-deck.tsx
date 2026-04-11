 
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DiagramsDeckApp } from "./standalone-diagrams-deck/DiagramsDeckApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <DiagramsDeckApp />
    </ThemeProvider>
  </StrictMode>,
);
