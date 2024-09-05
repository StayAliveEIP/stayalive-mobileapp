import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActionSheetIOS,
  Linking,
  TouchableWithoutFeedback, // Ajoutez cet import
} from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import { StayAliveColors } from '../Style/StayAliveStyle'

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.02
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

const defibrillatorIcon = require('../../assets/DefibrilatorPage.png') // Remplacez par le chemin de votre image

export default function DefibrilatorMapPage({ navigation, route }) {
  const { defibrillators } = route.params
  const [region, setRegion] = useState(null)
  const [selectedDefibrillator, setSelectedDefibrillator] = useState(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (defibrillators.length > 0) {
      const initialRegion = {
        latitude: parseFloat(defibrillators[0].location.lat),
        longitude: parseFloat(defibrillators[0].location.lng),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
      setRegion(initialRegion)
    }
  }, [defibrillators])

  const handleMarkerPress = (defibrillator) => {
    if (
      selectedDefibrillator &&
      selectedDefibrillator._id === defibrillator._id
    ) {
      // Si le marqueur sélectionné est déjà celui qui est pressé, désélectionner
      closeDetails()
    } else {
      // Sélectionner le nouveau marqueur
      setSelectedDefibrillator(defibrillator)
      setExpanded(true)
    }
  }

  const closeDetails = () => {
    setExpanded(false)
    setSelectedDefibrillator(null)
  }

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
      Alert.alert('Ouvrir dans maps', 'Choisissez une application', [
        { text: 'Retour', onPress: () => {}, style: 'cancel' },
        { text: 'Apple Maps', onPress: () => openAppleMaps() },
        { text: 'Google Maps', onPress: () => openGoogleMaps() },
      ])
    }
  }

  const openAppleMaps = () => {
    const url = `http://maps.apple.com/?daddr=${selectedDefibrillator.location.lat},${selectedDefibrillator.location.lng}`
    Linking.openURL(url)
  }

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedDefibrillator.location.lat},${selectedDefibrillator.location.lng}`
    Linking.openURL(url)
  }

  const toggleClickInfos = () => {
    setExpanded(!expanded)
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

  const onProfileBadgeClick = () => {
    console.log('Profile badge clicked')
    navigation.navigate('ProfilePage')
  }

  return (
    <View style={styles.container}>
      {region && (
        <TouchableWithoutFeedback onPress={closeDetails}>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={region}
              showsUserLocation={true}
            >
              {defibrillators.map((defibrillator) => (
                <Marker
                  key={defibrillator._id}
                  coordinate={{
                    latitude: parseFloat(defibrillator.location.lat),
                    longitude: parseFloat(defibrillator.location.lng),
                  }}
                  title={defibrillator.name}
                  description={defibrillator.address}
                  onPress={() => handleMarkerPress(defibrillator)}
                >
                  <Image
                    source={defibrillatorIcon}
                    style={styles.markerImage}
                  />
                </Marker>
              ))}
            </MapView>
          </View>
        </TouchableWithoutFeedback>
      )}

      {selectedDefibrillator ? (
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
                size={30}
                color={StayAliveColors.StayAliveRed}
              />
            ) : (
              <Icon
                name="chevron-up"
                size={30}
                color={StayAliveColors.StayAliveRed}
              />
            )}
            <Text style={styles.title}>Détails du défibrilateur</Text>
          </View>
          {expanded && (
            <>
              <View style={styles.infoSection}>
                <InfoItem
                  icon="❤️‍🩹"
                  name="Nom"
                  detail={selectedDefibrillator.name}
                />
                <InfoItem
                  icon="📍"
                  name="Adresse"
                  detail={selectedDefibrillator.address}
                />
              </View>

              <View style={styles.buttonSection}>
                <TouchableOpacity
                  style={styles.redButton}
                  onPress={showMapOptions}
                >
                  <Text style={styles.buttonText}>Ouvrir dans maps</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity
        testID="button-left-arrow"
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon
          testID="document-logo"
          name="arrow-left"
          size={30}
          color={StayAliveColors.black}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onProfileBadgeClick}
        testID="profile-badge"
        style={{
          position: 'absolute',
          top: 50,
          right: 35,
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
          style={{ width: 60, height: 60 }}
          source={require('../../assets/ProfileBadge.png')}
          testID="profile-badge-image"
        />
      </TouchableOpacity>
    </View>
  )
}

DefibrilatorMapPage.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerImage: {
    width: 34,
    height: 34,
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
    color: StayAliveColors.StayAliveRed,
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
    borderColor: StayAliveColors.StayAliveRed,
    paddingHorizontal: 50,
    paddingVertical: 10,
    backgroundColor: StayAliveColors.StayAliveRed,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    borderRadius: 50,
    padding: 10,
  },
})
