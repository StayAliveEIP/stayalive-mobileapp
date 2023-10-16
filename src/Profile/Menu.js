import React from 'react';
import {Text, TextInput, View, TouchableOpacity} from 'react-native';
import { colors } from '../Style/StayAliveStyle'
import Icon from 'react-native-vector-icons/Ionicons';

export function Menu(props) {
    const onClickMenu = () => {
    }
    return (
        <View
            testID={"box-menu"}
            style={{
            flex: 1,
            justifyContent: "center",
            top: -160,
            borderWidth: 2,
            width: "100%",
            height: 60,
            borderColor: "gray",
        }}>
            <Icon
                testID={"icon-menu"}
                style={{position: "absolute", marginLeft: 30}}
                name={props.icon}
                size={35}>
            </Icon>
        <Text
            testID={"text-menu"}
            style={{
            marginLeft: -100,
            textAlign: "center",
            color: "black",
            fontWeight: 'bold',
            fontSize: 17,
        }} >{props.name}</Text>

            <TouchableOpacity
                testID={"button-right-arrow"}
                style={{flex: 1, zIndex: 1, position: "absolute"}}
                onPress={() => console.log("Menu " + props.name)}
            >
            <Icon
                style={{marginLeft: "90%"}}
                name="chevron-forward-outline"
                size={35}>
            </Icon>
            </TouchableOpacity>

        </View>
    );
}
