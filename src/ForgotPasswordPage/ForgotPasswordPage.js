import React, { useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import { FadeInView } from '../Animations/Animations'
import { colors } from '../Style/StayAliveStyle'
import { TextInputStayAlive } from '../Utils/textInputStayAlive'
import Snackbar from 'react-native-snackbar'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'

export default function ForgotPasswordPage({ navigation }) {
  const [email, onChangeEmail] = useState('')
  const [token, onChangeToken] = useState('')
  const [newPassword, onChangeNewPassword] = useState('')
  const [confirmPassword, onChangeConfirmPassword] = useState('')
  const [resetStep, setResetStep] = useState(0)

  ForgotPasswordPage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  const resetPassword = async () => {
    try {
      const url = `http://api.stayalive.fr:3000/account/forgot-password/link?email=${encodeURIComponent(
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
    }
  }

  const submitNewPassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        Snackbar.show({
          text: 'Les mots de passe ne correspondent pas.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'white',
          textColor: 'red',
        })
        return
      }

      const url = `http://api.stayalive.fr:3000/account/forgot-password/reset`
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
      console.error('Error during password reset link request:', error)
    }
  }

  return (
    <FadeInView duration={200}>
      <ScrollView>
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
            testID="forgot-password-logo"
            style={{
              width: 200,
              height: 200,
              marginTop: 60,
              resizeMode: 'contain',
            }}
            source={require('../../assets/ForgotPasswordLogo.png')}
          />
          <Text
            style={{
              marginTop: 0,
              fontSize: 22,
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
              marginTop: 50,
              fontSize: 16,
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            Vous avez oublié votre mot de passe ?
          </Text>

          <View
            style={{
              marginTop: 30,
              paddingHorizontal: 20,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                marginBottom: 20,
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
                text="Votre adresse E-mail"
                field={email}
                onChangeField={onChangeEmail}
                label="E-mail"
              />
              <TouchableOpacity
                onPress={resetPassword}
                style={{
                  marginTop: 80,
                  marginBottom: 10,
                  borderWidth: 3,
                  borderRadius: 50,
                  borderColor: colors.StayAliveRed,
                  paddingHorizontal: 50,
                  paddingVertical: 10,
                  backgroundColor: colors.StayAliveRed,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                  testID="login-button"
                >
                  Envoyer un e-mail
                </Text>
              </TouchableOpacity>
            </>
          ) : resetStep === 1 ? (
            <>
              <TextInputStayAlive
                valueTestID="resetpass-token-input"
                text="Entrez le token"
                field={token}
                onChangeField={onChangeToken}
                label="Token"
              />
              <TextInputStayAlive
                valueTestID="resetpass-newpassword-input"
                text="Entrez le nouveau mot de passe"
                field={newPassword}
                onChangeField={onChangeNewPassword}
                label="Nouveau mot de passe"
                secureTextEntry
              />
              <TextInputStayAlive
                valueTestID="resetpass-confirm-password-input"
                text="Confirmez le nouveau mot de passe"
                field={confirmPassword}
                onChangeField={onChangeConfirmPassword}
                label="Confirmez le mot de passe"
                secureTextEntry
              />
              <TouchableOpacity
                onPress={submitNewPassword}
                style={{
                  marginTop: 40,
                  marginBottom: 10,
                  borderWidth: 3,
                  borderRadius: 50,
                  borderColor: colors.StayAliveRed,
                  paddingHorizontal: 50,
                  paddingVertical: 10,
                  backgroundColor: colors.StayAliveRed,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                  testID="submit-newpassword-button"
                >
                  Réinitialiser mon mot de passe
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text
              style={{
                marginTop: 50,
                fontSize: 16,
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
