import { io } from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from '../src/Utils/Api'
import notifee from '@notifee/react-native'
import { StayAliveColors } from '../src/Style/StayAliveStyle'

class WebSocketService {
  static socket

  async onDisplayNotification(navigation, dataAlert, token) {
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
        color: StayAliveColors.StayAliveRed,
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
        this.socket = io(socketUrl)
        console.log('WebSocket initialized:', socketUrl)
        this.socket.on('message', (data) => {
          console.log('UN MESSAGE')
          console.log(data)
          if (data.data !== undefined) {
            console.log('UNE URGENCE A ETE RECU')
            console.log(data)
            this.onDisplayNotification(navigation, data.data, token)
            navigation.navigate('AlertStatusPage', { dataAlert: data.data })
          }
        })

        await AsyncStorage.setItem('Websocket', socketUrl)
      }
    } catch (error) {
      console.error('Error initializing WebSocket:', error)
    }
  }

  disconnectWebSocket() {
    if (this.socket && this.socket.connected) {
      console.log('Disconnecting WebSocket...')
      this.socket.disconnect()
      this.socket.removeAllListeners()
      this.socket = null
    } else {
      console.log('WebSocket is not connected or already disconnected.')
    }
  }
}

export default WebSocketService
