import React, { useState } from 'react'
import { Text, View, TextInput, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { colors } from '../../Style/StayAliveStyle'

export function EditInfosMenu(props) {
  EditInfosMenu.propTypes = {
    name: PropTypes.string.isRequired,
    indexVariable: PropTypes.string.isRequired,
    variable: PropTypes.object.isRequired,
    setVariable: PropTypes.func.isRequired,
    edit: PropTypes.bool.isRequired,
  }

  const [loaded, setLoaded] = useState(false)

  if (!props.variable && loaded === false) {
    setLoaded(true)
    return (
      <View
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <ActivityIndicator size="small" color={colors.StayAliveRed} />
      </View>
    )
  }
  const textValue =
    props.variable && props.variable[props.indexVariable] !== null
      ? props.indexVariable === 'phone' || props.indexVariable === 'email'
        ? props.variable[props.indexVariable]?.[props.indexVariable] ?? ''
        : props.variable[props.indexVariable] ?? ''
      : ''

  const calculateFontSize = () => {
    const baseFontSize = 20
    const minFontSize = 12

    const lengthFactor = textValue.length / 7
    const calculatedSize = baseFontSize - Math.floor(lengthFactor)

    return isNaN(calculatedSize)
      ? baseFontSize
      : Math.max(minFontSize, calculatedSize)
  }

  return (
    <View
      testID="box-menu"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        top: -160,
        borderWidth: 2,
        width: '100%',
        height: 60,
        borderColor: 'lightgray',
      }}
    >
      <Text
        testID="text-menu"
        style={{
          color: colors.StayAliveRed,
          fontWeight: 'bold',
          fontSize: 20,
          marginLeft: 40,
        }}
      >
        {props.name} :
      </Text>
      {props.edit === true ? (
        <TextInput
          testID="text-input"  // Ajout du testID pour le TextInput
          style={{
            marginLeft: 30,
            textAlign: 'left',
            color: 'blue',
            fontWeight: 'bold',
            fontSize: calculateFontSize(),
          }}
          value={textValue}
          onChangeText={(newText) => {
            let updatedProfileData;

            if (
              props.indexVariable === 'phone' ||
              props.indexVariable === 'email'
            ) {
              updatedProfileData = {
                ...props.variable,
                [props.indexVariable]: {
                  ...props.variable[props.indexVariable],
                  [props.indexVariable]: newText,
                },
              };
            } else {
              updatedProfileData = {
                ...props.variable,
                [props.indexVariable]: newText,
              };
            }

            props.setVariable(updatedProfileData);
          }}
        />
      ) : (
        <Text
          testID="text-element"  // Ajout du testID pour le Text
          style={{
            marginLeft: 30,
            textAlign: 'left',
            color: colors.black,
            fontWeight: 'bold',
            fontSize: calculateFontSize(),
          }}
        >
          {textValue}
        </Text>
      )}
    </View>
  )
}
