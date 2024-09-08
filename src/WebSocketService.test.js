import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from './Utils/Api'
import WebSocketService from './WebSocketService'
import notifee from '@notifee/react-native'
import { io } from 'socket.io-client'

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}))

jest.mock('@notifee/react-native', () => ({
  isBatteryOptimizationEnabled: jest.fn(),
  openBatteryOptimizationSettings: jest.fn(),
  getPowerManagerInfo: jest.fn(),
  openPowerManagerSettings: jest.fn(),
  createChannel: jest.fn(),
  displayNotification: jest.fn(),
}))

jest.mock('socket.io-client', () => ({
  io: jest.fn(),
}))

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

describe('onDisplayNotification function', () => {
  it('displays notification with valid dataAlert', async () => {
    const navigation = {}
    const dataAlert = { emergency: { info: 'Test emergency info' } }
    const token = 'testToken'

    const webSocketServiceInstance = new WebSocketService()
    const displayNotificationSpy = jest.spyOn(
      webSocketServiceInstance,
      'onDisplayNotification'
    )

    await webSocketServiceInstance.onDisplayNotification(
      navigation,
      dataAlert,
      token
    )

    expect(notifee.createChannel).toHaveBeenCalled()
    expect(notifee.displayNotification).toHaveBeenCalled()
    expect(displayNotificationSpy).toHaveBeenCalledWith(
      navigation,
      dataAlert,
      token
    )

    displayNotificationSpy.mockRestore()
  })
})

describe('initializeWebSocket function', (object, method) => {
  it('initializes WebSocket with valid token', async () => {
    const navigation = {}
    const mockSocket = { on: jest.fn(), disconnect: jest.fn() }
    io.mockReturnValue(mockSocket)
    AsyncStorage.getItem.mockResolvedValue('testToken')
    const expectedSocketUrl = `${urlApi}/rescuer/ws?token=testToken`

    const webSocketServiceInstance = new WebSocketService()
    await webSocketServiceInstance.initializeWebSocket(navigation)

    expect(io).toHaveBeenCalledWith(expectedSocketUrl)
    expect(mockSocket.on).toHaveBeenCalled()
    expect(AsyncStorage.setItem).toHaveBeenCalled()
  })

  it('calls onDisplayNotification and navigation.navigate with valid data', async () => {
    const navigation = { navigate: jest.fn() }
    const token = 'testToken'
    const jsonData = { data: { emergency: { info: 'Test emergency info' } } }
    const mockSocket = {
      on: jest.fn(),
      disconnect: jest.fn(),
      removeAllListeners: jest.fn(),
    }
    io.mockReturnValue(mockSocket)
    AsyncStorage.getItem.mockResolvedValue(token)
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {})

    const webSocketServiceInstance = new WebSocketService()
    const displayNotificationSpy = jest.spyOn(
      webSocketServiceInstance,
      'onDisplayNotification'
    )

    await webSocketServiceInstance.initializeWebSocket(navigation)

    const messageCallback = mockSocket.on.mock.calls[0][1]
    messageCallback(jsonData)

    webSocketServiceInstance.disconnectWebSocket()
    console.log(webSocketServiceInstance.socket)

    expect(displayNotificationSpy).toHaveBeenCalledWith(
      navigation,
      jsonData.data,
      token
    )
    expect(navigation.navigate).toHaveBeenCalledWith('AlertStatusPage', {
      dataAlert: jsonData.data,
    })
    expect(consoleLogSpy).toHaveBeenCalledWith('Disconnecting WebSocket...')
    expect(mockSocket.removeAllListeners).toHaveBeenCalled()

    consoleLogSpy.mockRestore()
    displayNotificationSpy.mockRestore()
  })
})
