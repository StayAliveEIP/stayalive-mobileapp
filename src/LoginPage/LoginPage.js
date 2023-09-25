import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView, Alert} from 'react-native';
import {TextInputStayAlive} from './textInputStayAlive';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../Style/StayAliveStyle'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {FadeInView} from '../Animations/Animations'

export default function LoginPage({ navigation }) {
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');

    const onClickLogin = () => {
        console.log(email.toLocaleLowerCase(), password);

        const url = 'http://api.stayalive.fr:3000/auth/login';
        const body = JSON.stringify({
            email: email.toLocaleLowerCase(),
            password: password,
        });

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        })
        .then((response) => {
            //! Check response
            if (response.ok) {
                return response.json();
            } else {
                Alert.alert('Error', 'Mauvais identifiants ou mot de passe');
                return Promise.reject('Invalid credentials');
            }
        })
        .then((data) => {
            console.log('Response was OK:', data);
            navigation.navigate('UnavailablePage');
        })
        .catch((error) => {
            if (error !== 'Invalid credentials') {
                console.error('There has been an issue with the fetch operation:', error);
                Alert.alert('Error', 'Nous ne parvenons pas a contacter nos serveurs');
            }
        });
    };

    const onClickJoin = () => {
        navigation.navigate('RegistrationPage');
        console.log('Join !');
    };

    const onClickLoginWithGoogle = () => {
        console.log('Google !');
    };

    return (
        <FadeInView duration={200}>
        <ScrollView >
            <View
                style={{
                    position: 'absolute',
                    bottom: -30,
                    left: -420,
                    width: 500,
                    height: 500,
                    borderRadius: 10000,
                    overflow: 'hidden',
                }}
            >
                <LinearGradient
                    colors={[colors.StayAliveRed, colors.white]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{flex: 1}}
                />
            </View>
            <View
                style={{
                    position: 'absolute',
                    bottom: -150,
                    left: -150,
                    width: 300,
                    height: 300,
                    borderRadius: 10000,
                    overflow: 'hidden',
                }}
            >
                <LinearGradient
                    colors={[colors.StayAliveRed, colors.white]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{flex: 1}}
                />
            </View>

            <View style={{flex: 1}}>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Image
                        style={{
                            width: 400,
                            height: 400,
                            marginTop: -50,
                            resizeMode: 'contain',
                        }}
                        source={require('../../assets/StayAlive2.png')}
                    />
                    <Image
                        style={{
                            width: 160,
                            height: 160,
                            borderRadius: 40,
                            marginTop: -180,
                            resizeMode: 'contain',
                        }}
                        source={require('../../assets/StayAlive-logo.png')}
                    />
                    <Text
                        style={{
                            marginTop: 14,
                            fontSize: 22,
                            color: 'black',
                            fontWeight: 'bold',
                        }}
                    >
                        Accéder à votre espace
                    </Text>

                    <View style={{marginTop: 15}}>
                        <TextInputStayAlive
                            valueTestID={"login-email-input"}
                            text={'Votre adresse E-mail'}
                            field={email}
                            onChangeField={onChangeEmail}
                            label={'E-mail'}
                        />
                        <TextInputStayAlive
                            valueTestID={"login-password-input"}
                            text={'Votre mot de passe'}
                            field={password}
                            onChangeField={onChangePassword}
                            label={'Mot de passe'}
                            secureTextEntry={true}
                        />
                        <TouchableOpacity onPress={() => console.log('Forgot Password?')}>
                            <Text style={{
                                fontWeight: 'bold',
                                marginTop: 5,
                                color: colors.StayAliveRed,
                                textDecorationLine: 'underline',
                            }}>
                                Vous avez oublié votre mot de passe ?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={onClickLogin}
                        style={{
                            marginTop: 20,
                            marginBottom: 10,
                            borderWidth: 3,
                            borderRadius: 50,
                            borderColor: colors.StayAliveRed,
                            paddingHorizontal: 50,
                            paddingVertical: 10,
                            backgroundColor: colors.StayAliveRed,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 18,
                                color: 'white',
                                fontWeight: 'bold',
                            }}
                            testID={'login-button'}
                        >
                            Se connecter
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClickJoin}
                        style={{
                            marginTop: 10,
                            marginBottom: 30,
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
                            testID={'join-button'}
                        >
                            Nous rejoindre
                        </Text>
                    </TouchableOpacity>

                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 16
                    }}>OU</Text>

                    <TouchableOpacity
                        onPress={onClickLoginWithGoogle}
                        style={{
                            marginTop: 30,
                            borderWidth: 3,
                            borderRadius: 50,
                            borderColor: colors.StayAliveRed,
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                        }}
                    >
                        <Image
                            style={{
                                width: 24,
                                height: 24,
                                marginRight: 10,
                            }}
                            source={require('../../assets/GoogleLogo.png')}
                        />
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 18,
                                color: colors.StayAliveRed,
                                fontWeight: 'bold',
                            }}
                            testID={'login-button-google'}
                        >
                            Se connecter avec Google
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
        </FadeInView>
    );
}
