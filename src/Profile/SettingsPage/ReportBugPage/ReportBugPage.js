import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { StayAliveColors } from '../../../Style/StayAliveStyle'
import { TextInputStayAlive } from '../../../Utils/textInputStayAlive'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'
import Snackbar from 'react-native-snackbar'

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
        <Icon testID="document-logo" name="arrow-left" size={30} />
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
    left: -400,
    right: 0,
    height: 500,
    width: 500,
    borderRadius: 10000,
  },
  gradient2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 300,
    height: 300,
    borderRadius: 10000,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    zIndex: 1,
  },
  content: {
    marginTop: '20%',
    alignItems: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: 120,
    height: 120,
  },
  title: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    marginTop: '10%',
    width: '80%',
  },
  descriptionInput: {
    height: 100,
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
