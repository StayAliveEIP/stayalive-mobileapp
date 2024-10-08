import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { StayAliveColors } from '../Style/StayAliveStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from '@react-native-community/geolocation';

import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { urlApi } from '../Utils/Api';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function AlertStatusPage({ navigation, route }) {
  const { dataAlert } = route.params;
  const [region, setRegion] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  console.log(dataAlert?.emergency?.position);

  useEffect(() => {
    const calculateRegion = async () => {
      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userRegion = {
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
          setCurrentPosition(position);
          setOrigin(userRegion);

          setRegion({
            latitude:
              (userRegion.latitude +
                dataAlert?.emergency?.position?.latitude) /
              2,
            longitude:
              (userRegion.longitude +
                dataAlert?.emergency?.position?.longitude) /
              2,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
        },
        (error) => console.log(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
      return () => Geolocation.clearWatch(watchId);
    };

    calculateRegion();
  }, [dataAlert]);

  const RefuseAlert = async () => {
    console.log('You refuse the alert!');
    try {
      const token = await AsyncStorage.getItem('userToken');
      const emergencyId = dataAlert?.emergency?.id;

      if (emergencyId && token) {
        const acceptUrl = `${urlApi}/rescuer/emergency/refuse?id=${emergencyId}`;
        const response = await fetch(acceptUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log('Emergency refused successfully');
          navigation.navigate('UnavailableAvailablePage');
        } else {
          console.error('Failed to refuse emergency');
        }
      } else {
        console.error('Emergency ID not found');
      }
    } catch (error) {
      console.error('Error refusing emergency:', error);
    }
  };

  const AcceptAlert = async () => {
    console.log('You accept the alert!');
    try {
      const token = await AsyncStorage.getItem('userToken');
      const emergencyId = dataAlert?.emergency?.id;

      if (emergencyId && token) {
        const acceptUrl = `${urlApi}/rescuer/emergency/accept?id=${emergencyId}`;
        const response = await fetch(acceptUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log('Emergency accepted successfully');

          navigation.navigate('Maps', { data: dataAlert });
        } else {
          console.error('Failed to accept emergency');
        }
      } else {
        console.error('Emergency ID not found');
      }
    } catch (error) {
      console.error('Error accepting emergency:', error);
    }
  };

  const goProfilePage = () => {
    navigation.push('ProfilePage');
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={goProfilePage}
        style={{
          alignSelf: 'flex-end',
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
        }}
      >
        <Text style={{ fontSize: width * 0.05, color: 'black' }}>
          Votre statut:
        </Text>
        <Text
          testID="status-text"
          style={{
            fontSize: width * 0.055,
            fontWeight: 'bold',
            color: StayAliveColors.StayAliveRed,
          }}
        >
          En attente de réponse ...
        </Text>

        <Image
          testID="unavailable-logo"
          style={{
            width: width * 0.28,
            height: height * 0.15,
          }}
          source={require('../../assets/WarningLogo.png')}
        />
      </View>

      <View
        style={{
          flexDirection: 'column',
          maxWidth: width * 0.7,
          marginTop: height * 0.02,
          marginBottom: height * 0.05,
          marginLeft: height * 0.03,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: height * 0.02 }}>
          <View
            style={{
              marginRight: width * 0.03,
              backgroundColor: 'lightcoral',
              borderRadius: 100,
              padding: 10,
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

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              marginRight: width * 0.02,
              backgroundColor: 'lightcoral',
              borderRadius: 100,
              padding: 10,
              aspectRatio: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon name="user-o" size={width * 0.07} color="red" />
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
      </View>

      {region && (
        <View
          style={{
            width: '80%',
            height: '20%',
            borderRadius: 30,
            overflow: 'hidden',
            alignSelf: 'center', // Assure que la carte est centrée
          }}
        >
          <MapView
            style={{ flex: 1 }} // Utilise flex: 1 pour remplir le conteneur
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            showsUserLocation={true}
          >
            <Marker coordinate={dataAlert?.emergency?.position} />
            {origin && (
              <MapViewDirections
                origin={origin}
                destination={dataAlert?.emergency?.position}
                strokeWidth={11}
                strokeColor={StayAliveColors.StayAliveRed}
                apikey={'AIzaSyDZzzsyTDbIIkYjUII8pAQbbkpBA3Amwj0'}
                mode={'WALKING'}
              />
            )}
          </MapView>
        </View>
      )}

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
            fontSize: width * 0.05,
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          Accepter
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={RefuseAlert}
        style={{
          marginBottom: height * 0.01,
          borderWidth: 3,
          borderRadius: 50,
          borderColor: StayAliveColors.StayAliveRed,
          paddingHorizontal: width * 0.09,
          paddingVertical: height * 0.013,
          backgroundColor: StayAliveColors.white,
          maxWidth: width * 0.7,
          alignSelf: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: width * 0.05,
            fontWeight: 'bold',
            color: StayAliveColors.StayAliveRed,
          }}
        >
          Refuser
        </Text>
      </TouchableOpacity>
    </View>
  );

}

AlertStatusPage.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};
