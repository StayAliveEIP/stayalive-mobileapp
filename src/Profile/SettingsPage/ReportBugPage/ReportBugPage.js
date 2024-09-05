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

const { width, height } = Dimensions.get('window')

export default function ReportBugPage({ navigation }) {
  ReportBugPage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const goBack = () => {
    console.log('arrow left clicked !')
    navigation.goBack()
  }

  const handleSubmit = async () => {
    if (title.trim() === '' || description.trim() === '') {
      Snackbar.show({
        text: 'Erreur: Veuillez remplir tous les champs',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'white',
        textColor: 'red',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'https://api.github.com/repos/StayAliveEIP/stayalive-mobileapp/issues',
        {
          method: 'POST',
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            body: description,
          }),
        }
      )

      if (response.status === 201) {
        Snackbar.show({
          text: 'Le bug a été signalé avec succès !',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'white',
          textColor: 'green',
        })
        setTitle('')
        setDescription('')
      } else {
        Snackbar.show({
          text: 'Erreur: Une erreur est survenue',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'white',
          textColor: 'red',
        })
      }
    } catch (error) {
      console.error(error)
      Snackbar.show({
        text: 'Erreur: Une erreur est survenue',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'white',
        textColor: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <TouchableOpacity
        testID="button-left-arrow"
        style={styles.backButton}
        onPress={() => goBack()}
      >
        <Icon testID="document-logo" name="arrow-left" size={width * 0.08} />
      </TouchableOpacity>
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

      <View style={styles.mainContainer}>
        <View style={styles.content}>
          <Image
            style={styles.logo}
            source={require('../../../../assets/BugLogo.png')}
          />
          <Text style={styles.title}>Signaler un Bug</Text>
          <View style={styles.inputContainer}>
            <TextInputStayAlive
              valueTestID="bug-title-input"
              text="Titre du Bug"
              field={title}
              onChangeField={setTitle}
              label="Donnez un titre à ce bug"
            />
            <TextInputStayAlive
              style={styles.descriptionInput}
              valueTestID="bug-description-input"
              text="Description du Bug"
              field={description}
              onChangeField={setDescription}
              label="Veuillez décrire en détail le problème rencontré"
              multiline
              numberOfLines={15}
              maxLength={510}
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.submitButtonText} testID="submit-button">
                Signaler ce Bug
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
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
    width: width * 0.7,
    height: height * 0.4,
    borderRadius: 10000,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.08,
    left: width * 0.1,
    zIndex: 1,
  },
  content: {
    marginTop: height * 0.07,
    alignItems: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: width * 0.36,
    height: height * 0.17,
  },
  title: {
    marginTop: height * 0.02,
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    marginTop: height * 0.05,
    width: width * 0.7,
  },
  descriptionInput: {
    height: height * 1,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 3,
    borderRadius: 50,
    borderColor: StayAliveColors.StayAliveRed,
    paddingHorizontal: 50,
    paddingVertical: 10,
    backgroundColor: StayAliveColors.StayAliveRed,
  },
  submitButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
})
