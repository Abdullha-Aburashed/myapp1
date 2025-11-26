// App.js
import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@rneui/themed';

import { MyContextProvider, MyContext } from './MyContext';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainScreen from './screens/MainScreen';
import AddFoodScreen from './screens/AddFoodScreen';
import GoalsScreen from './screens/GoalsScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import HelpScreen from './screens/HelpScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, initializing } = useContext(MyContext);

  if (initializing) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#22d3b6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddFromHome"
            component={AddFoodScreen}
            options={{ title: 'Add Food' }}
          />
          <Stack.Screen
            name="Goals"
            component={GoalsScreen}
            options={{ title: 'My Goals' }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: 'Edit Profile' }}
          />
          <Stack.Screen
            name="Help"
            component={HelpScreen}
            options={{ title: 'Help & Contact' }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <MyContextProvider>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </MyContextProvider>
  );
}
