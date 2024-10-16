import React, { useState } from 'react'
import * as PropTypes from 'prop-types'
import DocumentPicker from 'react-native-document-picker'
import { Image, Text, TouchableOpacity, View, Dimensions } from 'react-native'
import { StayAliveColors } from '../../Style/StayAliveStyle'
import SendDocumentPage from './SendDocumentPage'

const { width, height } = Dimensions.get('window')

const imagePaths = {
  ID_CARD: require('../../../assets/DocumentID.png'),
  RESCUER_CERTIFICATE: require('../../../assets/DocumentSauveteur.png'),
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
          resizeMode: 'contain',
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
      <Text
        style={{
          fontSize: width * 0.035,
          maxWidth: width * 0.76,
          color: 'black',
          textAlign: 'center',
        }}
      >
        {props.description}
      </Text>
      <TouchableOpacity
        onPress={handleDocumentPick}
        style={{
          marginTop: height * 0.03,
          borderWidth: 3,
          borderRadius: 50,
          borderColor: StayAliveColors.StayAliveRed,
          paddingHorizontal: width * 0.1,
          paddingVertical: height * 0.002,
          backgroundColor: StayAliveColors.StayAliveRed,
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
