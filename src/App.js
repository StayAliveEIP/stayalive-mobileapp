import * as React from "react";
import RegistrationPage from './RegistrationPage/RegistrationPage'
import LoginPage from './LoginPage/LoginPage'
import ProfilePage from './Profile/ProfilePage'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroductionPage from './IntroductionPage/IntroductionPage';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={'IntroductionPage'} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoginPage" component={LoginPage} />
                <Stack.Screen name="RegistrationPage" component={RegistrationPage} />
                <Stack.Screen name="ProfilePage" component={ProfilePage} />
                <Stack.Screen name="IntroductionPage" component={IntroductionPage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
