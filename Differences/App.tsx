import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import GameScreen from './src/screens/GameScreen';
import { ChallengesScreen } from './src/screens/ChallengesScreen';
import { MainLayout } from './src/layouts/MainLayout';
import { StorageService } from './src/utils/storage';
import { HeaderBackButton } from '@react-navigation/elements';
import { LogBox } from 'react-native';
import AudioManager from './src/utils/AudioManager';

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
    const initializeApp = async () => {
      await StorageService.initializeStorage();
      await AudioManager.getInstance().initialize();
    };
    
    initializeApp();
    
    return () => {
      AudioManager.getInstance().cleanup();
    };
  }, []);
  
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

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
            options={({ navigation, route }) => ({ 
              headerShown: true,
              title: '',
              headerLeft: () => (
                <HeaderBackButton
                  onPress={() => {
                    //@ts-ignore
                    if (route.params?.handleExitConfirmation) {
                      //@ts-ignore
                      route.params.handleExitConfirmation();
                    }
                  }}
                />
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;