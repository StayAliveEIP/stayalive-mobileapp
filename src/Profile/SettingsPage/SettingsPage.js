import React from 'react'
import { View, TouchableOpacity, Image, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import { StayAliveColors } from '../../Style/StayAliveStyle'

export default function SettingsPage({ navigation }) {
  SettingsPage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  const goBack = () => {
    console.log('arrow left clicked !')
    navigation.goBack()
  }

  const onClickButtonBug = () => {
    console.log('Signaler un bug')
    navigation.navigate('ReportBugPage')
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        testID="button-left-arrow"
        style={{
          position: 'absolute',
          top: 40,
          left: 30,
          zIndex: 1,
        }}
        onPress={() => goBack()}
      >
        <Icon testID="document-logo" name="arrow-left" size={30} />
      </TouchableOpacity>
      <View style={{ alignItems: 'center' }}>
        <View style={{ alignItems: 'flex-start', marginTop: '17%' }}>
          <Image
            style={{ alignSelf: 'center', width: 120, height: 120 }}
            source={require('../../../assets/SettingsLogo.png')}
          />
          <Text
            style={{
              marginBottom: 40,
              marginTop: 20,
              fontSize: 30,
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            Vos préférences
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <TouchableOpacity
          onPress={onClickButtonBug}
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
            Signaler un bug
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

SettingsPage.propTypes = {
  navigation: PropTypes.object.isRequired,
}
