import * as React from "react";
import RegistrationPage from './RegistrationPage/RegistrationPage'
import LoginPage from './LoginPage/LoginPage'
import ProfilePage from './Profile/ProfilePage'
import AvailablePage from './AvailablePage/AvailablePage'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroductionPage from './IntroductionPage/IntroductionPage';
import UnavailablePage from './UnavailablePage/UnavailablePage';
import Maps from './Maps/maps';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={'Maps'} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoginPage" component={LoginPage} />
                <Stack.Screen name="RegistrationPage" component={RegistrationPage} />
                <Stack.Screen name="ProfilePage" component={ProfilePage} />
                <Stack.Screen name="AvailablePage" component={AvailablePage} />
                <Stack.Screen name="UnavailablePage" component={UnavailablePage} />
                <Stack.Screen name="IntroductionPage" component={IntroductionPage} />
                <Stack.Screen name="Maps" component={Maps} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
