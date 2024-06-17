import React from 'react'
import { Text, TextInput, View, Alert } from 'react-native'
import { StayAliveColors } from '../Style/StayAliveStyle'
import PropTypes from 'prop-types'

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
  const calculateActualLength = (text) => {
    let lengthWithLineBreaks = text.length
    const lineBreaksCount = (text.match(/\n/g) || []).length

    if (lineBreaksCount > 0) {
      lengthWithLineBreaks += lineBreaksCount * 35
    }

    return lengthWithLineBreaks
  }

  const handleSubmit = () => {
    const { field, maxLength } = props
    const actualLength = calculateActualLength(field)

    if (actualLength > maxLength) {
      Alert.alert(
        'Erreur',
        `Le texte dépasse la limite de ${maxLength} caractères (retours à la ligne comptent pour 35 caractères chacun)`
      )
      return
    }
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
          fontSize: 16,
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
