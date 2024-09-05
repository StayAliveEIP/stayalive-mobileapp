import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Menu } from './Menu'
import { StayAliveColors } from '../Style/StayAliveStyle'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from '../Utils/Api'

const { width, height } = Dimensions.get('window');

export default function ProfilePage({ navigation }) {
  const [avatarSource, setAvatarSource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState(null)

  ProfilePage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)

        const token = await AsyncStorage.getItem('userToken')

        const response = await fetch(`${urlApi}/rescuer/account`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setProfileData(data)
        setAvatarSource(null)
        console.log(data.firstname + ' ' + data.lastname)
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des données du profil',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const onClickDisconnect = async () => {
    console.log('Disconnect button press !')

    const socketInfoString = await AsyncStorage.getItem('socketInfo')
    if (socketInfoString) {
      socketInfoString.off('message')
      socketInfoString.disconnect()
    }
    await AsyncStorage.setItem('userToken', 'Empty')
    await AsyncStorage.removeItem('socketInfo')

    navigation.navigate('LoginPage')
  }

  const goBack = () => {
    console.log('arrow left clicked !')
    navigation.goBack()
  }

  return (
    <ScrollView style={{ flex: 1, position: 'absolute' }}>
      <View
        style={{
          alignSelf: 'center',
          top: -height * 0.35,
          width: width * 1.3,
          height: height * 0.6,
          borderRadius: 1000,
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

      {loading && (

          <ActivityIndicator
            size="large"
            color={StayAliveColors.StayAliveRed}
          />
      )}

      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              top: -height * 0.49,
            }}
          >
            <Image
              testID="user-avatar"
              style={{
                alignSelf: 'center',
                width: width * 0.38,
                height: height * 0.19,
                borderRadius: 100,
                resizeMode: 'contain',
              }}
              source={
                avatarSource
                  ? { uri: avatarSource }
                  : require('../../assets/StayAlive-logo.png')
              }
            />
          </View>
        </View>

        <Text
          testID="user-name"
          style={{
            alignSelf: 'center',
            top: -height * 0.3,
            marginTop: height * 0.02,
            fontSize: width * 0.06,
            color: 'black',
            fontWeight: 'bold',
          }}
        >
          {profileData
            ? `${profileData.firstname} ${profileData.lastname}`
            : 'Chargement...'}
        </Text>

        <TouchableOpacity
          testID="button-left-arrow"
          style={{
            position: 'absolute',
            top: height * -0.55,
            left: width * 0.1,
            zIndex: 1,
          }}
          onPress={goBack}
        >
          <Icon name="arrow-left" size={30} onPress={goBack} />
        </TouchableOpacity>
        <Menu
          navigation={navigation}
          goTo="RescueHistoryPage"
          name="Mes Sauvetages"
          icon="help-buoy-outline"
        />
        <Menu
          navigation={navigation}
          name="Mon Compte"
          icon="person-outline"
          goTo="AccountPage"
        />
        <Menu
          navigation={navigation}
          name="Mes Documents"
          icon="document-text-outline"
          goTo="SendDocumentPage"
        />
        <Menu
          navigation={navigation}
          name="Les Défibrilateurs"
          icon="heart-outline"
          goTo="DefibrilatorListPage"
        />
        <Menu
          navigation={navigation}
          name="Préférences"
          icon="settings-outline"
          goTo="SettingsPage"
        />
        <TouchableOpacity
          testID="button-disconnect"
          style={{
            position: 'absolute',
            alignSelf: 'center',
            marginTop: height * 0.25,
            borderWidth: 3,
            borderRadius: 50,
            borderColor: StayAliveColors.StayAliveRed,
            paddingHorizontal: 50,
            paddingVertical: 10,
            backgroundColor: 'white',
          }}
          onPress={onClickDisconnect}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: width * 0.045,
              color: StayAliveColors.StayAliveRed,
              fontWeight: 'bold',
            }}
            testID="joinUs-button"
          >
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
