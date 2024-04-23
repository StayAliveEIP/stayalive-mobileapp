import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RegistrationPage from './RegistrationPage/RegistrationPage'
import LoginPage from './LoginPage/LoginPage'
import ProfilePage from './Profile/ProfilePage'
import AccountPage from './Profile/Account/AccountPage'
import RescueHistoryPage from './Profile/RescueHistory/RescueHistoryPage'
import AvailablePage from './AvailablePage/AvailablePage'
import IntroductionPage from './IntroductionPage/IntroductionPage'
import UnavailablePage from './UnavailablePage/UnavailablePage'
import SendDocumentPage from './SendDocumentPage/SendDocumentPage'
import ForgotPasswordPage from './ForgotPasswordPage/ForgotPasswordPage'
import Maps from './Maps/maps'
import AlertStatusPage from './AlertStatusPage/AlertStatusPage'
import SettingsPage from './SettingsPage/SettingsPage'
import ChatEmergency from './ChatEmergency/ChatEmergency'
import { UserProvider } from './Utils/UserContext'
import notifee, { EventType } from '@notifee/react-native'

const Stack = createNativeStackNavigator()

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail

  if (type === EventType.PRESS && pressAction.id === 'default') {
    console.log('the default button was pressed')
    await notifee.cancelNotification(notification.id)
  }
})

async function requestNotificationPermission() {
  await notifee.requestPermission()
}

export default function App() {
  React.useEffect(() => {
    requestNotificationPermission()
  }, [])

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LoginPage"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen
            name="ForgotPasswordPage"
            component={ForgotPasswordPage}
          />
          <Stack.Screen name="ChatEmergency" component={ChatEmergency} />
          <Stack.Screen name="RegistrationPage" component={RegistrationPage} />
          <Stack.Screen name="ProfilePage" component={ProfilePage} />
          <Stack.Screen name="AvailablePage" component={AvailablePage} />
          <Stack.Screen name="UnavailablePage" component={UnavailablePage} />
          <Stack.Screen name="IntroductionPage" component={IntroductionPage} />
          <Stack.Screen name="SendDocumentPage" component={SendDocumentPage} />
          <Stack.Screen name="Maps" component={Maps} />
          <Stack.Screen name="AlertStatusPage" component={AlertStatusPage} />
          <Stack.Screen name="AccountPage" component={AccountPage} />
          <Stack.Screen name="SettingsPage" component={SettingsPage} />
          <Stack.Screen
            name="RescueHistoryPage"
            component={RescueHistoryPage}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  )
}
