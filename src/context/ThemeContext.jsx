import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem("theme", "light");
    root.classList.remove("dark", "theme-dark");
    root.classList.add("theme-light");
    root.style.colorScheme = "light";
  }, []);

  const isDark = false;
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
