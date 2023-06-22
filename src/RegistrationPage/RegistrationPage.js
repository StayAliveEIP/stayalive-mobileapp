import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {TextInputStayAlive} from './textInputStayAlive';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../Style/StayAliveStyle'

export default function RegistrationPage() {
    const [names, onChangeNames] = useState('');
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    const [phone, onChangePhone] = useState('');
    const [selectCGUV, setSelectionCGUV] = useState(false);

    return (
        <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
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
                        Nous rejoindre
                    </Text>

                    <View style={{marginTop: 15}}>
                        <TextInputStayAlive
                            text={'Votre nom et prénom'}
                            field={names}
                            onChangeField={onChangeNames}
                            label={'Nom et Prénom'}
                            secureTextEntry={false}
                        />
                        <TextInputStayAlive
                            text={'Votre adresse E-mail'}
                            field={email}
                            onChangeField={onChangeEmail}
                            label={'E-mail'}
                            style={{marginTop: -50}}
                        />
                        <TextInputStayAlive
                            text={'Votre mot de passe'}
                            field={password}
                            onChangeField={onChangePassword}
                            label={'Mot de passe'}
                            secureTextEntry={true}
                        />
                        <TextInputStayAlive
                            text={'Votre téléphone'}
                            field={phone}
                            onChangeField={onChangePhone}
                            label={'(+33) 01 02 03 04 05'}
                            secureTextEntry={false}
                        />
                        {/* Ajoutez les autres TextInputStayAlive */}
                    </View>
                    <View
                        style={{
                            marginTop: 2,
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: -70,
                        }}
                    >
                        <CheckBox
                            value={selectCGUV}
                            onValueChange={setSelectionCGUV}
                            tintColors={{true: colors.StayAliveRed}}
                        />
                        <Text>Accepter nos </Text>
                        <Text style={{color: colors.StayAliveRed}}>CGU</Text>
                        <Text> et nos </Text>
                        <Text style={{color: colors.StayAliveRed}}>CGV</Text>

                    </View>
                    <TouchableOpacity
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
                        >
                            Nous rejoindre
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
