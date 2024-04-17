import { Alert } from 'react-native'
import { io } from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from '../src/Utils/Api'
import notifee from '@notifee/react-native'
import { colors } from '../src/Style/StayAliveStyle'

class WebSocketService {
  static socket // Déclarez socket comme une propriété statique de la classe

  async onDisplayNotification(navigation, dataAlert, token) {
    const batteryOptimizationEnabled =
      await notifee.isBatteryOptimizationEnabled()
    if (batteryOptimizationEnabled) {
      Alert.alert(
        'Restrictions détectées',
        "Pour garantir l'envoi des notifications, veuillez désactiver l'optimisation de la batterie pour l'application.",
        [
          {
            text: 'OK, ouvrir les paramètres',
            onPress: async () =>
              await notifee.openBatteryOptimizationSettings(),
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
    if (powerManagerInfo && powerManagerInfo.activity) {
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

  async initializeWebSocket(navigation) {
    try {
      const token = await AsyncStorage.getItem('userToken')
      if (token) {
        const socketUrl = `${urlApi}/rescuer/ws?token=${token}`
        this.socket = io(socketUrl) // Utilisez this.socket pour accéder à la propriété de la classe

        this.socket.on('message', (data) => {
          const jsonData = data?.data
          if (jsonData !== null && jsonData !== undefined)
            this.onDisplayNotification(navigation, jsonData, token)
          navigation.navigate('AlertStatusPage', { dataAlert: jsonData })
        })

        await AsyncStorage.setItem('Websocket', socketUrl)
      }
    } catch (error) {
      console.error('Error initializing WebSocket:', error)
    }
  }

  disconnectWebSocket() {
    if (this.socket !== null) {
      console.log('Disconnecting WebSocket...')
      this.socket.disconnect()
      this.socket.removeAllListeners()
      this.socket = null
    }
  }
}

export default WebSocketService
