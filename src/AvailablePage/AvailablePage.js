import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StayAliveColors } from '../Style/StayAliveStyle'
import { urlApi } from '../Utils/Api'
import WebSocketService from '../WebSocketService' // Import de la classe WebSocketService

export default function AvailablePage({ navigation }) {
  useEffect(() => {
    const webSocketService = new WebSocketService() // Crée une instance de WebSocketService
    webSocketService.initializeWebSocket(navigation) // Utilisation de la méthode de l'instance
    return () => {
      webSocketService.disconnectWebSocket() // Utilisation de la méthode de l'instance
    }
  }, [navigation])

  const onClickButton = async () => {
    console.log('Je me rends indisponible')
    const token = await AsyncStorage.getItem('userToken')

    const url = `${urlApi}/rescuer/status`
    const body = JSON.stringify({
      status: 'NOT_AVAILABLE',
    })

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body,
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        return Promise.reject(new Error('Failed to update status'))
      })
      .then((data) => {
        console.log('Status updated:', data)
        navigation.navigate('UnavailablePage')
      })
      .catch((error) => {
        console.error('There was an issue with the fetch operation:', error)
        Alert.alert('Error', 'We could not update your status', [
          { text: 'OK' },
        ])
      })
  }

  const onProfileBadgeClick = () => {
    console.log('Profile badge clicked')
    navigation.navigate('ProfilePage')
  }

  return (
    <View
      testID={'slider-container'}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <TouchableOpacity
        onPress={onProfileBadgeClick}
        style={{
          position: 'absolute',
          top: 50,
          right: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        testID="profile-badge"
      >
        <Image
          style={{ width: 60, height: 60 }}
          source={require('../../assets/ProfileBadge.png')}
        />
      </TouchableOpacity>

      <Text style={{ fontSize: 24, color: 'black' }}>Votre statut:</Text>
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: StayAliveColors.StayAliveRed,
          marginTop: 5,
        }}
        testID="status-text"
      >
        Disponible
      </Text>

      <Image
        style={{ width: 150, height: 150, marginTop: 30 }}
        source={require('../../assets/AvailableLogo.png')}
      />

      <TouchableOpacity
        onPress={onClickButton}
        style={{
          position: 'absolute',
          bottom: 30,
          borderWidth: 4,
          borderRadius: 50,
          borderColor: StayAliveColors.StayAliveRed,
          paddingHorizontal: 50,
          paddingVertical: 15,
          backgroundColor: 'transparent',
        }}
        testID="indisponible-button"
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            color: StayAliveColors.StayAliveRed,
            fontWeight: 'bold',
          }}
        >
          Se rendre indisponible
        </Text>
      </TouchableOpacity>
    </View>
  )
}

AvailablePage.propTypes = {
  navigation: PropTypes.object.isRequired,
}
