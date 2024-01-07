import React, { useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'
import { launchImageLibrary } from 'react-native-image-picker'
import { Menu } from './Menu'
import { colors } from '../Style/StayAliveStyle'
import PropTypes from 'prop-types'

export default function ProfilePage({ navigation }) {
  const [avatarSource, setAvatarSource] = useState(null)

  ProfilePage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

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

  const onClickDisconnect = () => {
    console.log('disconnect button press !')
    navigation.navigate('SendDocumentPage')
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
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <TouchableOpacity
            testID="select-image-button"
            style={{
              position: 'absolute',
              justifyContent: 'center',
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
                  : require('../../assets/StayAlive-logo.png')
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

        <Text
          testID="user-name"
          style={{
            alignSelf: 'center',
            top: -210,
            marginTop: 14,
            fontSize: 22,
            color: 'black',
            fontWeight: 'bold',
          }}
        >
          Louis AUTEF
        </Text>

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
        <Menu name="Mes Sauvetages" icon="help-buoy-outline" />
        <Menu name="Mon Compte" icon="person-outline" />
        <Menu name="Mes Documents" icon="document-text-outline" />
        <Menu name="Préférences" icon="settings-outline" />
        <TouchableOpacity
          testID="button-disconnect"
          style={{
            position: 'absolute',
            alignSelf: 'center',
            marginTop: 200,
            borderWidth: 3,
            borderRadius: 50,
            borderColor: colors.StayAliveRed,
            paddingHorizontal: 50,
            paddingVertical: 10,
            backgroundColor: 'white',
          }}
          onPress={onClickDisconnect}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              color: colors.StayAliveRed,
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
