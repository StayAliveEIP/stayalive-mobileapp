import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { StayAliveColors } from '../../../Style/StayAliveStyle'
import { TextInputStayAlive } from '../../../Utils/textInputStayAlive'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'
import Snackbar from 'react-native-snackbar'
import { launchImageLibrary } from 'react-native-image-picker'
import { tokenReportBug, urlApi } from '../../../Utils/Api'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width, height } = Dimensions.get('window')

export default function ReportBugPage({ navigation }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [importance, setImportance] = useState(1)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)

  const goBack = () => {
    console.log('arrow left clicked !')
    navigation.goBack()
  }

  ReportBugPage.propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
  }

  const handleImagePick = () => {
    if (photos.length >= 5) {
      Snackbar.show({
        text: 'Vous ne pouvez ajouter que 5 photos',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'white',
        textColor: 'red',
      })
      return
    }

    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('Image picker cancelled')
      } else if (response.error) {
        console.error('Image picker error', response.error)
      } else {
        setPhotos([...photos, response.assets[0]])
      }
    })
  }

  const removePhoto = (index) => {
    const newPhotos = [...photos]
    newPhotos.splice(index, 1)
    setPhotos(newPhotos)
  }

  const sendToBackend = async () => {
    setLoading(true)

    try {
      const token = await AsyncStorage.getItem('userToken')

      const formData = new FormData()

      formData.append('message', `${title}\n${description}`)

      photos.forEach((photo) => {
        formData.append('file', {
          uri: photo.uri,
          type: photo.type || 'image/jpeg',
          name: photo.fileName || 'photo.jpg',
        })
      })

      formData.append('level', importance)

      const response = await fetch(`${urlApi}/rescuer/report/bug`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData,
      })

      console.log(response)

      if (response.ok) {
        Snackbar.show({
          text: 'Le bug a été signalé avec succès à nos serveurs!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'white',
          textColor: 'green',
        })
        setTitle('')
        setDescription('')
        setPhotos([])
      } else {
        Snackbar.show({
          text: "Erreur: Une erreur est survenue dans l'envoie du bug à nos serveurs",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'white',
          textColor: 'red',
        })
      }
    } catch (error) {
      console.log(error)
      Snackbar.show({
        text: "Erreur: Une erreur est survenue dans l'envoie du bug à nos serveurs",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'white',
        textColor: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const sendToGithub = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        'https://api.github.com/repos/StayAliveEIP/stayalive-mobileapp/issues',
        {
          method: 'POST',
          headers: {
            Authorization: `token ${tokenReportBug}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            body: `Importance : ${importance}\n\n${description}`,
          }),
        }
      )
      console.log(response)
      if (response.status === 201) {
        Snackbar.show({
          text: 'Le bug a été signalé avec succès à notre Github !',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'white',
          textColor: 'green',
        })
        setTitle('')
        setDescription('')
      } else {
        Snackbar.show({
          text: "Erreur: Une erreur est survenue dans l'envoie du bug à notre Github",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'white',
          textColor: 'red',
        })
      }
    } catch (error) {
      console.log(error)
      Snackbar.show({
        text: "Erreur: Une erreur est survenue dans l'envoie du bug à notre Github",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'white',
        textColor: 'red',
      })
    } finally {
      setLoading(false)
    }
  }
  const handleSubmit = async () => {
    if (
      title.trim() === '' ||
      description.trim() === '' ||
      photos.length === 0
    ) {
      Snackbar.show({
        text: 'Erreur: Veuillez remplir tous les champs et ajouter au moins une photo.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'white',
        textColor: 'red',
      })
      return
    }
    await sendToGithub()
    await sendToBackend()
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[StayAliveColors.StayAliveRed, StayAliveColors.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient1}
      />
      <LinearGradient
        colors={[StayAliveColors.StayAliveRed, StayAliveColors.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient2}
      />

      <TouchableOpacity
        testID="button-left-arrow"
        style={styles.backButton}
        onPress={() => goBack()}
      >
        <Icon testID="document-logo" name="arrow-left" size={width * 0.08} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.mainContainer}>
          <View style={styles.content}>
            <Image
              style={styles.logo}
              source={require('../../../../assets/BugLogo.png')}
            />
            <Text style={styles.title}>Signaler un Bug</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Niveau d'importance</Text>
              <View style={styles.importanceSelector}>
                <TouchableOpacity
                  style={[
                    styles.importanceButton,
                    importance === 1 && styles.selectedButton,
                  ]}
                  onPress={() => setImportance(1)}
                >
                  <Text style={styles.importanceText}>1 - Faible</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.importanceButton,
                    importance === 2 && styles.selectedButton,
                  ]}
                  onPress={() => setImportance(2)}
                >
                  <Text style={styles.importanceText}>2 - Moyenne</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.importanceButton,
                    importance === 3 && styles.selectedButton,
                  ]}
                  onPress={() => setImportance(3)}
                >
                  <Text style={styles.importanceText}>3 - Élevée</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TextInputStayAlive
              valueTestID="bug-title-input"
              text="Titre du Bug"
              field={title}
              onChangeField={setTitle}
              label="Donnez un titre à ce bug"
              numberOfLines={1}
            />
            <TextInputStayAlive
              valueTestID="bug-description-input"
              text="Description du Bug"
              field={description}
              onChangeField={setDescription}
              label="Veuillez décrire en détail le problème rencontré"
              multiline
              numberOfLines={6}
              maxLength={510}
            />

            <TouchableOpacity
              onPress={handleImagePick}
              style={styles.imageButton}
            >
              <Text style={styles.imageButtonText}>Ajouter des Photos</Text>
            </TouchableOpacity>
            <View style={styles.photosContainer}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image source={{ uri: photo.uri }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Text style={styles.removePhotoButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Signaler ce Bug</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 50,
  },
  backButton: {
    marginLeft: height * 0.04,
    marginTop: width * 0.09,
  },
  gradient1: {
    position: 'absolute',
    bottom: 0,
    left: -width * 0.95,
    height: height * 0.6,
    width: width * 1.2,
    borderRadius: 10000,
  },
  gradient2: {
    position: 'absolute',
    bottom: -height * 0.2,
    left: -width * 0.3,
    width: width * 0.8,
    height: height * 0.4,
    borderRadius: 10000,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: height * 0.02,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: width * 0.36,
    height: height * 0.17,
    resizeMode: 'contain',
  },
  title: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  importanceSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: -10,
  },
  importanceButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: StayAliveColors.StayAliveRed,
  },
  importanceText: {
    color: 'white',
    fontSize: width * 0.028,
  },
  imageButton: {
    alignSelf: 'center',
    borderWidth: 3,
    borderRadius: 50,
    marginTop: height * 0.01,
    borderColor: StayAliveColors.StayAliveRed,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.008,
    backgroundColor: 'white',
  },
  imageButtonText: {
    textAlign: 'center',
    fontSize: width * 0.035,
    color: StayAliveColors.StayAliveRed,
    fontWeight: 'bold',
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginVertical: height * 0.02,
  },
  photoWrapper: {
    position: 'relative',
    marginRight: 5,
  },
  photo: {
    width: width * 0.14,
    height: height * 0.065,
    borderRadius: 5,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -height * 0.01,
    right: -width * 0.01,
    backgroundColor: 'red',
    borderRadius: 100000,
    padding: width * 0.01,
  },
  removePhotoButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    borderWidth: 3,
    borderRadius: 50,
    borderColor: StayAliveColors.StayAliveRed,
    paddingVertical: height * 0.013,
    backgroundColor: StayAliveColors.StayAliveRed,
    width: width * 0.5,
  },
  submitButtonText: {
    textAlign: 'center',
    fontSize: width * 0.04,
    color: 'white',
    fontWeight: 'bold',
  },
})
