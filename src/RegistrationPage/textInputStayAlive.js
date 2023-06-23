import React from 'react';
import {Text, TextInput, View} from 'react-native';
import { colors } from '../Style/StayAliveStyle'

export function TextInputStayAlive(props) {
    return (
        <View style={{
            marginTop: 7
        }}>
            <Text style={{
                color: colors.black,
                fontWeight: 'bold',
                fontSize: 16,
            }}>{props.text}</Text>
            <TextInput
                testID={props.valueTestID}
                style={{
                    height: 45,
                    width: 280,
                    borderWidth: 1,
                    borderRadius: 7,
                    marginTop: 4,
                    borderColor: colors.lightgray,
                }}
                placeholder={props.label}
                onChangeText={props.onChangeField}
                value={props.field}
                secureTextEntry={props.secureTextEntry}
            />
        </View>
    );
}
