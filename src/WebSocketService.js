import { Alert } from 'react-native';
import { io } from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from '../src/Utils/Api'
import notifee from '@notifee/react-native';
import PropTypes from 'prop-types'
import { colors } from '../src/Style/StayAliveStyle'
let socket

async function onDisplayNotification(navigation, dataAlert, token) {
  const batteryOptimizationEnabled = await notifee.isBatteryOptimizationEnabled();
  if (batteryOptimizationEnabled) {
    Alert.alert(
        'Restrictions Detected',
        'To ensure notifications are delivered, please disable battery optimization for the app.',
        [
          {
            text: 'OK, open settings',
            onPress: async () => await notifee.openBatteryOptimizationSettings(),
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
        ],
        { cancelable: false }
    );
  };
  const powerManagerInfo = await notifee.getPowerManagerInfo();
  if (powerManagerInfo.activity) {
    Alert.alert(
        'Restrictions Detected',
        'To ensure notifications are delivered, please adjust your settings to prevent the app from being killed',
        [
          {
            text: 'OK, open settings',
            onPress: async () => await notifee.openPowerManagerSettings(),
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
        ],
        { cancelable: false }
    );
  };
  if (!dataAlert || !dataAlert.emergency || !dataAlert.emergency.info) {
    console.error("Invalid dataAlert object.");
    return;
  }
  const logoUri = require('../assets/StayAlive-logo.png');

  const { info } = dataAlert.emergency;
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Emergency Channel',
  });

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
  });
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
          onDisplayNotification(navigation, jsonData, token);
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
