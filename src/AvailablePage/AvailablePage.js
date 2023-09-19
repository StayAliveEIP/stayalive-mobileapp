import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { colors } from '../Style/StayAliveStyle';

function TextSlider() {
    const [currentPage, setCurrentPage] = useState(0);

    const pages = [
        { text: 'Text for Page 1', image: require('../../assets/SaveLogo.png') },
        { text: 'Text for Page 2', image: require('../../assets/SaveLogo.png') },
        { text: 'Text for Page 3', image: require('../../assets/SaveLogo.png') },
        { text: 'Text for Page 4', image: require('../../assets/SaveLogo.png') },
        { text: 'Text for Page 5', image: require('../../assets/SaveLogo.png') },
    ];

    const handleBubblePress = (index) => {
        setCurrentPage(index);
    };

    return (
        <View style={{ alignItems: 'center', marginTop: 60 }}>
            <View style={{
                backgroundColor: 'white',
                paddingVertical: 15,
                paddingHorizontal: 10,
                borderRadius: 15,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                alignItems: 'center',
                maxWidth: '90%',
                width: 400,
            }}>
                <Image source={pages[currentPage].image} style={{ width: 50, height: 50, marginBottom: 10 }} />
                <Text style={{ fontSize: 16, textAlign: 'center', maxWidth: '80%' }}>{pages[currentPage].text}</Text>

                <View style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    justifyContent: 'center',
                }}>
                    {pages.map((_, index) => (
                        <TouchableOpacity key={index} onPress={() => handleBubblePress(index)} style={{ marginHorizontal: 5 }}>
                            <View style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: index === currentPage ? colors.StayAliveRed : 'lightgrey',
                            }} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

export default function AvailablePage() {

    const onClickButton = () => {
        console.log('Je me rends indisponible');
    };

    const onProfileBadgeClick = () => {
        console.log('Profile badge clicked');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
                onPress={onProfileBadgeClick}
                style={{
                    position: 'absolute',
                    top: 50,
                    right: 20,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            >
                <Image
                    style={{ width: 60, height: 60 }}
                    source={require('../../assets/ProfileBadge.png')}
                />
            </TouchableOpacity>

            <Text style={{ fontSize: 24, color: 'black' }}>Votre statut:</Text>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.StayAliveRed, marginTop: 5 }}>Disponible</Text>

            <Image
                style={{ width: 150, height: 150, marginTop: 30 }}
                source={require('../../assets/AvailableLogo.png')}
            />

            <TextSlider />

            <TouchableOpacity
                onPress={onClickButton}
                style={{
                    position: 'absolute',
                    bottom: 30,
                    borderWidth: 4,
                    borderRadius: 50,
                    borderColor: colors.StayAliveRed,
                    paddingHorizontal: 50,
                    paddingVertical: 15,
                    backgroundColor: 'transparent',
                }}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 18,
                        color: colors.StayAliveRed,
                        fontWeight: 'bold',
                    }}
                >
                    Se rendre indisponible
                </Text>
            </TouchableOpacity>
        </View>
    );
}
