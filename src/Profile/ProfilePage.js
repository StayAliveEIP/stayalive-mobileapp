import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../Style/StayAliveStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu } from './Menu';
import {launchImageLibrary} from 'react-native-image-picker';
import {launchCamera} from 'react-native-image-picker';
export default function ProfilePage({ navigation }) {
    const [avatarSource, setAvatarSource] = useState(null);

    const selectImage = async () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setAvatarSource(imageUri);
            }
        });
    };



    return (
        <ScrollView style={{ flex: 1, position: "absolute" }}>
            <View
                style={{
                    alignSelf: "center",
                    top: -260,
                    width: 550,
                    height: 500,
                    borderRadius: 1000,
                    overflow: 'hidden',
                }}
            >
                <LinearGradient
                    colors={[colors.StayAliveRed, colors.white]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1 }}
                />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ position: 'absolute', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center',
                            marginTop: '-230%', // Ajuster la marge supérieure pour le centrage vertical
                        }}
                        onPress={selectImage}
                    >
                        <Image
                            style={{
                                alignSelf: "center",
                                width: 160,
                                height: 160,
                                borderRadius: 100,
                                resizeMode: 'contain',
                            }}
                            source={avatarSource ? { uri: avatarSource } : require('../../assets/StayAlive-logo.png')}
                        />
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                padding: 8,
                                borderRadius: 20,
                            }}
                            onPress={selectImage}
                        >
                            <Icon name="camera" size={20} color="white" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>

                <Text
                    style={{
                        alignSelf: "center",
                        top: -210,
                        marginTop: 14,
                        fontSize: 22,
                        color: 'black',
                        fontWeight: 'bold',
                    }}
                >
                    Louis AUTEF
                </Text>

                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: -440,
                        left: 30,
                        zIndex: 1,
                    }}
                    onPress={() => console.log("arrow left clicked ! ")}
                >
                    <Icon
                        name="arrow-left"
                        size={30}
                        onPress={() => console.log("arrow left clicked !")}
                    />
                </TouchableOpacity>
                <Menu name={"Mes Sauvetages"} icon={"help-buoy-outline"} />
                <Menu name={"Mon Compte"} icon={"person-outline"} />
                <Menu name={"Mes Documents"} icon={"document-text-outline"} />
                <Menu name={"Préférences"} icon={"settings-outline"} />
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        alignSelf: "center",
                        marginTop: 200,
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
                        Se déconnecter
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
