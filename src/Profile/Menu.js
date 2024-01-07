import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import PropTypes from 'prop-types'

export function Menu(props) {
  Menu.propTypes = {
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    goTo: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
}
  return (
    <View
      testID="box-menu"
      style={{
        flex: 1,
        justifyContent: 'center',
        top: -160,
        borderWidth: 2,
        width: '100%',
        height: 60,
        borderColor: 'gray',
      }}
    >
      <Icon
        testID="icon-menu"
        style={{ position: 'absolute', marginLeft: 30 }}
        name={props.icon}
        size={35}
      />
      <Text
        testID="text-menu"
        style={{
          marginLeft: -100,
          textAlign: 'center',
          color: 'black',
          fontWeight: 'bold',
          fontSize: 17,
        }}
      >
        {props.name}
      </Text>

      <TouchableOpacity
        testID="button-right-arrow"
        style={{ flex: 1, zIndex: 1, position: 'absolute' }}
        onPress={() => props.navigation.navigate(props.goTo)}
      >
        <Icon
          style={{ marginLeft: '90%' }}
          name="chevron-forward-outline"
          size={35}
        />
      </TouchableOpacity>
    </View>
  )
}
