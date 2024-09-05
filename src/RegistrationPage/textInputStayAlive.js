import React from 'react'
import { Text, TextInput, View, Dimensions } from 'react-native'
import { StayAliveColors } from '../Style/StayAliveStyle'
import PropTypes from 'prop-types'

const { width, height } = Dimensions.get('window');

export function TextInputStayAlive(props) {
  TextInputStayAlive.propTypes = {
    text: PropTypes.string.isRequired,
    valueTestID: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChangeField: PropTypes.func.isRequired,
    field: PropTypes.string.isRequired,
    secureTextEntry: PropTypes.bool,
  }

  return (
    <View
      style={{
        marginTop: 7,
      }}
    >
      <Text
        style={{
          color: StayAliveColors.black,
          fontWeight: 'bold',
          fontSize: width * 0.035,
        }}
      >
        {props.text}
      </Text>
      <TextInput
        testID={props.valueTestID}
        style={{
          height: height * 0.06,
          width: width * 0.65,
          borderWidth: 1,
          borderRadius: 7,
          marginTop: height * 0.004,
          borderColor: StayAliveColors.lightgray,
        }}
        placeholder={props.label}
        onChangeText={props.onChangeField}
        value={props.field}
        secureTextEntry={props.secureTextEntry}
      />
    </View>
  )
}
