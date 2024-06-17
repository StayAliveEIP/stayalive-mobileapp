import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
  Platform,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import { StayAliveColors } from '../Style/StayAliveStyle'
import { urlApi } from '../Utils/Api'
import Geolocation from '@react-native-community/geolocation'

export default function UnavailablePage({ navigation }) {
  UnavailablePage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  const [loading, setLoading] = useState(false)

  const getInfosAccount = async () => {
    const token = await AsyncStorage.getItem('userToken')
    const url = `${urlApi}/rescuer/account`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Account infos: ', data)
      } else {
        throw new Error('Failed to get account information')
      }
    } catch (error) {
      console.error('There was an issue with the fetch operation:', error)
      Alert.alert('Error', 'We could not get your account information')
    }
  }

  const sendPosition = async () => {
    if (Platform.OS === 'android') {
      const token = await AsyncStorage.getItem('userToken')
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permission d'accès à la position",
            message:
              'Nous avons besoin de votre permission pour accéder à votre position',
            buttonNeutral: 'Demander ultérieurement',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK',
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLoading(true)
          Geolocation.getCurrentPosition(
            (position) => {
              console.log(position)
              const JsonBody = JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              })
              console.log(JsonBody)
              const url = `${urlApi}/rescuer/position`

              fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JsonBody,
              })
                .then((response) => {
                  if (response.ok) {
                    return response.json()
                  }
                  return Promise.reject(new Error('Failed to send position'))
                })
                .then((data) => {
                  console.log('Position sent: ', data)
                })
                .catch((error) => {
                  console.error(
                    'There was an issue with the fetch operation:',
                    error
                  )
                  Alert.alert('Error', 'We could not send your position')
                })
                .finally(() => setLoading(false))
            },
            (error) => console.log(error.message),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          )
        } else {
          console.log('Permission refusée')
        }
      } catch (err) {
        console.warn(err)
      }
    }
  }

  const onClickButton = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem('userToken')
    const url = `${urlApi}/rescuer/status`
    const body = JSON.stringify({
      status: 'AVAILABLE',
    })

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body,
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      console.log('Status updated !')
      await sendPosition()
      await getInfosAccount()
      navigation.navigate('AvailablePage')
    } catch (error) {
      console.error('There was an issue with the fetch operation:', error)
      Alert.alert('Error', 'We could not update your status')
    } finally {
      setLoading(false)
    }
  }

  const onProfileBadgeClick = () => {
    console.log('Profile badge clicked')
    navigation.navigate('ProfilePage')
  }

  return (
    <View
      testID="main-view"
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <TouchableOpacity
        onPress={onProfileBadgeClick}
        testID="profile-badge"
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
          style={{ width: 60, height: 60 }}
          source={require('../../assets/ProfileBadge.png')}
          testID="profile-badge-image"
        />
      </TouchableOpacity>

      <Text testID="status-text" style={{ fontSize: 24, color: 'black' }}>
        Votre statut:
      </Text>
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: StayAliveColors.StayAliveRed,
          marginTop: 5,
        }}
        testID="status-indisponible"
      >
        Indisponible
      </Text>

      <Image
        style={{ width: 150, height: 150, marginTop: 30 }}
        source={require('../../assets/UnavailableLogo.png')}
        testID="unavailable-logo"
      />

      <View
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
        testID="warning-view"
      >
        <Image
          source={require('../../assets/WarningLogo.png')}
          style={{ width: 80, height: 80, marginBottom: 15 }}
          testID="warning-logo"
        />
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: StayAliveColors.StayAliveRed,
            marginBottom: 10,
          }}
          testID="warning-title"
        >
          Avant de se rendre disponible:
        </Text>
        <Text
          style={{ fontSize: 16, textAlign: 'center', maxWidth: '80%' }}
          testID="warning-text"
        >
          Lorem ipsum dolor sit amet consectetur molestiae quas vel sint commodi
          repudiandae consequuntur voluptatum fugiat iusto fuga
          praesentiumoptio, eaque rerum!
        </Text>
      </View>

      <TouchableOpacity
        onPress={onClickButton}
        disabled={loading}
        style={{
          position: 'absolute',
          bottom: 30,
          borderWidth: 4,
          borderRadius: 50,
          borderColor: StayAliveColors.StayAliveRed,
          paddingHorizontal: 50,
          paddingVertical: 15,
          backgroundColor: loading ? StayAliveColors.LightGray : 'transparent',
        }}
        testID="available-button"
      >
        {loading ? (
          <ActivityIndicator color={StayAliveColors.StayAliveRed} />
        ) : (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              color: StayAliveColors.StayAliveRed,
              fontWeight: 'bold',
            }}
            testID="available-button-text"
          >
            Se rendre Disponible
          </Text>
        )}
      </TouchableOpacity>
    </View>
  )
}
