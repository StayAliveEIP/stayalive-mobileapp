import React from 'react'
import { View, TouchableOpacity, Image, Text, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import { StayAliveColors } from '../../Style/StayAliveStyle'

const { width, height } = Dimensions.get('window');

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
          top: height * 0.05,
          left: width * 0.1,
          zIndex: 1,
        }}
        onPress={() => goBack()}
      >
        <Icon testID="document-logo" name="arrow-left" size={width * 0.08} />
      </TouchableOpacity>
      <View style={{ alignItems: 'center' }}>
        <View style={{ alignItems: 'flex-start', marginTop: '17%' }}>
          <Image
            style={{ alignSelf: 'center', width: width * 0.32, height: height * 0.18 }}
            source={require('../../../assets/SettingsLogo.png')}
          />
          <Text
            style={{
              marginTop: height * 0.02,
              fontSize: width * 0.06,
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
            bottom: height * 0.04,
            borderWidth: 4,
            borderRadius: 50,
            borderColor: StayAliveColors.StayAliveRed,
            paddingHorizontal: width * 0.1,
            paddingVertical: height * 0.02,
            backgroundColor: 'transparent',
          }}
          testID="indisponible-button"
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: width * 0.04,
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
