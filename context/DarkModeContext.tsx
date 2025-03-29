import React, { createContext, useContext, useState } from 'react';
import { StyleSheet } from 'react-native';

const DarkModeContext = createContext({ isDarkMode: false, toggleDarkMode: () => {} });

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);

export const darkModeStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#121212' : '#f8f1f1', // Dark vs Soft Cream
      flex: 1,
    },
    text: {
      color: isDarkMode ? '#ffffff' : '#3e2723', // White vs Warm Brown
    },
    jobCard: {
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff3e0', // Dark Gray vs Pastel Orange
      padding: 16,
      marginBottom: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDarkMode ? '#666' : '#bdbdbd', // Dark Gray vs Light Gray
      shadowColor: isDarkMode ? '#000' : '#888',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    button: {
      backgroundColor: isDarkMode ? '#4a148c' : '#6a0572', // Deep Violet vs Rich Purple
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDarkMode ? '#8e24aa' : '#9c27b0', // Light Purple Accent
    },
    buttonText: {
      color: isDarkMode ? '#e1bee7' : '#fff', // Lavender vs White
    },
  });
