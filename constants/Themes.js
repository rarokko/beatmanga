import React from 'react';

export const Themes = {
  currentTheme: "light",
  nightmode: {
    bgColor: "#0e0e0e",
    primaryText: "#86939e",
    subColor: "#2b2f33",
    alternative: "#151515"
  },
  light: {
    bgColor: "#d2d2d2",
    primaryText: "#525252",
    subColor: "#888888",
    alternative: "#ffffff"
  }
};

export const ThemeContext = React.createContext({
  theme: Themes.nightmode,
  toggleTheme: () => {},
});