import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'
import Snackbar from 'react-native-snackbar'
import { TextInputStayAlive } from './textInputStayAlive'
import { colors } from '../Style/StayAliveStyle'
import { SlideInView } from '../Animations/Animations'
import PropTypes from 'prop-types'
import { urlApi } from '../Utils/Api'

export default function RegistrationPage({ navigation }) {
  const [names, onChangeNames] = useState('')
  const [email, onChangeEmail] = useState('')
  const [password, onChangePassword] = useState('')
  const [phone, onChangePhone] = useState('')
  const [selectCGUV, setSelectionCGUV] = useState(false)

  RegistrationPage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  useEffect(() => {}, [])
  const onClickJoinUs = async () => {
    console.log(`${urlApi}/rescuer/auth/register`)

    let message = ''
    let code = 0
    const namesSplited = names.split(' ')

    if (selectCGUV !== false) {
      try {
        console.log(email)
        console.log(namesSplited[1])
        console.log(namesSplited[0])
        console.log(phone)
        console.log(password)
        const requestBody = {
          email,
          firstname: namesSplited[1],
          lastname: namesSplited[0],
          password,
          phone,
        }
        const response = await fetch(`${urlApi}/rescuer/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })
        const responseData = await response.json()
        message = responseData.message
        code = response.status
      } catch (error) {
        console.log('Erreur lors de la requête POST :', error)
      }
    } else message = 'Vous devez acceptez nos CGU et nos CGV'
    Snackbar.show({
      text: message.toString(),
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: 'white',
      textColor: code === 200 || code === 201 ? 'green' : 'red',
    })
  }

  return (
    <SlideInView duration={400} value={200}>
      <ScrollView>
        <View
          style={{
            position: 'absolute',
            bottom: 30,
            right: -420,
            width: 500,
            height: 500,
            borderRadius: 10000,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={[colors.StayAliveRed, colors.white]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: -150,
            right: -150,
            width: 300,
            height: 300,
            borderRadius: 10000,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={[colors.StayAliveRed, colors.white]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{ flex: 1, zIndex: 1 }}
            onPress={() => navigation.goBack()}
          >
            <Icon
              name="arrow-left"
              size={30}
              style={{
                marginTop: 20,
                marginLeft: 20,
              }}
              onPress={() => navigation.navigate('LoginPage')}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              style={{
                width: 400,
                height: 400,
                marginTop: -100,
                resizeMode: 'contain',
              }}
              source={require('../../assets/StayAlive1.png')}
            />
            <Image
              style={{
                width: 160,
                height: 160,
                borderRadius: 40,
                marginTop: -180,
                resizeMode: 'contain',
              }}
              source={require('../../assets/StayAlive-logo.png')}
            />
            <Text
              style={{
                marginTop: 14,
                fontSize: 22,
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              Nous rejoindre
            </Text>

            <View style={{ marginTop: 15 }}>
              <TextInputStayAlive
                valueTestID="names-input"
                text="Votre nom et prénom"
                field={names}
                onChangeField={onChangeNames}
                label="Nom et Prénom"
                secureTextEntry={false}
              />
              <TextInputStayAlive
                valueTestID="email-input"
                text="Votre adresse E-mail"
                field={email}
                onChangeField={onChangeEmail}
                label="E-mail"
                style={{ marginTop: -50 }}
              />
              <TextInputStayAlive
                valueTestID="password-input"
                text="Votre mot de passe"
                field={password}
                onChangeField={onChangePassword}
                label="Mot de passe"
                secureTextEntry
              />
              <TextInputStayAlive
                valueTestID="phone-input"
                text="Votre téléphone"
                field={phone}
                onChangeField={onChangePhone}
                label="(+33) 01 02 03 04 05"
                secureTextEntry={false}
              />
              {/* Ajoutez les autres TextInputStayAlive */}
            </View>
            <View
              style={{
                marginTop: 2,
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: -70,
              }}
            >
              <CheckBox
                testID="checkboxCGUV"
                value={selectCGUV}
                onValueChange={setSelectionCGUV}
                tintColors={{ true: colors.StayAliveRed }}
              />
              <Text>Accepter nos </Text>
              <Text style={{ color: colors.StayAliveRed }}>CGU</Text>
              <Text> et nos </Text>
              <Text style={{ color: colors.StayAliveRed }}>CGV</Text>
            </View>

            <TouchableOpacity
              onPress={onClickJoinUs}
              style={{
                marginTop: 20,
                borderWidth: 3,
                borderRadius: 50,
                borderColor: colors.StayAliveRed,
                paddingHorizontal: 50,
                paddingVertical: 10,
                backgroundColor: 'white',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  color: colors.StayAliveRed,
                  fontWeight: 'bold',
                }}
                testID="joinUs-button"
              >
                Nous rejoindre
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SlideInView>
  )
}
