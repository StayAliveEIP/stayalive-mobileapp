import { io } from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from '../src/Utils/Api'

let socket

export const initializeWebSocket = async (navigation) => {
  try {
    const token = await AsyncStorage.getItem('userToken')
    if (token) {
      const socketUrl = `${urlApi}/rescuer/ws?token=${token}`
      socket = io(socketUrl)

      socket.on('message', (data) => {
        const jsonData = data?.data
        if (jsonData !== null && jsonData !== undefined)
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
