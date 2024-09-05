import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'
import Snackbar from 'react-native-snackbar'
import { TextInputStayAlive } from './textInputStayAlive'
import { StayAliveColors } from '../Style/StayAliveStyle'
import { SlideInView } from '../Animations/Animations'
import PropTypes from 'prop-types'
import { urlApi } from '../Utils/Api'

const { width, height } = Dimensions.get('window')

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
      <View
        style={{
          position: 'absolute',
          bottom: 30,
          right: -height * 0.53,
          width: width * 1.27,
          height: 500,
          borderRadius: 10000,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[StayAliveColors.StayAliveRed, StayAliveColors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: -height * 0.19,
          right: -width * 0.4,
          width: width * 0.75,
          height: height * 0.38,
          borderRadius: 10000,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[StayAliveColors.StayAliveRed, StayAliveColors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>
      <ScrollView>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{ flex: 1, zIndex: 1 }}
            onPress={() => navigation.goBack()}
          >
            <Icon
              name="arrow-left"
              size={30}
              style={{
                marginTop: height * 0.05,
                marginLeft: width * 0.07,
              }}
              onPress={() => navigation.navigate('LoginPage')}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              style={{
                width: width * 0.8,
                height: height * 0.39,
                marginTop: -height * 0.13,
                resizeMode: 'contain',
              }}
              source={require('../../assets/StayAlive1.png')}
            />
            <Image
              style={{
                width: width * 0.3,
                height: height * 0.15,
                borderRadius: 40,
                marginTop: -height * 0.17,
                resizeMode: 'contain',
              }}
              source={require('../../assets/StayAlive-logo.png')}
            />
            <Text
              style={{
                marginTop: height * 0.01,
                fontSize: width * 0.05,
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              Nous rejoindre
            </Text>

            <View style={{ marginTop: height * 0.02 }}>
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
                tintColors={{ true: StayAliveColors.StayAliveRed }}
              />
              <Text>Accepter nos </Text>
              <Text style={{ color: StayAliveColors.StayAliveRed }}>CGU</Text>
              <Text> et nos </Text>
              <Text style={{ color: StayAliveColors.StayAliveRed }}>CGV</Text>
            </View>

            <TouchableOpacity
              onPress={onClickJoinUs}
              style={{
                marginTop: height * 0.01,
                borderWidth: 3,
                borderRadius: 50,
                borderColor: StayAliveColors.StayAliveRed,
                paddingHorizontal: width * 0.1,
                paddingVertical: height * 0.012,
                backgroundColor: 'white',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: width * 0.045,
                  color: StayAliveColors.StayAliveRed,
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
