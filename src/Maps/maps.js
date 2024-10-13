import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from '../Utils/Api'
import Icon from 'react-native-vector-icons/Ionicons'
import Snackbar from 'react-native-snackbar'
import MapViewDirections from 'react-native-maps-directions'
import { StayAliveColors } from '../Style/StayAliveStyle'
import PropTypes from 'prop-types'

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.02
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default function Maps({ navigation, route }) {
  const dataAlert = route.params
  const [region, setRegion] = useState(null)
  const [origin, setOrigin] = useState(null)
  const [currentPosition, setCurrentPosition] = useState({
    coords: {
      latitude: null,
      longitude: null,
    },
  })
  const [expanded, setExpanded] = useState(true)

  Maps.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
  }

  const calculateRegion = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error),
          {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 1000,
          }
        )
      })

      if (!position || !position.coords) {
        console.error('Coordonnées non disponibles')
        return
      }

      const { latitude, longitude } = position.coords
      console.log('Position actuelle:', latitude, longitude)

      // Définir la région
      const userRegion = {
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }

      setCurrentPosition(position)
      setOrigin(userRegion)

      // Calcul de la région
      const minLat = Math.min(
        userRegion.latitude,
        dataAlert?.data?.emergency?.position?.latitude || userRegion.latitude
      )
      const maxLat = Math.max(
        userRegion.latitude,
        dataAlert?.data?.emergency?.position?.latitude || userRegion.latitude
      )
      const minLng = Math.min(
        userRegion.longitude,
        dataAlert?.data?.emergency?.position?.longitude || userRegion.longitude
      )
      const maxLng = Math.max(
        userRegion.longitude,
        dataAlert?.data?.emergency?.position?.longitude || userRegion.longitude
      )

      const deltaLat = maxLat - minLat
      const deltaLng = maxLng - minLng

      const region = {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: deltaLat * 1.7,
        longitudeDelta: deltaLng * 1.7,
      }

      setRegion(region)
    } catch (error) {
      console.error('Erreur lors de la récupération de la position:', error)
    }
  }

  useEffect(() => {
    if (dataAlert) {
      calculateRegion()
    }
  }, [dataAlert])

  const openMaps = () => {
    if (
      !currentPosition?.coords?.latitude ||
      !currentPosition?.coords?.longitude
    ) {
      console.error('Position actuelle non disponible')
      return
    }

    const destination = dataAlert?.data?.emergency?.position
    if (!destination) {
      console.error('Destination non disponible')
      return
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&origin=${currentPosition.coords.latitude},${currentPosition.coords.longitude}&travelmode=walking`
    Linking.openURL(url)
  }

  const onClickEnd = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const emergencyId = dataAlert?.data?.emergency?.id

      if (!emergencyId || !token) {
        console.error('Emergency ID or Token not found')
        return navigation.navigate('UnavailableAvailablePage')
      }

      const terminateUrl = `${urlApi}/rescuer/emergency/terminate?id=${emergencyId}`

      const response = await fetch(terminateUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.error('Failed to terminate emergency')
        return navigation.navigate('UnavailableAvailablePage')
      }

      console.log('Emergency terminated successfully')
      navigation.navigate('UnavailableAvailablePage')
    } catch (error) {
      console.error('Error terminating emergency:', error)
      navigation.navigate('UnavailableAvailablePage')
    }
  }

  const toggleClickInfos = () => {
    setExpanded(!expanded)
  }

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
            strokeColor={StayAliveColors.StayAliveRed}
            apikey={'AIzaSyDZzzsyTDbIIkYjUII8pAQbbkpBA3Amwj0'}
            mode={'WALKING'}
          />
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Chargement de la carte...</Text>
        </View>
      )}

      <TouchableOpacity
        testID="chatButton"
        style={styles.chatButton}
        onPress={async () => {
          console.log('data')
          console.log(dataAlert?.data)
          const emergencyID = dataAlert?.data?.emergency?.id
          const rescuerID = await AsyncStorage.getItem('userId')
          if (!emergencyID)
            Snackbar.show({
              text: "Impossible de trouver l'ID de l'urgence émetteur",
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'white',
              textColor: StayAliveColors.StayAliveRed,
            })
          navigation.navigate('ChatEmergency', {
            rescuerId: rescuerID,
            emergencyId: emergencyID,
          })
        }}
      >
        <Icon
          name="chatbox-ellipses-outline"
          size={30}
          style={styles.iconChatEmergency}
          color={StayAliveColors.StayAliveRed}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={toggleClickInfos}
        style={
          expanded
            ? styles.floatingWindowExpanded
            : styles.floatingWindowNotExpanded
        }
      >
        <View style={styles.header}>
          {expanded ? (
            <Icon
              name="chevron-down"
              size={width * 0.08}
              color={StayAliveColors.StayAliveRed}
            />
          ) : (
            <Icon
              name="chevron-up"
              size={width * 0.08}
              color={StayAliveColors.StayAliveRed}
            />
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
              <TouchableOpacity style={styles.redButton} onPress={openMaps}>
                <Text style={styles.buttonText}>Ouvrir dans maps</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.whiteButton} onPress={onClickEnd}>
                <Text style={styles.redText}>Fin de l'intervention</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  )
}

function InfoItem({ icon, name, detail }) {
  InfoItem.propTypes = {
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
  }
  return (
    <View style={styles.infoItem}>
      <Text style={styles.icon}>{icon}</Text>
      <View>
        <Text style={styles.infoName}>{name}</Text>
        <Text style={styles.infoDetail}>{detail}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  floatingWindowExpanded: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    width: width * 0.83,
    maxHeight: height * 0.5,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: width * 0.04,
  },
  floatingWindowNotExpanded: {
    position: 'absolute',
    bottom: height * 0.04,
    alignSelf: 'center',
    width: width * 0.8,
    maxHeight: height * 0.5,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: width * 0.04,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    color: StayAliveColors.StayAliveRed,
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  infoSection: {
    marginVertical: height * 0.01,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
    maxWidth: width * 0.6,
  },
  icon: {
    marginRight: height * 0.01,
    fontSize: width * 0.06,
    color: 'white',
  },
  iconChatEmergency: {
    fontSize: width * 0.08,
    color: 'white',
  },
  infoName: {
    fontSize: width * 0.05,
  },
  infoDetail: {
    fontSize: width * 0.037,
    fontWeight: 'bold',
  },
  buttonSection: {
    alignItems: 'center',
  },
  redButton: {
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
    borderWidth: 3,
    borderRadius: 50,
    borderColor: StayAliveColors.StayAliveRed,
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.01,
    backgroundColor: StayAliveColors.StayAliveRed,
  },
  whiteButton: {
    marginBottom: height * 0.01,
    borderWidth: 3,
    borderRadius: 50,
    borderColor: StayAliveColors.StayAliveRed,
    paddingHorizontal: width * 0.07,
    paddingVertical: width * 0.02,
    backgroundColor: 'white',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: width * 0.04,
    color: 'white',
    fontWeight: 'bold',
  },
  redText: {
    textAlign: 'center',
    fontSize: width * 0.04,
    color: StayAliveColors.StayAliveRed,
    fontWeight: 'bold',
  },
  chatButton: {
    position: 'absolute',
    top: height * 0.03,
    left: width * 0.08,
    borderRadius: 50,
    backgroundColor: StayAliveColors.StayAliveRed,
    padding: width * 0.03,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
