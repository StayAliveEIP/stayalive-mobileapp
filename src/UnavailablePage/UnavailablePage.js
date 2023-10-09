import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { colors } from '../Style/StayAliveStyle';

export default function UnavailablePage() {

    const onClickButton = () => {
        console.log('Je me rends Disponible');
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
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.StayAliveRed, marginTop: 5 }}>Indisponible</Text>

            <Image
                style={{ width: 150, height: 150, marginTop: 30 }}
                source={require('../../assets/UnavailableLogo.png')}
            />

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
                marginTop: 50,
            }}>
                <Image source={require('../../assets/WarningLogo.png')} style={{ width: 80, height: 80, marginBottom: 15 }} />
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.StayAliveRed, marginBottom: 10 }}>Avant de se rendre disponible:</Text>
                <Text style={{ fontSize: 16, textAlign: 'center', maxWidth: '80%' }}>Lorem ipsum dolor sit amet consectetur molestiae quas vel sint commodi repudiandae consequuntur voluptatum  fugiat iusto fuga praesentiumoptio, eaque rerum!</Text>
            </View>

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
                    Se rendre Disponible
                </Text>
            </TouchableOpacity>
        </View>
    );
}
