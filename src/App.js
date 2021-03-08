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
import SubdistrictScreen from './screens/subdistrict/SubdistrictScreen';
import PopulationFScreen from './screens/subdistrict/PopulationFScreen';
import PopulationMScreen from './screens/subdistrict/PopulationMScreen';
import LocalCalendarScreen from './screens/localCalendar/LocalCalendarScreen';
import LocalMapsScreen from './screens/localMaps/LocalMapsScreen';
import ReligionScreen from './screens/religion/ReligionScreen';
import LocalOrganizationScreen from './screens/localOrganization/LocalOrganizationScreen';
import UserListScreen from './screens/userList.js/UserListScreen';
import SchoolScreen from './screens/school/SchoolScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import Youthnetworkscreen from './screens/youthNetwork/Youthnetworkscreen';
import AYScreen from './screens/ay/AYScreen';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import GuestHomeScreen from './screens/GuestHomeScreen';
import ProfileEditScreen from './screens/profile/ProfileEditScreen';


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
                    name={routeName.GuestHome}
                    component={GuestHomeScreen}
                    options={{ title: 'GuestHome', headerShown: false, }}
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
                <Stack.Screen
                    name={routeName.Subdistrict}
                    component={SubdistrictScreen}
                    options={{ title: 'Subdistrict', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.PopulationM}
                    component={PopulationMScreen}
                    options={{ title: 'PopulationM', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.PopulationF}
                    component={PopulationFScreen}
                    options={{ title: 'PopulationF', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.Religion}
                    component={ReligionScreen}
                    options={{ title: 'Religion', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.School}
                    component={SchoolScreen}
                    options={{ title: 'School', headerShown: false, }}
                />

                <Stack.Screen
                    name={routeName.LocalOrganization}
                    component={LocalOrganizationScreen}
                    options={{ title: 'LocalOrganization', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.UserList}
                    component={UserListScreen}
                    options={{ title: 'UserList', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.LocalMaps}
                    component={LocalMapsScreen}
                    options={{ title: 'LocalMaps', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.LocalCalendar}
                    component={LocalCalendarScreen}
                    options={{ title: 'LocalCalendar', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.Profile}
                    component={ProfileScreen}
                    options={{ title: 'Profile', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.ProfileEdit}
                    component={ProfileEditScreen}
                    options={{ title: routeName.ProfileEdit, headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.YouthNetwork}
                    component={Youthnetworkscreen}
                    options={{ title: 'YouthNetwork', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.AY}
                    component={AYScreen}
                    options={{ title: 'AY', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.Dashboard}
                    component={DashboardScreen}
                    options={{ title: 'Dashboard', headerShown: false, }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;
