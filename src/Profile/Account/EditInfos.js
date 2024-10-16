import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import PropTypes from 'prop-types'
import { StayAliveColors } from '../../Style/StayAliveStyle'
import Icon from 'react-native-vector-icons/FontAwesome'

const { width, height } = Dimensions.get('window')

export function EditInfosMenu(props) {
  EditInfosMenu.propTypes = {
    name: PropTypes.string.isRequired,
    indexVariable: PropTypes.string.isRequired,
    variable: PropTypes.object.isRequired,
    setVariable: PropTypes.func.isRequired,
    marginLeft: PropTypes.number.isRequired,
  }
  console.log(props.variable)

  const [editable, setEditable] = useState(false)
  const [textValue, setTextValue] = useState('')

  useEffect(() => {
    if (props.variable && props.variable[props.indexVariable] !== undefined) {
      setTextValue(
        props.indexVariable === 'phone' || props.indexVariable === 'email'
          ? props.variable[props.indexVariable].phone ??
              props.variable[props.indexVariable].email
          : props.variable[props.indexVariable] ?? ''
      )
    }
  }, [props.variable, props.indexVariable])

  const handleEditClick = () => {
    if (props.indexVariable === 'phone' || props.indexVariable === 'email') {
      setEditable(true)
      setTextValue(
        props.variable[props.indexVariable]?.phone ??
          props.variable[props.indexVariable]?.email
      )
    }
  }

  const handleSaveClick = () => {
    setEditable(false)
    console.log(textValue)

    const updatedProfileData = {
      ...props.variable,
      [props.indexVariable]: {
        ...props.variable[props.indexVariable],
        email: textValue,
        phone: textValue,
      },
    }

    props.setVariable(updatedProfileData)
  }

  return (
    <View
      testID="box-menu"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        top: -height * 0.34,
        borderWidth: 2,
        height: height * 0.07,
        borderColor: 'lightgray',
      }}
    >
      <Text
        testID="text-menu"
        style={{
          color: StayAliveColors.StayAliveRed,
          fontWeight: 'bold',
          fontSize: width * 0.045,
          marginLeft: height * 0.04,
        }}
      >
        {props.name} :
      </Text>
      {editable ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            testID="text-input"
            style={{
              marginLeft: props.marginLeft,
              textAlign: 'left',
              color: 'blue',
              fontWeight: 'bold',
              fontSize: width * 0.04,
              maxWidth: width * 0.5,
            }}
            value={textValue}
            onChangeText={(newText) => setTextValue(newText)}
          />
          <TouchableOpacity
            onPress={handleSaveClick}
            style={{ marginLeft: height * 0.01 }}
          >
            <Icon
              name="save"
              size={width * 0.05}
              color={StayAliveColors.StayAliveRed}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            testID="text-element"
            style={{
              marginLeft: props.marginLeft,
              textAlign: 'left',
              color: StayAliveColors.black,
              fontWeight: 'bold',
              fontSize: width * 0.04,
            }}
          >
            {props.indexVariable === 'phone' || props.indexVariable === 'email'
              ? props.variable[props.indexVariable]?.email ??
                props.variable[props.indexVariable]?.phone
              : props.variable[props.indexVariable] ?? ''}
          </Text>
          {(props.indexVariable === 'phone' ||
            props.indexVariable === 'email') && (
            <TouchableOpacity
              onPress={handleEditClick}
              style={{ marginLeft: height * 0.02 }}
            >
              <Icon
                name="pencil"
                size={width * 0.05}
                color={StayAliveColors.StayAliveRed}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )
}
