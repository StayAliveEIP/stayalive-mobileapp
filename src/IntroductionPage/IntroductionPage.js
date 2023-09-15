import React from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import Swiper from 'react-native-swiper';
import { colors } from '../Style/StayAliveStyle';


function IntroductionPage1({ navigation }) {
    return (
        <View style={styles.slide}>
            <View style={styles.slideContent}>
                <Image
                    style={styles.image}
                    source={require('../../assets/Introduction1.png')}
                />
                <Image
                    style={styles.logo}
                    source={require('../../assets/StayAlive-logo.png')}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Bienvenue sur StayAlive !</Text>
                    <Text style={styles.description}>
                        Chaque <Text style={styles.redText}>seconde</Text> compte pour sauver une vie
                    </Text>
                    <Text style={styles.description}>
                        C'est la  <Text style={styles.redText}>mission</Text> de StayAlive
                    </Text>
                    <Text style={styles.description}>
                        StayAlive <Text style={styles.redText}>révolutionne</Text> l'intervention d'urgence.
                    </Text>
                </View>
            </View>
        </View>
    );
}
function IntroductionPage2({ navigation }) {
    return (
        <View style={styles.slide}>
            <View style={styles.slideContent}>
                <Image
                    style={styles.image}
                    source={require('../../assets/Introduction2.png')}
                />
                <Image
                    style={styles.logo}
                    source={require('../../assets/StayAlive-logo.png')}
                />
                <View style={styles.textContainer}>
                    <View style={styles.textWithLogo}>
                        <Text style={styles.title}>Le but de StayAlive</Text>
                    </View>
                    <View style={styles.textWithLogo}>
                        <Image
                            style={styles.logoIcon}
                            source={require('../../assets/Introduction-logo1.png')}
                        />
                        <Text style={styles.description2}>
                            Accélération du{' '}
                            <Text style={styles.redText}>temps</Text> de prise en charge
                        </Text>
                    </View>
                    <View style={styles.textWithLogo}>
                        <Image
                            style={styles.logoIcon}
                            source={require('../../assets/Introduction-logo2.png')}
                        />
                        <Text style={styles.description2}>
                            Accroissement des{' '}
                            <Text style={styles.redText}>chances</Text> de survie
                        </Text>
                    </View>
                    <View style={styles.textWithLogo}>
                        <Image
                            style={styles.logoIcon}
                            source={require('../../assets/Introduction-logo3.png')}
                        />
                        <Text style={styles.description2}>
                            <Text style={styles.redText}>d'experts</Text> dédiés et prêts à agir
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

function IntroductionPage3({ navigation }) {
    const onClickUnderstand = () => {
        navigation.navigate("LoginPage");
    }
    return (
        <View style={styles.slide}>
            <View style={styles.slideContent}>
                <Image
                    style={styles.image}
                    source={require('../../assets/Introduction3.png')}
                />
                <Image
                    style={styles.logo}
                    source={require('../../assets/StayAlive-logo.png')}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Le fonctionnement de StayAlive !</Text>

                    <Text style={styles.description3}>
                        Dès qu'un centre d'appel d'urgence transfère l'alerte, notre système <Text style={styles.redText}>notifie les soignants qualifiés a proximité.
                    </Text>
                        {'\n\n'}Cela garantit une réponse rapide et augmente les chances de survie
                    </Text>
                    <Text style={styles.description3}>

                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={onClickUnderstand}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>J'ai compris</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default function IntroductionPage({ navigation }) {
    const renderPagination = (index, total) => {
        if (index === total - 1) {
            return;
        }

        return (
            <View style={styles.paginationContainer}>
                {Array.from({ length: total }).map((_, i) => (
                    <Text
                        key={i}
                        style={{
                            fontSize: 40,
                            color: i === index ? colors.StayAliveRed : 'lightgray',
                            marginHorizontal: 5, // Espace horizontal entre les points
                        }}
                    >
                        ●
                    </Text>
                ))}
            </View>
        );
    };

    return (
        <Swiper style={styles.wrapper} showsButtons={false} loop={false} renderPagination={renderPagination}
                dotStyle={{  marginBottom: 40, width: 15, height: 15, borderRadius: 10000 }}>
            <IntroductionPage1 />
            <IntroductionPage2 />
            <IntroductionPage3 navigation={navigation}/>
        </Swiper>
    );
}

const styles = StyleSheet.create({
    wrapper: {},
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slideContent: {
        flex: 1,
        alignItems: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 80,
        zIndex: 0,
    },
    button: {
        borderWidth: 3,
        borderRadius: 50,
        borderColor: colors.StayAliveRed,
        paddingHorizontal: 50,
        paddingVertical: 10,
        backgroundColor: colors.StayAliveRed,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 18,
        color: colors.white,
        fontWeight: 'bold',
    },
    image: {
        width: 400,
        height: 400,
        resizeMode: 'contain',
        marginTop: -20,
    },
    logo: {
        width: 160,
        height: 160,
        borderRadius: 40,
        marginTop: -150,
        resizeMode: 'contain',
    },
    textContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 20,
    },
    description: {
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.black,
        flexWrap: 'wrap',
    },
    description2: {
        flex: 1,
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.black,
        flexWrap: 'wrap',
    },
    description3: {
        alignItems: 'center',
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.black,
        marginLeft: 20,
    },
    textWithLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    redText: {
        color: colors.StayAliveRed,
    },
    logoIcon: {
        width: 40,
        height: 40,
        marginRight: 10,
        marginLeft: 15,
    },
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
    },
});