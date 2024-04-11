import React, { useState } from 'react'
import * as PropTypes from 'prop-types'
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { colors } from '../Style/StayAliveStyle'
import { urlApi } from '../Utils/Api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Snackbar from 'react-native-snackbar'
import RNFetchBlob from 'rn-fetch-blob'

const imagePaths = {
  documentID: require('../../assets/DocumentID.png'),
  documentSauveteur: require('../../assets/DocumentSauveteur.png'),
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
        backgroundColor: 'lightgray',
        width: 350,
        borderRadius: 20,
        marginBottom: 30,
        padding: 10,
      }}
    >
      <Image style={{ width: 50, height: 50 }} source={imagePaths[id]} />
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: 'black',
          marginBottom: 3,
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
                      color: colors.StayAliveRed,
                      fontWeight: 'bold',
                      marginRight: 5,
                    }}
                  >
                    {key}:
                  </Text>
                  {key === 'size' ? (
                    <Text
                      style={{ fontSize: 16, color: 'black', marginRight: 5 }}
                    >
                      {value === null
                        ? 'Aucune information'
                        : `${(value / 1024).toFixed(2)} Ko`}
                    </Text>
                  ) : (
                    <Text
                      style={{ fontSize: 16, color: 'black', marginRight: 5 }}
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
          maxWidth: '40%',
        }}
      >
        <TouchableOpacity
          onPress={handleDeleteDocument}
          style={{
            borderWidth: 3,
            borderRadius: 50,
            marginRight: 10,
            borderColor: colors.StayAliveRed,
            paddingHorizontal: 20,
            backgroundColor: colors.StayAliveRed,
          }}
        >
          {loadingDelete ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 12,
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
          onPress={handleDownloadDocument}
          style={{
            marginTop: 14,
            borderWidth: 3,
            borderRadius: 50,
            borderColor: colors.StayAliveRed,
            paddingHorizontal: 20,
            backgroundColor: colors.StayAliveRed,
          }}
        >
          {loadingDownload ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 12,
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
