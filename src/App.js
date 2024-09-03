import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RegistrationPage from './RegistrationPage/RegistrationPage'
import LoginPage from './LoginPage/LoginPage'
import ProfilePage from './Profile/ProfilePage'
import AccountPage from './Profile/Account/AccountPage'
import RescueHistoryPage from './Profile/RescueHistory/RescueHistoryPage'
import IntroductionPage from './IntroductionPage/IntroductionPage'
import SendDocumentPage from './Profile/SendDocumentPage/SendDocumentPage'
import ForgotPasswordPage from './ForgotPasswordPage/ForgotPasswordPage'
import Maps from './Maps/maps'
import AlertStatusPage from './AlertStatusPage/AlertStatusPage'
import DefibrilatorPage from './DefibrilatorPage/DefibrilatorPage'
import DefibrilatorListPage from './DefibrilatorPage/DefibrilatorListPage'
import SettingsPage from './Profile/SettingsPage/SettingsPage'
import ReportBugPage from './Profile/SettingsPage/ReportBugPage/ReportBugPage'
import ChatEmergency from './ChatEmergency/ChatEmergency'
import MapDefibrilatorPage from './DefibrilatorPage/MapDefibrilatorPage'
import { UserProvider } from './Utils/UserContext'
import notifee, { EventType } from '@notifee/react-native'
import UnavailableAvailablePage from './UnavailableAvailablePage/UnavailableAvailablePage'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack = createNativeStackNavigator()

// Handle background notifications
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail

  if (type === EventType.PRESS && pressAction.id === 'default') {
    console.log('The default button was pressed')
    await notifee.cancelNotification(notification.id)
  }
})

async function requestNotificationPermission() {
  await notifee.requestPermission()
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null)

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const firstLaunch = await AsyncStorage.getItem('firstLaunch')
        if (firstLaunch === null) {
          await AsyncStorage.setItem('firstLaunch', 'false')
          setInitialRoute('IntroductionPage')
        } else {
          setInitialRoute('LoginPage')
        }
      } catch (error) {
        console.error('Error checking first launch: ', error)
        setInitialRoute('LoginPage')
      }
    }

    requestNotificationPermission()
    checkFirstLaunch()
  }, [])

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
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
          <Stack.Screen name="DefibrilatorPage" component={DefibrilatorPage} />
          <Stack.Screen
            name="DefibrilatorListPage"
            component={DefibrilatorListPage}
          />
          <Stack.Screen name="ReportBugPage" component={ReportBugPage} />
          <Stack.Screen
            name="UnavailableAvailablePage"
            component={UnavailableAvailablePage}
          />
          <Stack.Screen
            name="MapDefibrilatorPage"
            component={MapDefibrilatorPage}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  )
}
