import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RegistrationPage from './RegistrationPage/RegistrationPage'
import LoginPage from './LoginPage/LoginPage'
import ProfilePage from './Profile/ProfilePage'
import AvailablePage from './AvailablePage/AvailablePage'
import IntroductionPage from './IntroductionPage/IntroductionPage'
import UnavailablePage from './UnavailablePage/UnavailablePage'
import SendDocumentPage from './SendDocumentPage/SendDocumentPage'
import Maps from './Maps/maps'
import AlertStatusPage from './AlertStatusPage/AlertStatusPage'
import { UserProvider } from './Utils/UserContext'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="UnavailablePage"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="RegistrationPage" component={RegistrationPage} />
          <Stack.Screen name="ProfilePage" component={ProfilePage} />
          <Stack.Screen name="AvailablePage" component={AvailablePage} />
          <Stack.Screen name="UnavailablePage" component={UnavailablePage} />
          <Stack.Screen name="IntroductionPage" component={IntroductionPage} />
          <Stack.Screen name="SendDocumentPage" component={SendDocumentPage} />
          <Stack.Screen name="Maps" component={Maps} />
          <Stack.Screen name="AlertStatusPage" component={AlertStatusPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  )
}
