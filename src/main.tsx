import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { applyTheme } from "./Theme/Theme.ts";
import React from "react";
import { BrowserRouter } from "react-router-dom";

applyTheme();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
