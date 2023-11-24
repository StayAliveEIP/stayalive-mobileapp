import React from 'react'
import { Text, TextInput, View } from 'react-native'
import { colors } from '../Style/StayAliveStyle'
import PropTypes from 'prop-types'

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
          color: colors.black,
          fontWeight: 'bold',
          fontSize: 16,
        }}
      >
        {props.text}
      </Text>
      <TextInput
        testID={props.valueTestID}
        style={{
          height: 45,
          width: 280,
          borderWidth: 1,
          borderRadius: 7,
          marginTop: 4,
          borderColor: colors.lightgray,
        }}
        placeholder={props.label}
        onChangeText={props.onChangeField}
        value={props.field}
        secureTextEntry={props.secureTextEntry}
      />
    </View>
  )
}
