import * as React from 'react'
import { ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RegistrationPage from './RegistrationPage/RegistrationPage'
import LoginPage from './LoginPage/LoginPage'
import ProfilePage from './Profile/ProfilePage'
import AccountPage from './Profile/Account/AccountPage'
import RescueHistoryPage from './Profile/RescueHistory/RescueHistoryPage'
import IntroductionPage from './IntroductionPage/IntroductionPage'
import UnavailableAvailablePage from './UnavailableAvailablePage/UnavailableAvailablePage'
import SendDocumentPage from './SendDocumentPage/SendDocumentPage'
import ForgotPasswordPage from './ForgotPasswordPage/ForgotPasswordPage'
import Maps from './Maps/maps'
import AlertStatusPage from './AlertStatusPage/AlertStatusPage'
import SettingsPage from './SettingsPage/SettingsPage'
import ChatEmergency from './ChatEmergency/ChatEmergency'
import { UserProvider } from './Utils/UserContext'
import notifee, { EventType } from '@notifee/react-native'
import { colors } from './Style/StayAliveStyle'

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
  const [initialRoute, setInitialRoute] = React.useState(null)

  React.useEffect(() => {
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

  if (initialRoute === null) {
    return <ActivityIndicator size="large" color={colors.StayAliveRed} />
  }

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
          <Stack.Screen
            name="UnavailableAvailablePage"
            component={UnavailableAvailablePage}
          />
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
