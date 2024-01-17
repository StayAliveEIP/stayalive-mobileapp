import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';

const WebsocketEmergency = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const socket = io('https://api.stayalive.fr/', {
      transports: ['websocket'],
    });

    socket.on('/rescuer/ws', (emergencyEvent) => {
      // Naviguez vers la nouvelle page en utilisant React Navigation
      navigation.navigate('EmergencyDetail', { emergencyData: emergencyEvent });
    });

    return () => {
      socket.disconnect();
    };
  }, [navigation]);
};

export default WebsocketEmergency;
