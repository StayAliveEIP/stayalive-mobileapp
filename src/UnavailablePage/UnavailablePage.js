import React from 'react'
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import { colors } from '../Style/StayAliveStyle'

export default function UnavailablePage({ navigation }) {
  UnavailablePage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }
  const onClickButton = async () => {
    console.log('Je me rends Disponible')
    const token = await AsyncStorage.getItem('userToken')

    const url = 'http://api.stayalive.fr:3000/rescuer/status'
    const body = JSON.stringify({
      status: 'AVAILABLE',
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
        navigation.navigate('AvailablePage')
      })
      .catch((error) => {
        console.error('There was an issue with the fetch operation:', error)
        Alert.alert('Error', 'We could not update your status')
      })
  }

  const onProfileBadgeClick = () => {
    console.log('Profile badge clicked')
    navigation.navigate('AvailablePage')
  }

  return (
    <View
      testID="main-view"
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <TouchableOpacity
        testID="profile-badge"
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
      >
        <Image
          testID="profile-badge-image"
          style={{ width: 60, height: 60 }}
          source={require('../../assets/ProfileBadge.png')}
        />
      </TouchableOpacity>

      <Text testID="status-text" style={{ fontSize: 24, color: 'black' }}>
        Votre statut:
      </Text>
      <Text
        testID="status-indisponible"
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: colors.StayAliveRed,
          marginTop: 5,
        }}
      >
        Indisponible
      </Text>

      <Image
        testID="unavailable-logo"
        style={{ width: 150, height: 150, marginTop: 30 }}
        source={require('../../assets/UnavailableLogo.png')}
      />

      <View
        testID="warning-view"
        style={{
          backgroundColor: 'white',
          paddingVertical: 15,
          paddingHorizontal: 10,
          borderRadius: 15,
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          alignItems: 'center',
          maxWidth: '90%',
          width: 400,
          marginTop: 50,
        }}
      >
        <Image
          testID="warning-logo"
          source={require('../../assets/WarningLogo.png')}
          style={{ width: 80, height: 80, marginBottom: 15 }}
        />
        <Text
          testID="warning-title"
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.StayAliveRed,
            marginBottom: 10,
          }}
        >
          Avant de se rendre disponible:
        </Text>
        <Text
          testID="warning-text"
          style={{ fontSize: 16, textAlign: 'center', maxWidth: '80%' }}
        >
          Lorem ipsum dolor sit amet consectetur molestiae quas vel sint commodi
          repudiandae consequuntur voluptatum fugiat iusto fuga
          praesentiumoptio, eaque rerum!
        </Text>
      </View>

      <TouchableOpacity
        testID="available-button"
        onPress={onClickButton}
        style={{
          position: 'absolute',
          bottom: 30,
          borderWidth: 4,
          borderRadius: 50,
          borderColor: colors.StayAliveRed,
          paddingHorizontal: 50,
          paddingVertical: 15,
          backgroundColor: 'transparent',
        }}
      >
        <Text
          testID="available-button-text"
          style={{
            textAlign: 'center',
            fontSize: 18,
            color: colors.StayAliveRed,
            fontWeight: 'bold',
          }}
        >
          Se rendre Disponible
        </Text>
      </TouchableOpacity>
    </View>
  )
}
