import React from 'react'
import { Text, View, TouchableOpacity, Dimensions } from 'react-native'
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

  const onClickRightArrow = () => {
    console.log('Menu ' + props.name)
    props.navigation.navigate(props.goTo)
  }
  return (
    <View
      testID="box-menu"
      style={{
        flex: 1,
        justifyContent: 'center',
        top: -height * 0.25,
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
        size={width * 0.09}
      />
      <Text
        testID="text-menu"
        style={{
          marginLeft: -width * 0.2,
          textAlign: 'center',
          color: 'black',
          fontWeight: 'bold',
          fontSize: width * 0.045,
        }}
      >
        {props.name}
      </Text>

      <TouchableOpacity
        testID="button-right-arrow"
        style={{ flex: 1, zIndex: 1, position: 'absolute' }}
        onPress={onClickRightArrow}
      >
        <Icon
          style={{ marginLeft: '90%' }}
          name="chevron-forward-outline"
          size={width * 0.09}
        />
      </TouchableOpacity>
    </View>
  )
}
