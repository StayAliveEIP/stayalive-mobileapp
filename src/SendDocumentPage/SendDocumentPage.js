import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { colors } from '../Style/StayAliveStyle';
import Icon from "react-native-vector-icons/FontAwesome";
import * as PropTypes from "prop-types";
import DocumentPicker from 'react-native-document-picker';

const imagePaths = {
    documentID: require('../../assets/DocumentID.png'),
    documentSauveteur: require('../../assets/DocumentSauveteur.png'),
};

function BoxDocument(props) {
    const { id, onFileSelect } = props;
    const [filename, setFilename] = useState(null);

    const handleDocumentPick = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            const selectedFilename = result[0].name;
            setFilename(selectedFilename);

            // Appel de la fonction de rappel pour transmettre le nom du fichier au parent
            onFileSelect(id, result[0]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
    };

    return (
        <View style={{
            alignSelf: "center",
            alignItems: "center",
            backgroundColor: "lightgray",
            width: 350,
            height: 200,
            borderRadius: 20,
            marginBottom: 30}}>
            <Image
                style={{ marginTop: 10, width: 50, height: 50 }}
                source={imagePaths[id]}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: "black", marginBottom: 3 }}>{props.title}</Text>
            <Text style={{ fontSize: 16, color: "black", textAlign: "center" }}>{props.description}</Text>
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
                    testID={'login-button'}
                >
                    {filename ? (filename.length > 20 ? filename.slice(0, 20) + '...' : filename) : "Télécharger mon document"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

BoxDocument.propTypes = {
    id: PropTypes.oneOf(Object.keys(imagePaths)),
    description: PropTypes.string,
    title: PropTypes.string,
    onFileSelect: PropTypes.func, // Ajoutez une prop pour la fonction de rappel
};

export default function SendDocumentPage({ navigation }) {
    const [selectedFiles, setSelectedFiles] = useState({
        documentID: null,
        documentSauveteur: null,
    });

    const onFileSelect = (id, filename) => {
        setSelectedFiles(prevSelectedFiles => ({
            ...prevSelectedFiles,
            [id]: filename,
        }));
    };

    const onPressSendDocuments = () => {
        console.log("Noms des fichiers sélectionnés :", selectedFiles);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
                style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}
                onPress={() => navigation.goBack()}
            >
                <Icon
                    name="arrow-left"
                    size={30}
                />
            </TouchableOpacity>

            <View style={{ alignItems: "center" }}>
                <View style={{ alignItems: "center" }}>
                    <Image
                        style={{ alignSelf: "center", width: 120, height: 120 }}
                        source={require('../../assets/DocumentLogo.png')}
                    />
                    <Text style={{ marginBottom: 40, marginTop: 20, fontSize: 30, fontWeight: 'bold', color: 'black' }}>Envoyer mes documents</Text>
                </View>

                <BoxDocument onFileSelect={onFileSelect} id="documentID" title={"Pièce d'identité"} description={"Nous avons besoin de ce document afin de vous identifier auprès des services de secours et en cas de besoin, pour vous contacter."}></BoxDocument>
                <BoxDocument onFileSelect={onFileSelect} id="documentSauveteur" title={"Certificat de secourisme"} description={"Nous avons besoin de ce document afin de vous identifier auprès des services de secours et en cas de besoin, pour vous contacter."}></BoxDocument>
                <TouchableOpacity
                    onPress={onPressSendDocuments}
                    style={{
                        marginTop: 20,
                        borderWidth: 3,
                        borderRadius: 50,
                        borderColor: colors.StayAliveRed,
                        paddingHorizontal: 50,
                        paddingVertical: 10,
                        backgroundColor: 'white',
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 18,
                            color: colors.StayAliveRed,
                            fontWeight: 'bold',
                        }}
                        testID={'joinUs-button'}
                    >
                        Envoyer vos documents
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
