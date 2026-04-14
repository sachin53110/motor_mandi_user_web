// Helper function to generate theme-aware class names
export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const getThemeClasses = (isDark, light, dark) => {
  return isDark ? dark : light;
};

// Common theme patterns
export const themePatterns = {
  card: (isDark) => getThemeClasses(
    isDark,
    "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg",
    "bg-gray-900 border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/50"
  ),
  
  input: (isDark) => getThemeClasses(
    isDark,
    "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500",
    "bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
  ),
  
  button: {
    primary: (isDark) => getThemeClasses(
      isDark,
      "bg-blue-600 hover:bg-blue-700 text-white",
      "bg-blue-600 hover:bg-blue-500 text-white"
    ),
    secondary: (isDark) => getThemeClasses(
      isDark,
      "bg-gray-200 hover:bg-gray-300 text-gray-900",
      "bg-gray-800 hover:bg-gray-700 text-white"
    ),
  },
  
  text: {
    primary: (isDark) => getThemeClasses(isDark, "text-gray-900", "text-white"),
    secondary: (isDark) => getThemeClasses(isDark, "text-gray-600", "text-gray-300"),
    tertiary: (isDark) => getThemeClasses(isDark, "text-gray-500", "text-gray-400"),
  },
  
  background: {
    primary: (isDark) => getThemeClasses(isDark, "bg-white", "bg-gray-900"),
    secondary: (isDark) => getThemeClasses(isDark, "bg-gray-50", "bg-gray-950"),
  }
};
