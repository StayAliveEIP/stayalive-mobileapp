import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'
import { launchImageLibrary } from 'react-native-image-picker'
import { EditInfosMenu } from './EditInfos'
import { colors } from '../../Style/StayAliveStyle'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Snackbar from 'react-native-snackbar'
import {
  requestUpdateEmail,
  requestUpdatePhone,
} from './RequestUpdateInfos/RequestsUpdateInfos'
import { urlApi } from '../../Utils/Api'

export default function AccountPage({ navigation }) {
  const [avatarSource, setAvatarSource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [originalProfileData, setOriginalProfileData] = useState({})
  const [profileData, setProfileData] = useState({})

  AccountPage.propTypes = {
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
        const data = await response.json()
        console.log(data)
        setProfileData(data)
        setOriginalProfileData(data)
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

  const selectImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    }

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('Image picker error: ', response.error)
      } else {
        const imageUri = response.uri || response.assets?.[0]?.uri
        setAvatarSource(imageUri)
      }
    })
  }

  const goBack = () => {
    console.log('arrow left clicked !')
    navigation.goBack()
  }

  const saveChanges = async () => {
    try {
      if (profileData !== originalProfileData) {
        const token = await AsyncStorage.getItem('userToken')

        if (profileData.email.email !== originalProfileData.email.email) {
          const success = await requestUpdateEmail(profileData, token)
          if (success) {
            setOriginalProfileData(profileData)
            Snackbar.show({
              text: 'Changements sauvegardés avec succès.',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'white',
              textColor: 'green',
            })
          }
        }

        if (profileData.phone.phone !== originalProfileData.phone.phone) {
          const success = await requestUpdatePhone(profileData, token)
          if (success) {
            setOriginalProfileData(profileData)
            Snackbar.show({
              text: 'Changements sauvegardés avec succès.',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'white',
              textColor: 'green',
            })
          }
        }
      }
    } catch (error) {
      // console.error('Erreur lors de la sauvegarde des modifications', error);
    }
  }

  return (
    <ScrollView>
      <View
        style={{
          alignSelf: 'center',
          top: -260,
          width: 550,
          height: 500,
          borderRadius: 1000,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[colors.StayAliveRed, colors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>

      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color={colors.StayAliveRed} />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            testID="select-image-button"
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              top: -360,
            }}
            onPress={selectImage}
          >
            <Image
              testID="user-avatar"
              style={{
                alignSelf: 'center',
                width: 160,
                height: 160,
                borderRadius: 100,
                resizeMode: 'contain',
              }}
              source={
                avatarSource
                  ? { uri: avatarSource }
                  : require('../../../assets/StayAlive-logo.png')
              }
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: 8,
                borderRadius: 20,
              }}
              onPress={selectImage}
            >
              <Icon name="camera" size={20} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          testID="button-left-arrow"
          style={{
            position: 'absolute',
            top: -440,
            left: 30,
            zIndex: 1,
          }}
          onPress={goBack}
        >
          <Icon name="arrow-left" size={30} onPress={goBack} />
        </TouchableOpacity>
        <EditInfosMenu
          name="Prénom"
          indexVariable="firstname"
          variable={profileData}
          setVariable={setProfileData}
          edit={false}
        />
        <EditInfosMenu
          name="Nom"
          indexVariable="lastname"
          variable={profileData}
          setVariable={setProfileData}
          edit={false}
        />
        <EditInfosMenu
          name="E-mail"
          indexVariable="email"
          variable={profileData}
          setVariable={setProfileData}
          edit={true}
        />
        <EditInfosMenu
          name="Téléphone"
          indexVariable="phone"
          variable={profileData}
          setVariable={setProfileData}
          edit={true}
        />
        <View style={{ marginTop: -130 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              marginLeft: 20,
            }}
          >
            <Text
              testID="text-menu"
              style={{
                color: colors.StayAliveRed,
                fontWeight: 'bold',
                fontSize: 20,
              }}
            >
              E-mail :
            </Text>
            {profileData.email !== null && !loading ? (
              <Text
                testID="text-menu"
                style={{
                  color:
                    profileData.email?.verified !== false
                      ? colors.green
                      : colors.StayAliveRed,
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginLeft: 10,
                  marginTop: 0,
                }}
              >
                {profileData.email?.verified === false
                  ? 'unverified'
                  : 'verified'}
              </Text>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              marginLeft: 20,
            }}
          >
            <Text
              testID="text-menu"
              style={{
                color: colors.StayAliveRed,
                fontWeight: 'bold',
                fontSize: 20,
                marginLeft: 0,
                marginTop: 0,
              }}
            >
              Téléphone :
            </Text>
            {profileData.phone !== null && !loading ? (
              <Text
                testID="text-menu"
                style={{
                  color:
                    profileData.phone?.verified !== false
                      ? colors.green
                      : colors.StayAliveRed,
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginLeft: 10,
                  marginTop: 0,
                }}
              >
                {profileData.phone?.verified === false
                  ? 'unverified'
                  : 'verified'}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          testID="save-button"
          onPress={saveChanges}
          style={{
            marginTop: 50,
            marginBottom: 10,
            borderWidth: 3,
            borderRadius: 50,
            borderColor: colors.StayAliveRed,
            paddingHorizontal: 50,
            paddingVertical: 10,
            backgroundColor: colors.StayAliveRed,
            width: '60%',
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              color: 'white',
              fontWeight: 'bold',
            }}
            testID="login-button"
          >
            Sauvegarder
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
