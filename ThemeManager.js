import React, {createContext, useState} from 'react';
export const ThemeContext = createContext();
import {eventEmitter} from 'react-native-dark-mode';

export const ThemeManager = ({children}) => {
  const [theme, setTheme] = useState(false);
  eventEmitter.on('currentModeChanged', newMode => {
    if (newMode == 'dark') {
      setTheme(true);
    } else {
      setTheme(false);
    }
  });
  const toggleTheme = value => {
    if (value === true) {
      setTheme(true);
    } else {
      setTheme(false);
    }
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};