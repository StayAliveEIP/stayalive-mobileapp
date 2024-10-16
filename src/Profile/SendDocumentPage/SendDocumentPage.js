import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { StayAliveColors } from '../../Style/StayAliveStyle'
import { BoxUploadDocument } from './BoxUploadDocument'
import { BoxDocument } from './BoxDocument'
import { urlApi } from '../../Utils/Api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Snackbar from 'react-native-snackbar'
import PropTypes from 'prop-types'

const { width, height } = Dimensions.get('window')

export default function SendDocumentPage({ navigation }) {
  const [selectedFiles, setSelectedFiles] = useState({
    ID_CARD: null,
    RESCUER_CERTIFICATE: null,
  })
  const [documentID, setDocumentID] = useState(null)
  const [documentRescuer, setDocumentRescuer] = useState(null)
  const [loadingDocuments, setLoadingDocuments] = useState(true)
  const [loadingSendDocuments, setLoadingSendDocuments] = useState(false)

  SendDocumentPage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  const onFileSelect = (id, file) => {
    setSelectedFiles((prevSelectedFiles) => ({
      ...prevSelectedFiles,
      [id]: file,
    }))
  }

  const onPressSendDocuments = async (type) => {
    setLoadingSendDocuments(true)

    try {
      const apiUrl = `${urlApi}/rescuer/document/upload?type=${type}`
      const token = await AsyncStorage.getItem('userToken')
      const formData = new FormData()
      formData.append('file', selectedFiles[type])

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.status === 201) {
        Snackbar.show({
          text: 'Les documents ont été envoyés avec succès',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'white',
          textColor: 'green',
        })
        if (type === 'ID_CARD') setDocumentID(selectedFiles.ID_CARD)
        if (type === 'RESCUER_CERTIFICATE')
          setDocumentRescuer(selectedFiles.RESCUER_CERTIFICATE)
      } else {
        throw new Error("Échec de l'envoi des documents")
      }
    } catch (error) {
      Snackbar.show({
        text: "Une erreur est apparue lors de l'envoi des documents",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'white',
        textColor: 'red',
      })
    } finally {
      setLoadingSendDocuments(false)
    }
  }

  const goBack = () => {
    console.log('arrow left clicked !')
    navigation.goBack()
  }

  const getDocuments = async () => {
    setLoadingDocuments(true)

    try {
      const apiUrl = `${urlApi}/rescuer/document/all`
      const token = await AsyncStorage.getItem('userToken')

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const responseData = await response.json()

      const dataOfIdCard = responseData.find((item) => item.type === 'ID_CARD')
      const dataOfRescuerCertificate = responseData.find(
        (item) => item.type === 'RESCUER_CERTIFICATE'
      )
      if (dataOfIdCard && dataOfIdCard.data) setDocumentID(dataOfIdCard.data)
      if (dataOfRescuerCertificate && dataOfRescuerCertificate.data)
        setDocumentRescuer(dataOfRescuerCertificate.data)
    } catch (error) {
      Snackbar.show({
        text: 'Une erreur est apparue lors de la récupération des documents',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'white',
        textColor: 'red',
      })
    } finally {
      setLoadingDocuments(false)
    }
  }

  useEffect(() => {
    getDocuments()
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        testID="button-left-arrow"
        style={{
          position: 'absolute',
          top: height * 0.05,
          left: width * 0.05,
          zIndex: 1,
        }}
        onPress={goBack}
      >
        <Icon testID="document-logo" name="arrow-left" size={30} />
      </TouchableOpacity>

      <View style={{ alignItems: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            style={{
              alignSelf: 'center',
              width: width * 0.32,
              height: height * 0.15,
              resizeMode: 'contain',
            }}
            source={require('../../../assets/DocumentLogo.png')}
          />
          <Text
            style={{
              marginBottom: height * 0.04,
              marginTop: height * 0.01,
              fontSize: width * 0.06,
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            Envoyer mes documents
          </Text>
        </View>
        {loadingDocuments ? (
          <ActivityIndicator
            size="large"
            color={StayAliveColors.StayAliveRed}
          />
        ) : (
          <>
            {documentID === null ? (
              <BoxUploadDocument
                testID="selectDocument-button-documentID"
                onFileSelect={onFileSelect}
                id="ID_CARD"
                title="Pièce d'identité"
                description="Nous avons besoin de ce document afin de vous identifier auprès des services de secours et en cas de besoin, pour vous contacter."
              />
            ) : (
              <BoxDocument
                id="documentID"
                type="ID_CARD"
                title="Pièce d'identité"
                data={documentID}
                setData={setDocumentID}
              />
            )}
            {documentRescuer === null ? (
              <BoxUploadDocument
                testID="selectDocument-button-documentRescuer"
                onFileSelect={onFileSelect}
                id="RESCUER_CERTIFICATE"
                title="Certificat de secourisme"
                description="Nous avons besoin de ce document afin de vous identifier auprès des services de secours et en cas de besoin, pour vous contacter."
              />
            ) : (
              <BoxDocument
                id="documentSauveteur"
                type="RESCUER_CERTIFICATE"
                title="Certificat de secourisme"
                data={documentRescuer}
                setData={setDocumentRescuer}
              />
            )}
            {(documentID === null || documentRescuer === null) && (
              <TouchableOpacity
                onPress={() => {
                  if (selectedFiles.ID_CARD !== null) {
                    onPressSendDocuments('ID_CARD')
                  }
                  if (selectedFiles.RESCUER_CERTIFICATE !== null) {
                    onPressSendDocuments('RESCUER_CERTIFICATE')
                  }
                }}
                style={{
                  marginTop: height * 0.005,
                  borderWidth: 3,
                  borderRadius: 50,
                  borderColor: StayAliveColors.StayAliveRed,
                  paddingHorizontal: width * 0.07,
                  paddingVertical: height * 0.01,
                  backgroundColor: 'white',
                }}
                testID="sendDocument-button"
              >
                {loadingSendDocuments ? (
                  <ActivityIndicator
                    size="small"
                    color={StayAliveColors.StayAliveRed}
                  />
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: width * 0.045,
                      color: StayAliveColors.StayAliveRed,
                      fontWeight: 'bold',
                    }}
                  >
                    Envoyer vos documents
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  )
}
