import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'
import { launchImageLibrary } from 'react-native-image-picker'
import { EditInfosMenu } from './EditInfos'
import { StayAliveColors } from '../../Style/StayAliveStyle'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Snackbar from 'react-native-snackbar'
import {
  requestUpdateEmail,
  requestUpdatePhone,
} from './RequestUpdateInfos/RequestsUpdateInfos'
import { urlApi } from '../../Utils/Api'

const { width, height } = Dimensions.get('window')

export default function AccountPage({ navigation }) {
  const [avatarSource, setAvatarSource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [originalProfileData, setOriginalProfileData] = useState({})
  const [profileData, setProfileData] = useState({})
  const [isSaving, setIsSaving] = useState(false)

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
      setIsSaving(true)
      if (profileData !== originalProfileData) {
        const token = await AsyncStorage.getItem('userToken')
        if (profileData.email.email !== originalProfileData.email.email) {
          const success = await requestUpdateEmail(profileData, token)
          if (success) {
            setIsSaving(false)
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
          console.log('change phone !!!!')
          const success = await requestUpdatePhone(profileData, token)
          if (success) {
            setIsSaving(false)
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
      console.error('Erreur lors de la sauvegarde des modifications', error)
    }
  }

  return (
    <ScrollView>
      <View
        style={{
          alignSelf: 'center',
          top: -height * 0.44,
          width: width * 1.3,
          height: height * 0.7,
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
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <ActivityIndicator
            size="large"
            color={StayAliveColors.StayAliveRed}
          />
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
              top: -height * 0.58,
            }}
            onPress={selectImage}
          >
            <Image
              testID="user-avatar"
              style={{
                alignSelf: 'center',
                width: width * 0.4,
                height: width * 0.4,
                borderRadius: width * 0.2,
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
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: 8,
                borderRadius: 20,
                right: width * 0.02,
                top: height * 0.14,
              }}
              onPress={selectImage}
            >
              <Icon name="camera" size={width * 0.05} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          testID="button-left-arrow"
          style={{
            position: 'absolute',
            top: -height * 0.62,
            left: height * 0.04,
            zIndex: 1,
          }}
          onPress={goBack}
        >
          <Icon name="arrow-left" size={width * 0.08} onPress={goBack} />
        </TouchableOpacity>
        <EditInfosMenu
          marginLeft={width * 0.09}
          name="Prénom"
          indexVariable="firstname"
          variable={profileData}
          setVariable={setProfileData}
          edit={false}
        />
        <EditInfosMenu
          marginLeft={width * 0.15}
          name="Nom"
          indexVariable="lastname"
          variable={profileData}
          setVariable={setProfileData}
          edit={false}
        />
        <EditInfosMenu
          marginLeft={width * 0.11}
          name="E-mail"
          indexVariable="email"
          variable={profileData}
          setVariable={setProfileData}
          edit={true}
        />
        <EditInfosMenu
          marginLeft={width * 0.04}
          name="Téléphone"
          indexVariable="phone"
          variable={profileData}
          setVariable={setProfileData}
          edit={true}
        />
        <View style={{ marginTop: height * -0.3 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              marginLeft: width * 0.06,
            }}
          >
            <Text
              testID="text-menu"
              style={{
                color: StayAliveColors.StayAliveRed,
                fontWeight: 'bold',
                fontSize: width * 0.05,
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
                      ? StayAliveColors.green
                      : StayAliveColors.StayAliveRed,
                  fontWeight: 'bold',
                  fontSize: width * 0.05,
                  marginLeft: width * 0.03,
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
              marginLeft: width * 0.06,
            }}
          >
            <Text
              testID="text-menu"
              style={{
                color: StayAliveColors.StayAliveRed,
                fontWeight: 'bold',
                fontSize: width * 0.05,
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
                      ? StayAliveColors.green
                      : StayAliveColors.StayAliveRed,
                  fontWeight: 'bold',
                  fontSize: width * 0.05,
                  marginLeft: width * 0.03,
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
            marginTop: height * 0.05,
            borderWidth: 3,
            borderRadius: 50,
            borderColor: StayAliveColors.StayAliveRed,
            paddingHorizontal: width * 0.02,
            paddingVertical: height * 0.015,
            backgroundColor: StayAliveColors.StayAliveRed,
            width: '60%',
          }}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
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
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
