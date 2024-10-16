import React from 'react'
import { Text, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import PropTypes from 'prop-types'

const { width, height } = Dimensions.get('window')

export function Menu(props) {
  Menu.propTypes = {
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    goTo: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  const onClickMenu = () => {
    console.log('Menu ' + props.name)
    props.navigation.navigate(props.goTo)
  }

  return (
    <TouchableOpacity
      testID="box-menu"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        top: -height * 0.25,
        width: '100%',
        height: height * 0.075,
        borderColor: 'gray',
        marginVertical: -1,
      }}
      onPress={onClickMenu}
    >
      <Icon
        testID="icon-menu"
        style={{ marginLeft: 30 }}
        name={props.icon}
        size={width * 0.08}
      />
      <Text
        testID="text-menu"
        style={{
          flex: 1,
          textAlign: 'center',
          color: 'black',
          fontWeight: 'bold',
          fontSize: width * 0.04,
        }}
      >
        {props.name}
      </Text>

      <Icon
        testID="button-right-arrow"
        style={{ marginRight: 30 }}
        name="chevron-forward-outline"
        size={width * 0.08}
      />
    </TouchableOpacity>
  )
}
