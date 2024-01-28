import React, { useEffect, useState } from 'react'
import {
  Image,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform,
  ActionSheetIOS,
  Alert,
} from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'
import { colors } from '../Style/StayAliveStyle'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.02
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

const address = '24 Rue Pasteur, 94270, France'

export default function Maps({ navigation, route }) {
  const data = route.params
  const [region, setRegion] = useState(null)

  Maps.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
  }
  console.log(data)

  const pinLocation = {
    latitude: 48.815788,
    longitude: 2.36328,
  }

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setRegion({
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        })
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      }
    )

    return () => Geolocation.clearWatch(watchId)
  }, [])

  const showMapOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Apple Maps', 'Google Maps'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            openAppleMaps()
          } else if (buttonIndex === 2) {
            openGoogleMaps()
          }
        }
      )
    } else {
      Alert.alert('Open in Maps', 'Choose a map application', [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Apple Maps', onPress: () => openAppleMaps() },
        { text: 'Google Maps', onPress: () => openGoogleMaps() },
      ])
    }
  }

  const openAppleMaps = () => {
    const url = `http://maps.apple.com/?address=${encodeURIComponent(address)}`
    Linking.openURL(url)
  }

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`
    Linking.openURL(url)
  }

  const onClickEnd = () => {
    navigation.navigate('ProfilePage')
    console.log('End !')
  }

  const goBack = () => {
    console.log('arrow left clicked !')
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation
        >
          <Marker coordinate={pinLocation} />
        </MapView>
      ) : null}

      <TouchableOpacity
        testID="button-left-arrow"
        style={{
          position: 'absolute',
          top: 30,
          left: 30,
          zIndex: 1,
        }}
        onPress={goBack}
      >
        <Icon name="arrow-left" size={30} onPress={goBack} />
      </TouchableOpacity>
      <View style={styles.floatingWindow}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/SaveLogo.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Sauvetage en cours</Text>
        </View>

        <View style={styles.infoSection}>
          <InfoItem icon="📍" name="Destination" detail={address} />
          <InfoItem icon="👤" name="Personne à secourir" detail="John Doe" />
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.redButton} onPress={showMapOptions}>
            <Text style={styles.buttonText}>Ouvrir dans maps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whiteButton} onPress={onClickEnd}>
            <Text style={styles.redText}>Fin de l'intervention</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  floatingWindow: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    width: '80%',
    maxHeight: height / 2,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
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
  },
  icon: {
    marginRight: 10,
    fontSize: 24,
    color: 'grey',
  },
  infoName: {
    fontSize: 16,
  },
  infoDetail: {
    fontSize: 18,
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
})
