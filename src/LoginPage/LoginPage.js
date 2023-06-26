import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import {TextInputStayAlive} from './textInputStayAlive';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../Style/StayAliveStyle'

export default function LoginPage() {
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');

    const onClickLogin = () => {
        console.log(email, password);
    };

    return (
        <ScrollView >
            <View
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: -420,
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
                    right: -150,
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
                        source={require('../../assets/StayAlive1.png')}
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
                        Se connecter
                    </Text>

                    <View style={{marginTop: 15}}>
                        <TextInputStayAlive
                            valueTestID={"login-email-input"}
                            text={'Votre adresse E-mail'}
                            field={email}
                            onChangeField={onChangeEmail}
                            label={'  E-mail'}
                        />
                        <TextInputStayAlive
                            valueTestID={"login-password-input"}
                            text={'Votre mot de passe'}
                            field={password}
                            onChangeField={onChangePassword}
                            label={'Mot de passe'}
                            secureTextEntry={true}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={onClickLogin}
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
                            testID={'login-button'}
                        >
                            Se connecter
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}