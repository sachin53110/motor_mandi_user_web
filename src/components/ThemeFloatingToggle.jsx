import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeFloatingToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 z-[120] h-12 w-12 rounded-full border border-blue-500/40 bg-gray-900/90 text-blue-300 shadow-xl shadow-black/30 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-blue-600 hover:text-white theme-toggle"
    >
      {isDark ? <Sun size={20} className="mx-auto" /> : <Moon size={20} className="mx-auto" />}
    </button>
  );
}
