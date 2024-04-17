import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { colors } from '../Style/StayAliveStyle'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from '../Utils/Api'

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
          navigation.navigate('AvailablePage')
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
          console.log('Emergency accepted successfully');

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
          top: 50,
          right: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Image
          testID="profile-badge-image"
          style={{ width: 60, height: 60 }}
          source={require('../../assets/ProfileBadge.png')}
        />
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 150,
        }}
      >
        <Text style={{ fontSize: 24, color: 'black' }}>Votre statut:</Text>
        <Text
          testID="status-text"
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.StayAliveRed,
            marginTop: 5,
          }}
        >
          En attente de réponse ...
        </Text>

        <Image
          testID="unavailable-logo"
          style={{ width: 150, height: 150, marginTop: 30 }}
          source={require('../../assets/WarningLogo.png')}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row', // Assure que les éléments sont disposés horizontalement
          justifyContent: 'flex-start', // Aligne les éléments sur l'axe principal (horizontalement) à gauche
          alignItems: 'center',
          marginLeft: 0,
          maxWidth: 300,
        }}
      >
        <View
          style={{
            marginRight: 10,
            backgroundColor: 'lightcoral',
            borderRadius: 100,
            padding: 10,
            marginLeft: 20,
          }}
        >
          <Icon name="flag-o" size={30} color="red" />
        </View>
        <View>
          <Text
            style={{
              textAlign: 'left',
              fontSize: 18,
              color: 'gray',
              fontWeight: 'bold',
            }}
          >
            Destination
          </Text>
          <Text
            style={{
              textAlign: 'left',
              fontSize: 16,
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
          marginBottom: 70,
          maxWidth: 350,
          marginTop: -50,
        }}
      >
        <View
          style={{
            marginRight: 10,
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
              marginLeft: 20,
            }}
          >
            <Icon name="user-o" size={30} color="red" />
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
              fontSize: 18,
              color: 'gray',
              fontWeight: 'bold',
            }}
          >
            Personne à secourir
          </Text>
          <Text
            style={{
              textAlign: 'left',
              fontSize: 16,
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
          marginTop: 20,
          marginBottom: 10,
          borderWidth: 3,
          borderRadius: 50,
          borderColor: colors.StayAliveRed,
          paddingHorizontal: 50,
          paddingVertical: 10,
          backgroundColor: colors.StayAliveRed,
          maxWidth: 500, // Ajoutez cette ligne pour définir une largeur maximale
          alignSelf: 'center', // Ajoutez cette ligne pour centrer le bouton horizontalement
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
          Accepter l'alerte
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={RefuseAlert}
        style={{
          marginBottom: 40,
          borderWidth: 3,
          borderRadius: 50,
          borderColor: colors.StayAliveRed,
          paddingHorizontal: 50,
          paddingVertical: 10,
          backgroundColor: 'white',
          maxWidth: 500, // Ajoutez cette ligne pour définir une largeur maximale
          alignSelf: 'center', // Ajoutez cette ligne pour centrer le bouton horizontalement
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
          Refuser l'alerte
        </Text>
      </TouchableOpacity>
    </View>
  )
}

AlertStatusPage.propTypes = {
  navigation: PropTypes.object.isRequired,
}
