import React, { useState } from 'react'
import * as PropTypes from 'prop-types'
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native'
import { StayAliveColors } from '../../Style/StayAliveStyle'
import { urlApi } from '../../Utils/Api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Snackbar from 'react-native-snackbar'
import RNFetchBlob from 'rn-fetch-blob'

const { width, height } = Dimensions.get('window')

const imagePaths = {
  documentID: require('../../../assets/DocumentID.png'),
  documentSauveteur: require('../../../assets/DocumentSauveteur.png'),
}

export function BoxDocument(props) {
  const { id, setData, type } = props
  const [loadingDownload, setLoadingDownload] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const handleDeleteDocument = async () => {
    setLoadingDelete(true)
    try {
      const apiUrl = `${urlApi}/rescuer/document?type=${type}`
      const token = await AsyncStorage.getItem('userToken')
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 200) {
        Snackbar.show({
          text: 'Les documents ont été supprimés avec succès',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'white',
          textColor: 'green',
        })
        setData(null)
      }
    } catch (error) {
      Snackbar.show({
        text: 'Une erreur est survenue lors de la suppression des documents',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'white',
        textColor: 'red',
      })
      setData(null)
      console.error(
        "Erreur lors de la tentative de suppression d'un document : ",
        error
      )
    } finally {
      setLoadingDelete(false)
    }
  }

  const handleDownloadDocument = async () => {
    setLoadingDownload(true)

    try {
      const apiUrl = `${urlApi}/rescuer/document/download?type=${type}`
      const token = await AsyncStorage.getItem('userToken')

      RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: type,
          path: `${RNFetchBlob.fs.dirs.DownloadDir}/${type}`,
        },
      })
        .fetch('GET', apiUrl, {
          Authorization: `Bearer ${token}`,
        })
        .then(() => {
          setLoadingDownload(false)
        })
        .catch((error) => {
          setLoadingDownload(false)
          console.error('Erreur lors du téléchargement du document : ', error)
          Snackbar.show({
            text: 'Une erreur est survenue lors du téléchargement du document',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'white',
            textColor: 'red',
          })
        })
    } catch (error) {
      setLoadingDownload(false)
      console.error('Erreur lors du téléchargement du document : ', error)
      Snackbar.show({
        text: 'Une erreur est survenue lors du téléchargement du document',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'white',
        textColor: 'red',
      })
    }
  }

  return (
    <View
      style={{
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#ededed',
        width: width * 0.8,
        borderRadius: 20,
        marginBottom: height * 0.03,
        paddingBottom: height * 0.02,
        elevation: 7,
      }}
    >
      <Image
        style={{
          marginTop: height * 0.01,
          width: width * 0.12,
          height: height * 0.056,
          resizeMode: 'contain',
        }}
        source={imagePaths[id]}
      />
      <Text
        style={{
          fontSize: width * 0.035,
          fontWeight: 'bold',
          color: 'black',
          marginBottom: height * 0.005,
        }}
      >
        {props.title}
      </Text>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {Object.entries(props.data).map(
          ([key, value]) =>
            key !== 'uri' && (
              <View key={key} style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text
                  style={{
                    fontSize: width * 0.033,
                    color: StayAliveColors.StayAliveRed,
                    fontWeight: 'bold',
                    marginRight: 5,
                  }}
                >
                  {key}:
                </Text>
                <Text
                  style={{
                    fontSize: width * 0.032,
                    color: 'black',
                  }}
                >
                  {value === null
                    ? 'Aucune information'
                    : key === 'size'
                    ? `${(value / 1024).toFixed(2)} Ko`
                    : value}
                </Text>
              </View>
            )
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: height * 0.02,
        }}
      >
        <TouchableOpacity
          onPress={handleDeleteDocument}
          testID={'delete-document-button'}
          style={{
            borderWidth: 3,
            borderRadius: 50,
            borderColor: StayAliveColors.StayAliveRed,
            paddingHorizontal: width * 0.06,
            paddingVertical: height * 0.002,

            backgroundColor: StayAliveColors.StayAliveRed,
            marginRight: 5,
            maxWidth: '45%',
          }}
        >
          {loadingDelete ? (
            <ActivityIndicator
              testID={'delete-document-loading-indicator'}
              size="small"
              color="white"
            />
          ) : (
            <Text
              style={{
                textAlign: 'center',
                fontSize: width * 0.025,
                color: 'white',
                fontWeight: 'bold',
                flexWrap: 'wrap',
              }}
              testID={`selectDocument-button-${id}`}
            >
              {'Supprimer ce document'}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          testID={'download-document-button'}
          onPress={handleDownloadDocument}
          style={{
            borderWidth: 3,
            borderRadius: 50,
            borderColor: StayAliveColors.StayAliveRed,
            paddingVertical: height * 0.002,
            backgroundColor: StayAliveColors.StayAliveRed,
            marginLeft: 5,
            paddingHorizontal: width * 0.06,
            maxWidth: '45%',
          }}
        >
          {loadingDownload ? (
            <ActivityIndicator
              testID={'download-document-loading-indicator'}
              size="small"
              color="white"
            />
          ) : (
            <Text
              style={{
                textAlign: 'center',
                fontSize: width * 0.025,
                color: 'white',
                fontWeight: 'bold',
                flexWrap: 'wrap',
              }}
              testID={`selectDocument-button-${id}`}
            >
              {'Télécharger ce document'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

BoxDocument.propTypes = {
  id: PropTypes.oneOf(Object.keys(imagePaths)),
  description: PropTypes.string,
  title: PropTypes.string,
  onFileSelect: PropTypes.func,
  setData: PropTypes.func,
  type: PropTypes.string,
  data: PropTypes.object,
}

export default BoxDocument
