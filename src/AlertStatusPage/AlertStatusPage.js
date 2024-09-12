import React from 'react'
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import { StayAliveColors } from '../Style/StayAliveStyle'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from '../Utils/Api'

const { width, height } = Dimensions.get('window')

export default function AlertStatusPage({ navigation, route }) {
  const { dataAlert } = route.params

  AlertStatusPage.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.shape({
      params: PropTypes.shape({
        dataAlert: PropTypes.shape({
          emergency: PropTypes.shape({
            id: PropTypes.string.isRequired,
            address: PropTypes.string,
            info: PropTypes.string,
          }),
        }),
      }),
    }),
  }

  const RefuseAlert = async () => {
    console.log('You refuse the alert !')
    try {
      const token = await AsyncStorage.getItem('userToken')
      const emergencyId = dataAlert?.emergency?.id

      if (emergencyId && token) {
        const acceptUrl = `${urlApi}/rescuer/emergency/refuse?id=${emergencyId}`
        const response = await fetch(acceptUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          console.log('Emergency refused successfully')
          navigation.navigate('UnavailableAvailablePage')
        } else {
          console.error('Failed to refuse emergency')
        }
      } else {
        console.error('Emergency ID not found')
      }
    } catch (error) {
      console.error('Error refusing emergency:', error)
    }
  }

  const AcceptAlert = async () => {
    console.log('You accept the alert !')
    try {
      const token = await AsyncStorage.getItem('userToken')
      const emergencyId = dataAlert?.emergency?.id

      if (emergencyId && token) {
        const acceptUrl = `${urlApi}/rescuer/emergency/accept?id=${emergencyId}`
        const response = await fetch(acceptUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          console.log('Emergency accepted successfully')

          navigation.navigate('Maps', { data: dataAlert })
        } else {
          console.error('Failed to accept emergency')
        }
      } else {
        console.error('Emergency ID not found')
      }
    } catch (error) {
      console.error('Error accepting emergency:', error)
    }
  }

  const goProfilePage = () => {
    navigation.push('ProfilePage')
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={goProfilePage}
        style={{
          position: 'absolute',
          top: height * 0.05,
          right: width * 0.05,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Image
          testID="profile-badge-image"
          style={{ width: width * 0.14, height: height * 0.07 }}
          source={require('../../assets/ProfileBadge.png')}
        />
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: height * 0.2,
        }}
      >
        <Text style={{ fontSize: width * 0.06, color: 'black' }}>
          Votre statut:
        </Text>
        <Text
          testID="status-text"
          style={{
            fontSize: width * 0.065,
            fontWeight: 'bold',
            color: StayAliveColors.StayAliveRed,
            marginTop: height * 0.01,
          }}
        >
          En attente de réponse ...
        </Text>

        <Image
          testID="unavailable-logo"
          style={{
            width: width * 0.38,
            height: height * 0.2,
            marginTop: height * 0.02,
          }}
          source={require('../../assets/WarningLogo.png')}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row', // Assure que les éléments sont disposés horizontalement
          justifyContent: 'flex-start', // Aligne les éléments sur l'axe principal (horizontalement) à gauche
          alignItems: 'center',
          maxWidth: width * 0.7,
        }}
      >
        <View
          style={{
            marginRight: width * 0.02,
            backgroundColor: 'lightcoral',
            borderRadius: 100,
            padding: 10,
            marginLeft: width * 0.05,
          }}
        >
          <Icon name="flag-o" size={width * 0.07} color="red" />
        </View>
        <View>
          <Text
            style={{
              textAlign: 'left',
              fontSize: width * 0.05,
              color: 'gray',
              fontWeight: 'bold',
            }}
          >
            Destination
          </Text>
          <Text
            style={{
              textAlign: 'left',
              fontSize: width * 0.04,
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            {dataAlert?.emergency?.address}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: height * 0.07,
          maxWidth: width * 0.7,
          marginTop: -height * 0.06,
        }}
      >
        <View
          style={{
            marginRight: width * 0.02,
          }}
        >
          <View
            style={{
              backgroundColor: 'lightcoral',
              borderRadius: 100,
              padding: 10,
              aspectRatio: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: width * 0.05,
            }}
          >
            <Icon name="user-o" size={width * 0.07} color="red" />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
          }}
        >
          <Text
            style={{
              textAlign: 'left',
              fontSize: width * 0.05,
              color: 'gray',
              fontWeight: 'bold',
            }}
          >
            Personne à secourir
          </Text>
          <Text
            style={{
              textAlign: 'left',
              fontSize: width * 0.04,
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            {dataAlert?.emergency?.info}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={AcceptAlert}
        style={{
          marginTop: height * 0.02,
          marginBottom: height * 0.01,
          borderWidth: 3,
          borderRadius: 50,
          borderColor: StayAliveColors.StayAliveRed,
          paddingHorizontal: width * 0.09,
          paddingVertical: height * 0.013,
          backgroundColor: StayAliveColors.StayAliveRed,
          maxWidth: width * 0.7,
          alignSelf: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: width * 0.04,
            color: 'white',
            fontWeight: 'bold',
          }}
          testID="login-button"
        >
          Accepter l'alerte
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={RefuseAlert}
        style={{
          marginBottom: height * 0.07,
          borderWidth: 3,
          borderRadius: 50,
          borderColor: StayAliveColors.StayAliveRed,
          paddingHorizontal: width * 0.09,
          paddingVertical: height * 0.013,
          backgroundColor: 'white',
          maxWidth: width * 0.7,
          alignSelf: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: width * 0.04,
            color: StayAliveColors.StayAliveRed,
            fontWeight: 'bold',
          }}
          testID="joinUs-button"
        >
          Refuser l'alerte
        </Text>
      </TouchableOpacity>
    </View>
  )
}

AlertStatusPage.propTypes = {
  navigation: PropTypes.object.isRequired,
}
