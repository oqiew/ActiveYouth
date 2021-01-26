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

// pages
import WelcomeScreen from './screens/WelcomeScreen';
import { routeName } from './route/routeName';

const Stack = createStackNavigator();

function App() {

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                headerMode="screen"
                screenOptions={{
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: '#4050b5' }, headerTitleAlign: 'center', headerTitleAllowFontScaling: true,
                }}
            >
                <Stack.Screen
                    name={routeName.Welcome}
                    component={WelcomeScreen}
                    options={{ title: 'PEDUbon', headerShown: false, }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;
