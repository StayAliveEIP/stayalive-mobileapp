import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'
import { launchImageLibrary } from 'react-native-image-picker'
import { EditInfosMenu } from './EditInfos'
import { colors } from '../../Style/StayAliveStyle'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Snackbar from 'react-native-snackbar'
import { urlApi } from '../../Utils/Api'
import { CardRescue } from './CardRescue'

export default function RescueHistoryPage({ navigation }) {
    const [avatarSource, setAvatarSource] = useState(null)
    const [loading, setLoading] = useState(true)
    const [profileData, setProfileData] = useState(null)

    RescueHistoryPage.propTypes = {
        navigation: PropTypes.object.isRequired,
    }

    const goBack = () => {
        console.log('arrow left clicked !')
        navigation.goBack()
    }

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true)

                const token = await AsyncStorage.getItem('userToken')

                const response = await fetch(`${urlApi}/rescuer/account`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }

                const data = await response.json()
                setProfileData(data)
                console.log(data.firstname + ' ' + data.lastname)
            } catch (error) {
                console.error(
                    'Erreur lors de la récupération des données du profil',
                    error
                )
            } finally {
                setLoading(false)
            }
        }

        fetchProfileData()
    }, [])
    // Fonction pour rendre une carte de sauvetage
    const renderRescueCard = (item) => (
        <View style={{alignItems: 'center' }}>
        <CardRescue
            number={item.number}
            id={item.id}
            info={item.info}
            address={item.address}
            status={item.status}
        />
        </View>
    );

    // Données de test pour la liste de cartes de sauvetage
    const rescueData = [
        { number: '1', id: '5f7a6d3e6f6d7a6d3e6f7a6d', info: 'Une mamie est dans le coma', address: '17 rue des Lilas, Paris', status: 'ASSIGNED' },
        { number: '2', id: '5f7a6d3e6f6d7a6d3e6f7a6d', info: 'Une mamie est dans le coma', address: '17 rue des Lilas, Paris', status: 'ASSIGNED' },
        { number: '3', id: '5f7a6d3e6f6d7a6d3e6f7a6d', info: 'Une mamie est dans le coma', address: '17 rue des Lilas, Paris', status: 'ASSIGNED' },
        { number: '4', id: '5f7a6d3e6f6d7a6d3e6f7a6d', info: 'Une mamie est dans le coma', address: '17 rue des Lilas, Paris', status: 'ASSIGNED' },
    ];

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    alignSelf: 'center',
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

            {loading && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ActivityIndicator size="large" color={colors.StayAliveRed} />
                </View>
            )}

            <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ position: 'absolute', alignItems: 'center' }}>
                    <View
                        style={{
                            position: 'absolute',
                            justifyContent: 'center',
                            top: -360,
                        }}
                    >
                        <Image
                            testID="user-avatar"
                            style={{
                                alignSelf: 'center',
                                width: 160,
                                height: 160,
                                borderRadius: 100,
                                resizeMode: 'contain',
                            }}
                            source={
                                avatarSource
                                    ? { uri: avatarSource }
                                    : require('../../../assets/StayAlive-logo.png')
                            }

                        />

                    </View>
                </View>

                <Text
                    testID="user-name"
                    style={{
                        alignSelf: 'center',
                        top: -210,
                        marginTop: 14,
                        marginBottom: -150,
                        fontSize: 22,
                        color: 'black',
                        fontWeight: 'bold',
                    }}
                >
                    {profileData
                        ? `${profileData.firstname} ${profileData.lastname}`
                        : 'Chargement...'}
                </Text>

                <TouchableOpacity
                    testID="button-left-arrow"
                    style={{
                        position: 'absolute',
                        top: -440,
                        left: 30,
                        zIndex: 1,
                    }}
                    onPress={goBack}
                >
                    <Icon name="arrow-left" size={30} onPress={goBack} />
                </TouchableOpacity>

                <FlatList
                    style={{width: "100%",}}
                    data={rescueData}
                    renderItem={({ item }) => renderRescueCard(item)}
                    keyExtractor={item => item.number}
                />

            </View>
        </View>
    )
}
