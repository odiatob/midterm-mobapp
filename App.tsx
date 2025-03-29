import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import JobFinderScreen from './screens/JobFinderScreen';
import SavedJobs from './screens/SavedJobs';
import ApplicationFormScreen from './screens/ApplicationFormScreen';
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';

const Stack = createNativeStackNavigator();

const AppContent: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  // Custom themes
  const LightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#f4f4f4', // Soft grayish-white
      primary: '#6a0572', // Rich purple
      text: '#333', // Dark text
    },
  };

  const DarkThemeCustom = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#121212', // Deep black
      primary: '#4a148c', // Deep violet
      text: '#fff', // White text
    },
  };

  return (
    <NavigationContainer theme={isDarkMode ? DarkThemeCustom : LightTheme}>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f4f4f4' }]}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: isDarkMode ? '#121212' : '#6a0572' },
            headerTintColor: '#fff',
            contentStyle: { backgroundColor: isDarkMode ? '#121212' : '#f4f4f4' },
            
          }}
        >
          <Stack.Screen name="JobFinder" component={JobFinderScreen} options={{ title: 'Job Finder' }} />
          <Stack.Screen name="SavedJobs" component={SavedJobs} />
          <Stack.Screen name="ApplicationForm" component={ApplicationFormScreen} options={{ title: 'Apply Now' }} />
        </Stack.Navigator>

        {/* Toggle Dark Mode Button */}
        <TouchableOpacity style={[styles.toggleButton, { backgroundColor: isDarkMode ? '#8e24aa' : '#6a0572' }]} onPress={toggleDarkMode}>
          <Text style={styles.toggleText}>{isDarkMode ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});