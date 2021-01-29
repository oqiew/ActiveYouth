/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { routeName } from './route/routeName';

// pages
import WelcomeScreen from './screens/WelcomeScreen';
import SigninScreen from './screens/auth/SigninScreen';
import SignupScreen from './screens/auth/SignupScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
const Stack = createStackNavigator();

function App() {

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={routeName.Welcome}
                headerMode="screen"
                screenOptions={{
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: '#4050b5' }, headerTitleAlign: 'center', headerTitleAllowFontScaling: true,
                }}
            >
                <Stack.Screen
                    name={routeName.Welcome}
                    component={WelcomeScreen}
                    options={{ title: 'ActiveYouth', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.Home}
                    component={HomeScreen}
                    options={{ title: 'Home', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.Signin}
                    component={SigninScreen}
                    options={{ title: 'Signin', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.Signup}
                    component={SignupScreen}
                    options={{ title: 'Signup', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.ForgotPassword}
                    component={ForgotPasswordScreen}
                    options={{ title: 'ForgotPassword', headerShown: false, }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;
