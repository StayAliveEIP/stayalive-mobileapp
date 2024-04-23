import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'

export default function SettingsPage({ navigation }) {
  SettingsPage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  const goBack = () => {
    console.log('arrow left clicked !')
    navigation.goBack()
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        testID="button-left-arrow"
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1,
        }}
        onPress={() => goBack()}
      >
        <Icon testID="document-logo" name="arrow-left" size={30} />
      </TouchableOpacity>
    </View>
  )
}

SettingsPage.propTypes = {
  navigation: PropTypes.object.isRequired,
}
