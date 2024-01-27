import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { colors } from '../Style/StayAliveStyle'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { urlApi } from '../Utils/Api'

export default function AlertStatusPage({ navigation, route }) {
  const { dataAlert } = route.params;

  console.log(dataAlert.emergency);
  const RefuseAlert = () => {
    console.log('You refuse the alert !')
  }

  const AcceptAlert = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const emergencyId = dataAlert?.emergency?.id;

      console.log(emergencyId);
      console.log(token);
      if (emergencyId && token) {
        const acceptUrl = `${urlApi}/rescuer/emergency/accept?id=${emergencyId}`;
        console.log(acceptUrl);
        const response = await fetch(acceptUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        if (response.ok) {
          console.log('Emergency accepted successfully');
          navigation.navigate("Maps", {data : dataAlert})
        } else {
          console.error('Failed to accept emergency');
        }
      } else {
        console.error('Emergency ID not found');
      }
    } catch (error) {
      console.error('Error accepting emergency:', error);
    }  }

  const goProfilePage = () => {
    console.log('Go Profile Page !')
    navigation.push('ProfilePage')
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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

      <Text style={{ marginTop: 100, fontSize: 24, color: 'black' }}>
        Votre statut:
      </Text>
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

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 50,
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
            }}
          >
            <Icon name="flag-o" size={30} color="red" />
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
            150 Rue de Saint-Martin, 75003, Paris, France
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 70,
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
            Personne a secourir
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
          Refuser l'alerte
        </Text>
      </TouchableOpacity>
    </View>
  )
}

AlertStatusPage.propTypes = {
  navigation: PropTypes.object.isRequired,
}
