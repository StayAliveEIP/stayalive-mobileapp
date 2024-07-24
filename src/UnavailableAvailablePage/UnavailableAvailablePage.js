import React, { useState, useEffect } from 'react'
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
import StayAliveSlider from './StayAliveSlider'
import LinearGradient from 'react-native-linear-gradient'

const UnavailableAvailablePage = ({ navigation }) => {
  const [available, setAvailable] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStatus()
  }, [])

  useEffect(() => {
    // Update available status when it changes
    setStatus(available)
  }, [available])

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

  const getStatus = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem('userToken')
    const url = `${urlApi}/rescuer/status`

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
        console.log('Status: ', data)
        setAvailable(data.status === 'AVAILABLE')
      } else {
        throw new Error('Failed to get status')
      }
    } catch (error) {
      console.error('There was an issue with the fetch operation:', error)
      Alert.alert('Error', 'We could not get your status')
    } finally {
      setLoading(false)
    }
  }

  const setStatus = async (isAvailable) => {
    setLoading(true)
    const token = await AsyncStorage.getItem('userToken')
    const url = `${urlApi}/rescuer/status`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: isAvailable ? 'AVAILABLE' : 'NOT_AVAILABLE',
        }),
      })

      if (response.ok) {
        console.log('Status updated successfully!')
        if (isAvailable) {
          await sendPosition()
          await getInfosAccount()
        }
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      console.error('There was an issue with the fetch operation:', error)
      Alert.alert('Error', 'We could not update your status')
    } finally {
      setLoading(false)
      getStatus()
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
      {loading && (
        <ActivityIndicator
          style={{ position: 'absolute', zIndex: 999 }}
          size="large"
          color={StayAliveColors.StayAliveRed}
        />
      )}
      <View
        style={{
          position: 'absolute',
          bottom: -30,
          left: -420,
          width: 500,
          height: 500,
          borderRadius: 10000,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[StayAliveColors.StayAliveRed, StayAliveColors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 300,
          height: 300,
          borderRadius: 10000,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[StayAliveColors.StayAliveRed, StayAliveColors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>
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

      <Text
        testID="status-text"
        style={{ marginTop: 100, fontSize: 24, color: 'black' }}
      >
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
        {available ? 'Disponible' : 'Indisponible'}
      </Text>
      {available ? (
        <Image
          style={{ width: 150, height: 150, marginTop: 30 }}
          source={require('../../assets/AvailableLogo.png')}
        />
      ) : (
        <Image
          style={{ width: 150, height: 150, marginTop: 30 }}
          source={require('../../assets/UnavailableLogo.png')}
          testID="unavailable-logo"
        />
      )}

      {available ? (
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
            Maintenant que vous êtes disponibles :
          </Text>
          <View testID="warning-text" style={{ maxWidth: '80%' }}>
            <Text style={{ fontSize: 16, textAlign: 'left', marginBottom: 5 }}>
              • Restez attentif aux notifications d'urgence.
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'left', marginBottom: 5 }}>
              • Gardez votre téléphone à portée de main en tout temps.
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'left', marginBottom: 5 }}>
              • Soyez prêt à intervenir rapidement en cas d'alerte.
            </Text>
          </View>
        </View>
      ) : (
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
            Maintenant que vous êtes indisponibles :
          </Text>
          <View testID="warning-text" style={{ maxWidth: '80%' }}>
            <Text style={{ fontSize: 16, textAlign: 'left', marginBottom: 5 }}>
              • Changez votre statut lorsque vous êtes prêt à intervenir.
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'left', marginBottom: 5 }}>
              • Restez informé des mises à jour des situations d'urgence.
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'left', marginBottom: 5 }}>
              • Assurez-vous que votre emplacement est mis à jour si nécessaire.
            </Text>
          </View>
        </View>
      )}

      <StayAliveSlider
        defaultValue={available}
        setAvailable={setStatus}
        onPress={setStatus}
      />
    </View>
  )
}

UnavailableAvailablePage.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default UnavailableAvailablePage
