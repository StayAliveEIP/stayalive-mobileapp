import React, { useState } from 'react'
import * as PropTypes from 'prop-types'
import DocumentPicker from 'react-native-document-picker'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { colors } from '../Style/StayAliveStyle'
import SendDocumentPage from './SendDocumentPage'

const imagePaths = {
  ID_CARD: require('../../assets/DocumentID.png'),
  RESCUER_CERTIFICATE: require('../../assets/DocumentSauveteur.png'),
}

export function BoxUploadDocument(props) {
  const { id, onFileSelect } = props
  const [filename, setFilename] = useState(null)

  SendDocumentPage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }
  const handleDocumentPick = async () => {
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    })

    const selectedFilename = result[0].name
    setFilename(selectedFilename)
    onFileSelect(id, result[0])
  }

  return (
    <View
      style={{
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#ededed',
        width: 350,
        height: 220,
        borderRadius: 20,
        marginBottom: 30,
        elevation: 7,
      }}
    >
      <Image
        style={{ marginTop: 10, width: 50, height: 50 }}
        source={imagePaths[id]}
      />
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
      <Text style={{ fontSize: 16, maxWidth: 320, color: 'black', textAlign: 'center' }}>
        {props.description}
      </Text>
      <TouchableOpacity
        onPress={handleDocumentPick}
        style={{
          marginTop: 14,
          marginBottom: 10,
          borderWidth: 3,
          borderRadius: 50,
          borderColor: colors.StayAliveRed,
          paddingHorizontal: 50,
          paddingVertical: 1,
          backgroundColor: colors.StayAliveRed,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            color: 'white',
            fontWeight: 'bold',
          }}
          testID={`selectDocument-button-${id}`}
        >
          {filename
            ? filename.length > 20
              ? `${filename.slice(0, 20)}...`
              : filename
            : 'Charger mon document'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

BoxUploadDocument.propTypes = {
  id: PropTypes.oneOf(Object.keys(imagePaths)),
  description: PropTypes.string,
  title: PropTypes.string,
  onFileSelect: PropTypes.func,
}
