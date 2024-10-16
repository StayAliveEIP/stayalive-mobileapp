import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import MapView, { Marker } from 'react-native-maps'
import { TextInputStayAlive } from '../Utils/textInputStayAlive'
import { StayAliveColors } from '../Style/StayAliveStyle'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'
import { launchImageLibrary } from 'react-native-image-picker'
import { urlApi } from '../Utils/Api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Snackbar from 'react-native-snackbar'

const { width, height } = Dimensions.get('window')

export default function DefibrillatorPage({ navigation }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [photo, setPhoto] = useState(null)
  const [region, setRegion] = useState({
    latitude: 48.866667,
    longitude: 2.333333,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  })
  const [predictions, setPredictions] = useState([])

  DefibrillatorPage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: false },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setPhoto(response.assets[0].uri)
        }
      }
    )
  }

  const fetchPredictions = async (input) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyDZzzsyTDbIIkYjUII8pAQbbkpBA3Amwj0&input=${input}&location=${region.latitude},${region.longitude}&radius=2000`
    try {
      const response = await fetch(apiUrl)
      const json = await response.json()
      if (json.status === 'OK') {
        const filteredPredictions = json.predictions.filter((prediction) =>
          prediction.types.includes('street_address')
        )
        setPredictions(filteredPredictions)
      } else {
        console.error('Error fetching predictions', json)
      }
    } catch (error) {
      console.error('Error fetching predictions', error)
    }
  }

  const onAddressChange = (text) => {
    setAddress(text)

    if (text.trim() === '') {
      setPredictions([])
      return
    }

    fetchPredictions(text)
  }

  const selectPrediction = async (description) => {
    setAddress(description)
    setPredictions([])

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDZzzsyTDbIIkYjUII8pAQbbkpBA3Amwj0&address=${encodeURIComponent(
      description
    )}`
    try {
      const response = await fetch(geocodeUrl)
      const json = await response.json()
      if (json.status === 'OK') {
        const { lat, lng } = json.results[0].geometry.location
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        })
      } else {
        console.error('Error fetching coordinates', json)
      }
    } catch (error) {
      console.error('Error fetching coordinates', error)
    }
  }

  const goBack = () => {
    navigation.goBack()
  }

  const truncate = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  const onSubmitProposeDefibrillator = async () => {
    const placeId = await fetchPlaceId(address)
    if (!placeId) {
      Alert.alert('Erreur', 'Échec de la récupération du place ID')
      return
    }

    const url = `${urlApi}/rescuer/defibrillator/propose`

    const body = JSON.stringify({
      name,
      placeId,
      imageSrc: photo,
    })

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
        body,
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        console.log('Défibrillateur proposé avec succès:', data)
        Snackbar.show({
          text: data.message,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'white',
          textColor: 'green',
        })
      } else {
        console.log("Echec de la proposition d'un nouveau Défibrillateur")
        Snackbar.show({
          text: "Echec de la proposition d'un nouveau Défibrillateur",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'white',
          textColor: 'red',
        })
        throw new Error('Failed to propose defibrillator')
      }
    } catch (error) {
      console.error('Erreur lors de la proposition du défibrillateur:', error)
      Alert.alert('Erreur', 'Nous ne parvenons pas à contacter nos serveurs')
    }
  }

  const fetchPlaceId = async (address) => {
    const apiKey = 'AIzaSyDZzzsyTDbIIkYjUII8pAQbbkpBA3Amwj0'
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`

    try {
      const response = await fetch(geocodeUrl)
      const json = await response.json()
      if (json.status === 'OK') {
        return json.results[0].place_id
      } else {
        console.error('Erreur lors de la récupération du place ID:', json)
        return null
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du place ID:', error)
      return null
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          alignSelf: 'center',
          top: -height * 0.3,
          width: width * 1.2,
          height: height * 0.52,
          borderRadius: 1000,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[StayAliveColors.StayAliveRed, StayAliveColors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>
      <TouchableOpacity
        testID="button-left-arrow"
        style={styles.backButton}
        onPress={goBack}
      >
        <Icon testID="document-logo" name="arrow-left" size={30} />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Image
          style={styles.image}
          source={require('../../assets/DefibrilatorPage.png')}
        />
        <Text style={styles.header}>Proposer un défibrilateur</Text>
      </View>
      <View style={styles.innerContainer}>
        <TextInputStayAlive
          valueTestID="defib-name-input"
          text="Nom du défibrillateur"
          field={name}
          onChangeField={setName}
          label="Vestiaire Gymnase"
          numberOfLines={1}
        />

        <TextInputStayAlive
          valueTestID="defib-address-input"
          text="Adresse du défibrillateur"
          field={address}
          onChangeField={onAddressChange}
          label="12 rue de la rue, 75000 Paris"
          numberOfLines={1}
        />

        {predictions.length > 0 && (
          <View style={styles.predictionsList}>
            {predictions.map((item) => (
              <TouchableOpacity
                key={item.place_id}
                onPress={() => selectPrediction(item.description)}
              >
                <Text style={styles.predictionItem}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={region}>
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
            />
          </MapView>
        </View>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>
            {photo ? truncate(photo.split('/').pop(), 19) : 'Charger une Photo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={onSubmitProposeDefibrillator}
        >
          <Text style={styles.submitButtonText}>
            Proposer ce nouveau défibrillateur
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: height * 0.07,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.06,
    left: height * 0.05,
    zIndex: 1,
  },
  image: {
    alignSelf: 'center',
    width: width * 0.36,
    height: height * 0.17,
    resizeMode: 'contain',
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: height * 0.02,
    marginTop: height * 0.01,
  },
  innerContainer: {
    alignItems: 'center',
  },
  mapContainer: {
    width: width * 0.8,
    height: height * 0.2,
    marginTop: height * 0.02,
    borderRadius: 30,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  photoName: {
    fontSize: 16,
    marginBottom: 20,
    color: StayAliveColors.StayAliveRed,
  },
  button: {
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
    borderWidth: 3,
    borderRadius: 50,
    borderColor: StayAliveColors.StayAliveRed,
    paddingHorizontal: width * 0.1,
    paddingVertical: height * 0.01,
    maxWidth: 290,
    backgroundColor: StayAliveColors.StayAliveRed,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: width * 0.04,
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
    borderWidth: 3,
    borderRadius: 50,
    borderColor: StayAliveColors.StayAliveRed,
    paddingHorizontal: width * 0.08,
    maxWidth: '75%',
    backgroundColor: 'white',
  },
  submitButtonText: {
    textAlign: 'center',
    fontSize: width * 0.04,
    color: StayAliveColors.StayAliveRed,
    fontWeight: 'bold',
  },
  predictionsList: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 150,
    marginBottom: 20,
  },
  predictionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
})
