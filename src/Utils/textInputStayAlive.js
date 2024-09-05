import React from 'react'
import { Text, TextInput, View, Dimensions } from 'react-native'
import { StayAliveColors } from '../Style/StayAliveStyle'
import PropTypes from 'prop-types'

const { height } = Dimensions.get('window')

export function TextInputStayAlive(props) {
  TextInputStayAlive.propTypes = {
    text: PropTypes.string.isRequired,
    valueTestID: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChangeField: PropTypes.func.isRequired,
    field: PropTypes.string.isRequired,
    secureTextEntry: PropTypes.bool,
    multiline: PropTypes.bool,
    maxLength: PropTypes.number,
    numberOfLines: PropTypes.number,
  }

  const maxTextInputHeight = props.numberOfLines
    ? props.numberOfLines * height * 0.02
    : null

  return (
    <View style={{ marginTop: 7 }}>
      <Text
        style={{
          color: StayAliveColors.black,
          fontWeight: 'bold',
          fontSize: 12,
          alignSelf: 'flex-start',
        }}
      >
        {props.text}
      </Text>
      <TextInput
        testID={props.valueTestID}
        style={{
          width: 280,
          borderWidth: 1,
          borderRadius: 7,
          marginTop: 4,
          borderColor: StayAliveColors.lightgray,
          padding: 10,
          minHeight: 45,
          textAlignVertical: 'top',
          maxHeight: maxTextInputHeight,
        }}
        placeholder={props.label}
        onChangeText={props.onChangeField}
        value={props.field}
        secureTextEntry={props.secureTextEntry}
        multiline={props.multiline}
        maxLength={props.maxLength}
        numberOfLines={props.numberOfLines}
        autoCapitalize={'none'}
      />
    </View>
  )
}
