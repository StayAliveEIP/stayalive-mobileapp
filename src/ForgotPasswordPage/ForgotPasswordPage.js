import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { FadeInView } from '../Animations/Animations'
import { StayAliveColors } from '../Style/StayAliveStyle'
import { TextInputStayAlive } from '../Utils/textInputStayAlive'
import Snackbar from 'react-native-snackbar'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import { urlApi } from '../Utils/Api'

const { width, height } = Dimensions.get('window')

export default function ForgotPasswordPage({ navigation }) {
  const [email, onChangeEmail] = useState('')
  const [token, onChangeToken] = useState('')
  const [newPassword, onChangeNewPassword] = useState('')
  const [confirmPassword, onChangeConfirmPassword] = useState('')
  const [resetStep, setResetStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  ForgotPasswordPage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  const resetPassword = async () => {
    setIsLoading(true)
    try {
      const url = `${urlApi}/rescuer/forgot-password/link?email=${encodeURIComponent(
        email
      )}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      if (response.ok) {
        setResetStep(1)
      } else {
        const message = data.message
        const code = response.status
        Snackbar.show({
          text: message.toString(),
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'white',
          textColor: code === 200 || code === 201 ? 'green' : 'red',
        })
      }
    } catch (error) {
      console.error('Error during password reset link request:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitNewPassword = async () => {
    if (newPassword !== confirmPassword) {
      Snackbar.show({
        text: 'Les mots de passe ne correspondent pas.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'white',
        textColor: 'red',
      })
      return
    }

    setIsLoading(true)
    try {
      const url = `${urlApi}/rescuer/forgot-password/reset`
      const body = {
        token,
        password: newPassword,
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const responseData = await response.json()
      if (response.ok) {
        setResetStep(2)
      } else {
        const message = responseData.message
        const code = response.status
        Snackbar.show({
          text: message.toString(),
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'white',
          textColor: code === 200 || code === 201 ? 'green' : 'red',
        })
      }
    } catch (error) {
      console.error('Error during password reset request:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    console.log('Go back !')
    navigation.goBack()
  }

  return (
    <FadeInView duration={200}>
      <ScrollView>
        <TouchableOpacity
          testID={'back-button'}
          style={{ flex: 1, zIndex: 1 }}
          onPress={() => goBack()}
        >
          <Icon
            name="arrow-left"
            size={30}
            style={{
              marginTop: height * 0.03,
              marginLeft: width * 0.06,
            }}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image
            testID="forgot-password-logo"
            style={{
              width: width * 0.5,
              height: height * 0.25,
              resizeMode: 'contain',
            }}
            source={require('../../assets/ForgotPasswordLogo.png')}
          />
          <Text
            style={{
              marginTop: height * -0.02,
              fontSize: width * 0.06,
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            {resetStep === 0
              ? 'Mot de passe oublié ?'
              : 'Réinitialisation du mot de passe'}
          </Text>
          <Text
            style={{
              marginTop: height * 0.03,
              fontSize: width * 0.04,
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            Vous avez oublié votre mot de passe ?
          </Text>

          <View
            style={{
              marginTop: height * 0.03,
              paddingHorizontal: 20,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: width * 0.04,
                marginBottom: height * 0.01,
                color: 'black',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Pas de panique, entrez votre adresse email ci-dessous, et nous
              vous enverrons un e-mail avec les instructions pour réinitialiser
              votre mot de passe !
            </Text>
          </View>

          {resetStep === 0 ? (
            <>
              <TextInputStayAlive
                valueTestID="forgotpass-email-input"
                testID="forgotpass-email-input"
                text="Votre adresse E-mail"
                field={email}
                onChangeField={onChangeEmail}
                label="E-mail"
                numberOfLines={1}
              />
              <TouchableOpacity
                onPress={resetPassword}
                style={{
                  marginTop: height * 0.07,
                  borderWidth: 3,
                  borderRadius: 50,
                  borderColor: StayAliveColors.StayAliveRed,
                  paddingHorizontal: 50,
                  paddingVertical: 10,
                  backgroundColor: StayAliveColors.StayAliveRed,
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: width * 0.04,
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                    testID="login-button"
                  >
                    Envoyer un e-mail
                  </Text>
                )}
              </TouchableOpacity>
            </>
          ) : resetStep === 1 ? (
            <View>
              <TextInputStayAlive
                valueTestID="resetpass-token-input"
                testID="resetpass-token-input"
                text="Entrez le token"
                field={token}
                onChangeField={onChangeToken}
                label="Token de validation"
                numberOfLines={1}
              />
              <TextInputStayAlive
                valueTestID="password-input"
                text="Votre mot de passe"
                field={newPassword}
                onChangeField={onChangeNewPassword}
                label="Mot de passe"
                secureTextEntry={true}
                numberOfLines={1}
              />

              <TextInputStayAlive
                valueTestID="password-input"
                text="Votre mot de passe"
                field={confirmPassword}
                onChangeField={onChangeConfirmPassword}
                label="Mot de passe"
                secureTextEntry={true}
                numberOfLines={1}
              />
              <TouchableOpacity
                onPress={submitNewPassword}
                style={{
                  marginTop: height * 0.01,
                  marginBottom: 10,
                  borderWidth: 3,
                  borderRadius: 50,
                  borderColor: StayAliveColors.StayAliveRed,
                  paddingHorizontal: width * 0.08,
                  paddingVertical: height * 0.01,
                  backgroundColor: StayAliveColors.StayAliveRed,
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: width * 0.037,
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                    testID="submit-newpassword-button"
                  >
                    Réinitialiser mon mot de passe
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <Text
              style={{
                marginTop: height * 0.03,
                fontSize: width * 0.04,
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              Mot de passe réinitialisé avec succès !
            </Text>
          )}
        </View>
      </ScrollView>
    </FadeInView>
  )
}
