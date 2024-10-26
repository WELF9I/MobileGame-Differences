import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Update the import to use default import
import HomeScreen from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import GameScreen from './src/screens/GameScreen';
import { ChallengesScreen } from './src/screens/ChallengesScreen';
import { MainLayout } from './src/layouts/MainLayout';
import { StorageService } from './src/utils/storage';

const Stack = createNativeStackNavigator();

const HomeScreenWithLayout = () => (
  <MainLayout>
    <HomeScreen />
  </MainLayout>
);

const ChallengesScreenWithLayout = () => (
  <MainLayout>
    <ChallengesScreen />
  </MainLayout>
);

const SettingsScreenWithLayout = () => (
  <MainLayout>
    <SettingsScreen />
  </MainLayout>
);

const GameScreenWithLayout = () => (
  <MainLayout>
    <GameScreen />
  </MainLayout>
);

const App = () => {
  useEffect(() => {
    StorageService.initializeStorage();
  }, []);
  
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreenWithLayout} 
          />
          <Stack.Screen 
            name="Challenges" 
            component={ChallengesScreenWithLayout} 
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreenWithLayout} 
            options={{ 
              headerShown: true,
              title: ''
            }}
          />
          <Stack.Screen 
            name="Game" 
            component={GameScreen}
            options={{ 
              headerShown: true,
              title: ''
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;