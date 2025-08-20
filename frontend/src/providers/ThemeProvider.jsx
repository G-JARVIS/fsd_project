import { createContext, useContext, useEffect, useState } from "react";

// Create the context
const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  const [palette, setPalette] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("palette") || "aurora";
    }
    return "aurora";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Apply theme
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Apply palette
    root.setAttribute("data-theme", palette);

    // Store in localStorage
    localStorage.setItem("theme", theme);
    localStorage.setItem("palette", palette);
  }, [theme, palette]);

  const value = {
    theme,
    palette,
    setTheme,
    setPalette,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
