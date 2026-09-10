import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import WelcomeScreen from './screens/WelcomeScreen';
import ChefProfileScreen from './screens/ChefProfileScreen';
import LoginScreen from './screens/LoginScreen';
import MenuScreen from './screens/MenuScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="ChefProfile" component={ChefProfileScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}