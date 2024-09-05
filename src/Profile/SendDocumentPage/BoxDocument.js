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
        height: height * 0.26,
        borderRadius: 20,
        marginBottom: height * 0.03,
        elevation: 7,
      }}
    >
      <Image
        style={{
          marginTop: height * 0.01,
          width: width * 0.12,
          height: height * 0.056,
        }}
        source={imagePaths[id]}
      />
      <Text
        style={{
          fontSize: width * 0.04,
          fontWeight: 'bold',
          color: 'black',
          marginBottom: height * 0.005,
        }}
      >
        {props.title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {Object.entries(props.data).map(
          ([key, value]) =>
            key !== 'uri' && (
              <View key={key} style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: StayAliveColors.StayAliveRed,
                      fontWeight: 'bold',
                      marginRight: 5,
                    }}
                  >
                    {key}:
                  </Text>
                  {key === 'size' ? (
                    <Text
                      style={{
                        fontSize: width * 0.036,
                        color: 'black',
                        marginRight: 5,
                      }}
                    >
                      {value === null
                        ? 'Aucune information'
                        : `${(value / 1024).toFixed(2)} Ko`}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: width * 0.036,
                        color: 'black',
                        marginRight: 5,
                      }}
                    >
                      {value === null ? 'Aucune information' : value}
                    </Text>
                  )}
                </View>
              </View>
            )
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-end',
          maxWidth: width * 0.44,
        }}
      >
        <TouchableOpacity
          onPress={handleDeleteDocument}
          testID={'delete-document-button'}
          style={{
            borderWidth: 3,
            borderRadius: 50,
            marginRight: 10,
            borderColor: StayAliveColors.StayAliveRed,
            paddingHorizontal: width * 0.06,
            backgroundColor: StayAliveColors.StayAliveRed,
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
                fontSize: width * 0.03,
                color: 'white',
                fontWeight: 'bold',
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
            marginTop: 14,
            borderWidth: 3,
            borderRadius: 50,
            borderColor: StayAliveColors.StayAliveRed,
            paddingHorizontal: width * 0.06,
            backgroundColor: StayAliveColors.StayAliveRed,
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
                fontSize: width * 0.03,
                color: 'white',
                fontWeight: 'bold',
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
