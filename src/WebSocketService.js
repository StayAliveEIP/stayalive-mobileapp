import { Alert } from 'react-native'
import { io } from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from '../src/Utils/Api'
import notifee from '@notifee/react-native'
import { colors } from '../src/Style/StayAliveStyle'
let socket

async function onDisplayNotification(navigation, dataAlert, token) {
  const batteryOptimizationEnabled =
    await notifee.isBatteryOptimizationEnabled()
  if (batteryOptimizationEnabled) {
    Alert.alert(
      'Restrictions détectées',
      "Pour garantir l'envoi des notifications, veuillez désactiver l'optimisation de la batterie pour l'application.",
      [
        {
          text: 'OK, ouvrir les paramètres',
          onPress: async () => await notifee.openBatteryOptimizationSettings(),
        },
        {
          text: 'Annuler',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    )
  }
  const powerManagerInfo = await notifee.getPowerManagerInfo()
  if (powerManagerInfo.activity) {
    Alert.alert(
      'Restrictions détectées',
      "Pour garantir la réception des notifications, veuillez ajuster vos paramètres pour éviter que l'application ne soit arretée.",
      [
        {
          text: 'OK, ouvrir les paramètres',
          onPress: async () => await notifee.openPowerManagerSettings(),
        },
        {
          text: 'Annuler',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    )
  }
  if (!dataAlert || !dataAlert.emergency || !dataAlert.emergency.info) {
    console.error('Invalid dataAlert object.')
    return
  }
  const { info } = dataAlert.emergency
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Emergency Channel',
  })

  await notifee.displayNotification({
    title: '<b><font color="#E33A26">Vous avez une urgence</font></b>',
    body: '<p><font color="#000000">' + info + '</font></p>',
    android: {
      smallIcon: 'ic_stayalive_logo',
      color: colors.StayAliveRed,
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  })
}

export const initializeWebSocket = async (navigation) => {
  try {
    const token = await AsyncStorage.getItem('userToken')
    if (token) {
      const socketUrl = `${urlApi}/rescuer/ws?token=${token}`
      socket = io(socketUrl)

      socket.on('message', (data) => {
        const jsonData = data?.data
        if (jsonData !== null && jsonData !== undefined)
          onDisplayNotification(navigation, jsonData, token)
        navigation.navigate('AlertStatusPage', { dataAlert: jsonData })
      })

      await AsyncStorage.setItem('Websocket', socketUrl)
    }
  } catch (error) {
    console.error('Error initializing WebSocket:', error)
  }
}

export const disconnectWebSocket = () => {
  if (socket && socket.connected) {
    console.log('Disconnecting WebSocket...')
    socket.disconnect()
    socket.removeAllListeners()
    socket = null
  }
}
