import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Dimensions,
  StyleSheet,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FadeInView } from '../Animations/Animations'
import { StayAliveColors } from '../Style/StayAliveStyle'
import { TextInputStayAlive } from '../Utils/textInputStayAlive'
import PropTypes from 'prop-types'
import { urlApi } from '../Utils/Api'

import Icon from 'react-native-vector-icons/Feather'

const { width, height } = Dimensions.get('window')

export default function LoginPage({ navigation }) {
  const [email, onChangeEmail] = useState('')
  const [password, onChangePassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  LoginPage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  const getAccountInfos = async () => {
    const token = await AsyncStorage.getItem('userToken')
    const url = `${urlApi}/rescuer/account`

    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        return Promise.reject(new Error('Failed to send position'))
      })
      .then((data) => {
        console.log('Account infos: ', data)
        return data
      })
      .catch((error) => {
        console.error('There was an issue with the fetch operation:', error)
        Alert.alert('Erreur', 'We could not send your position', [
          { text: 'OK' },
        ])
      })
  }

  const onClickLogin = () => {
    const url = `${urlApi}/rescuer/auth/login`
    const body = JSON.stringify({
      email,
      password,
    })

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        Alert.alert('Erreur', 'Mauvais identifiants ou mot de passe')
        return Promise.reject(new Error('Invalid credentials'))
      })
      .then(async (data) => {
        const token = data.accessToken.split(' ')[1]
        await AsyncStorage.setItem('userToken', token)
        const accountData = await getAccountInfos()
        await AsyncStorage.setItem('userId', accountData?._id)
        navigation.navigate('UnavailableAvailablePage')
      })
      .catch((error) => {
        if (error.message !== 'Invalid credentials') {
          Alert.alert(
            'Erreur',
            'Nous ne parvenons pas à contacter nos serveurs'
          )
        }
      })
  }

  const onClickJoin = () => {
    navigation.navigate('RegistrationPage')
  }

  const onClickLoginWithGoogle = () => {
    console.log('Google !')
  }

  const onClickForgotPassword = () => {
    navigation.navigate('ForgotPasswordPage')
  }

  return (
    <FadeInView duration={200}>
      <View style={[styles.gradientCircle, styles.gradientCircle1]}>
        <LinearGradient
          colors={[StayAliveColors.StayAliveRed, StayAliveColors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </View>
      <View style={[styles.gradientCircle, styles.gradientCircle2]}>
        <LinearGradient
          colors={[StayAliveColors.StayAliveRed, StayAliveColors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Image
            style={styles.mainImage}
            source={require('../../assets/StayAlive2.png')}
          />
          <Image
            style={styles.logoImage}
            source={require('../../assets/StayAlive-logo.png')}
          />
          <Text style={styles.title}>Accéder à votre espace</Text>

          <View style={styles.formContainer}>
            <TextInputStayAlive
              valueTestID="login-email-input"
              text="Votre adresse E-mail"
              field={email}
              onChangeField={onChangeEmail}
              label="E-mail"
            />

            <View style={styles.passwordContainer}>
              <TextInputStayAlive
                valueTestID="login-password-input"
                text="Votre mot de passe"
                field={password}
                onChangeField={onChangePassword}
                label="Mot de passe"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onClickForgotPassword}>
              <Text style={styles.forgotPasswordText}>
                Vous avez oublié votre mot de passe ?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClickLogin} style={styles.loginButton}>
            <Text style={styles.loginButtonText} testID="login-button">
              Se connecter
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClickJoin} style={styles.joinButton}>
            <Text style={styles.joinButtonText} testID="join-button">
              Nous rejoindre
            </Text>
          </TouchableOpacity>

          <Text style={styles.orText}>OU</Text>

          <TouchableOpacity
            onPress={onClickLoginWithGoogle}
            style={styles.googleButton}
          >
            <Image
              style={styles.googleIcon}
              source={require('../../assets/GoogleLogo.png')}
            />
            <Text style={styles.googleButtonText} testID="login-button-google">
              Se connecter avec Google
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </FadeInView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: 10000,
    overflow: 'hidden',
  },
  gradientCircle1: {
    bottom: '-2%',
    left: '-110%',
    width: width * 1.23,
    height: height * 0.55,
  },
  gradientCircle2: {
    bottom: '-17%',
    left: '-40%',
    width: width * 0.7,
    height: height * 0.36,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImage: {
    width: width * 0.9,
    height: height * 0.3,
    resizeMode: 'cover',
  },
  logoImage: {
    width: width * 0.31,
    height: height * 0.15,
    borderRadius: 40,
    marginTop: -height * 0.1,
    resizeMode: 'contain',
  },
  title: {
    marginTop: height * 0.01,
    fontSize: width * 0.05,
    color: 'black',
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: height * 0.01,
    width: '90%',
  },
  forgotPasswordText: {
    fontWeight: 'bold',
    marginTop: height * 0.01,
    color: StayAliveColors.StayAliveRed,
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 3,
    borderRadius: 50,
    borderColor: StayAliveColors.StayAliveRed,
    paddingHorizontal: width * 0.12,
    paddingVertical: height * 0.012,
    backgroundColor: StayAliveColors.StayAliveRed,
  },
  loginButtonText: {
    textAlign: 'center',
    fontSize: width * 0.04,
    color: 'white',
    fontWeight: 'bold',
  },
  joinButton: {
    marginBottom: height * 0.02,
    borderWidth: 3,
    borderRadius: 50,
    borderColor: StayAliveColors.StayAliveRed,
    paddingHorizontal: 50,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  joinButtonText: {
    textAlign: 'center',
    fontSize: width * 0.04,
    color: StayAliveColors.StayAliveRed,
    fontWeight: 'bold',
  },
  orText: {
    marginBottom: height * 0.03,
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: StayAliveColors.StayAliveRed,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderRadius: 50,
    borderColor: StayAliveColors.StayAliveRed,
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.012,
    backgroundColor: 'white',
  },
  googleIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: width * 0.04,
    color: StayAliveColors.StayAliveRed,
    fontWeight: 'bold',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: width * 0.04,
    bottom: height * 0.014,
    zIndex: 1,
  },
})
