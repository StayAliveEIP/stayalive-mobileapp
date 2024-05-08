import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { urlApi } from '../Utils/Api';
import Icon from 'react-native-vector-icons/Ionicons';
import Snackbar from 'react-native-snackbar';
import MapViewDirections from 'react-native-maps-directions';
import { colors } from '../Style/StayAliveStyle'
import PropTypes from 'prop-types'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function Maps({ navigation, route }) {
  const dataAlert = route.params;
  const [region, setRegion] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [walkingDuration, setWalkingDuration] = useState(null);
  dataAlert.data.emergency.position = { latitude: 48.812130, longitude: 2.356810 };

  Maps.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
  };

  useEffect(() => {
    const calculateRegion = async () => {
      const watchId = Geolocation.watchPosition(
        position => {
          setCurrentPosition(position);
          const { latitude, longitude } = position.coords;
          const userRegion = {
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
          setOrigin(userRegion);

          const minLat = Math.min(userRegion.latitude, dataAlert?.data?.emergency?.position?.latitude);
          const maxLat = Math.max(userRegion.latitude, dataAlert?.data?.emergency?.position?.latitude);
          const minLng = Math.min(userRegion.longitude, dataAlert?.data?.emergency?.position?.longitude);
          const maxLng = Math.max(userRegion.longitude, dataAlert?.data?.emergency?.position?.longitude);

          const deltaLat = maxLat - minLat;
          const deltaLng = maxLng - minLng;

          const region = {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: deltaLat * 1.7,
            longitudeDelta: deltaLng * 1.7,
          };

          setRegion(region);
        },
        error => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 10,
        }
      );

      return () => Geolocation.clearWatch(watchId);
    };

    calculateRegion();
  }, []);

  useEffect(() => {
    const fetchWalkingDuration = async () => {
      try {
        console.log(currentPosition);
        const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${currentPosition.coords.latitude},${currentPosition.coords.longitude}&destination=${dataAlert?.data?.emergency?.position?.latitude},${dataAlert?.data?.emergency?.position?.longitude}&mode=walking&key=AIzaSyDZzzsyTDbIIkYjUII8pAQbbkpBA3Amwj0`);
        const data = await response.json();
        console.log(data)
        const duration = data.routes[0].legs[0].duration.text;
        setWalkingDuration(duration);
        console.log('Walking duration:', duration);

        const remainingSeconds = data.routes[0].legs[0].duration.value;
        const remainingTime = new Date(remainingSeconds * 1000).toISOString().substr(11, 8);

      } catch (error) {
        console.error('Erreur lors de la récupération du temps d\'itinéraire à pied :', error);
      }
    };
    if (origin && currentPosition) {
      fetchWalkingDuration();
    }
  }, [origin, currentPosition]);

  const showMapOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Apple Maps', 'Google Maps'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            openAppleMaps();
          } else if (buttonIndex === 2) {
            openGoogleMaps();
          }
        }
      );
    } else {
      Alert.alert('Open in Maps', 'Choose a map application', [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Apple Maps', onPress: () => openAppleMaps() },
        { text: 'Google Maps', onPress: () => openGoogleMaps() },
      ]);
    }
  };

  const openAppleMaps = () => {
    const url = `http://maps.apple.com/?daddr=${dataAlert?.data?.emergency?.position?.latitude},${dataAlert?.data?.emergency?.position?.longitude}&saddr=${currentPosition.coords.latitude},${currentPosition.coords.longitude}`;
    Linking.openURL(url);
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${dataAlert?.data?.emergency?.position?.latitude},${dataAlert?.data?.emergency?.position?.longitude}&origin=${currentPosition.coords.latitude},${currentPosition.coords.longitude}`;
    Linking.openURL(url);
  };

  const onClickEnd = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const emergencyId = dataAlert?.data?.emergency?.id;

      if (emergencyId && token) {
        const terminateUrl = `${urlApi}/rescuer/emergency/terminate?id=${emergencyId}`;

        const response = await fetch(terminateUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        if (response.ok) {
          console.log('Emergency terminated successfully');
          await AsyncStorage.setItem('chatHistory', 'Empty');
          await AsyncStorage.removeItem('chatHistory');
          console.log('Chat history removed');

          navigation.navigate('AvailablePage');
        } else {
          console.error('Failed to terminate emergency');
          navigation.navigate('AvailablePage');
        }
      } else {
        console.error('Emergency ID not found');
        navigation.navigate('AvailablePage');
      }
    } catch (error) {
      console.error('Error terminating emergency:', error);
      navigation.navigate('AvailablePage');
    }
  };

  const toggleClickInfos = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation={true}
        >
          <Marker coordinate={dataAlert?.data?.emergency?.position} />
          <MapViewDirections
            origin={origin}
            destination={dataAlert?.data?.emergency?.position}
            strokeWidth={11}
            strokeColor={colors.StayAliveRed}
            apikey={"AIzaSyDZzzsyTDbIIkYjUII8pAQbbkpBA3Amwj0"}
            mode={"WALKING"}
          />
        </MapView>
      ) : null}

      <TouchableOpacity
        style={styles.chatButton}
        onPress={async () => {
          console.log('data');
          console.log(dataAlert?.data);
          const emergencyID = dataAlert?.data?.emergency?.id;
          const rescuerID = await AsyncStorage.getItem('userId');
          if (!emergencyID)
            Snackbar.show({
              text: "Impossible de trouver l'ID de l'urgence émetteur",
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'white',
              textColor: colors.StayAliveRed,
            });
          navigation.navigate('ChatEmergency', {
            rescuerId: rescuerID,
            emergencyId: emergencyID,
          });
        }}
      >
        <Icon
          name="chatbox-ellipses-outline"
          size={30}
          style={styles.iconChatEmergency}
          color={colors.StayAliveRed}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleClickInfos} style={expanded ? styles.floatingWindowExpanded : styles.floatingWindowNotExpanded}>
        <View style={styles.header}>
          {expanded ? (
            <Icon name="chevron-down" size={30} color={colors.StayAliveRed} />
          ) : (
            <Icon name="chevron-up" size={30} color={colors.StayAliveRed} />
          )}
          <Text style={styles.title}>Sauvetage en cours</Text>
        </View>
        {expanded && (
          <>
            <View style={styles.infoSection}>
              <InfoItem
                icon="📍"
                name="Destination"
                detail={dataAlert?.data?.emergency?.address}
              />
              <InfoItem
                icon="👤"
                name="Personne à secourir"
                detail={dataAlert?.data?.emergency?.info}
              />
            </View>

            <View style={styles.buttonSection}>
              <TouchableOpacity style={styles.redButton} onPress={showMapOptions}>
                <Text style={styles.buttonText}>Ouvrir dans maps</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.whiteButton} onPress={onClickEnd}>
                <Text style={styles.redText}>Fin de l'intervention</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </TouchableOpacity>
      <View style={styles.timeContainer}>
        <View style={styles.timeBox}>
          <Text style={styles.timeText}>{walkingDuration}</Text>
        </View>
        <Text style={styles.addressText}>{dataAlert?.data?.emergency?.address}</Text>
      </View>
    </View>
  );
}

function InfoItem({ icon, name, detail }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.icon}>{icon}</Text>
      <View>
        <Text style={styles.infoName}>{name}</Text>
        <Text style={styles.infoDetail}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  timeContainer: {
    borderColor: colors.StayAliveRed,
    borderWidth: 2,
    bottom: '185%',
    maxWidth: '90%',
    alignSelf: 'center',
    flexDirection: "row",
    backgroundColor: 'white',
  },
  timeBox: {
    backgroundColor: colors.StayAliveRed,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  timeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addressText: {
    textAlign: 'center',
    fontSize: 15,
    maxWidth: '50%',
    fontWeight: 'bold',
    color: colors.StayAliveRed,
  },
  floatingWindowExpanded: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    width: '80%',
    maxHeight: height / 2,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  floatingWindowNotExpanded: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    width: '80%',
    maxHeight: height / 2,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    color: colors.StayAliveRed,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSection: {
    marginVertical: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    maxWidth: 250,
  },
  icon: {
    marginRight: 10,
    fontSize: 24,
    color: 'white',
  },
  iconChatEmergency: {
    fontSize: 30,
    color: 'white',
  },
  infoName: {
    fontSize: 18,
  },
  infoDetail: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonSection: {
    alignItems: 'center',
  },
  redButton: {
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 3,
    borderRadius: 50,
    borderColor: colors.StayAliveRed,
    paddingHorizontal: 50,
    paddingVertical: 10,
    backgroundColor: colors.StayAliveRed,
  },
  whiteButton: {
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 3,
    borderRadius: 50,
    borderColor: colors.StayAliveRed,
    paddingHorizontal: 50,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  redText: {
    textAlign: 'center',
    fontSize: 18,
    color: colors.StayAliveRed,
    fontWeight: 'bold',
  },
  chatButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    borderRadius: 50,
    backgroundColor: colors.StayAliveRed,
    padding: 12,
  },
});
