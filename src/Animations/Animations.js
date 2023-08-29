import * as React from "react";
import {Animated} from "react-native";
import {useFocusEffect} from "@react-navigation/native";

export const FadeInView = (props) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useFocusEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

    });

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
            }}>
            {props.children}
        </Animated.View>
    );
};


export const SlideInView = (props) => {
    const slideAnim = React.useRef(new Animated.Value(200)).current;

    useFocusEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    });

    return (
        <Animated.View
            style={{
                transform: [{ translateX: slideAnim }],
            }}>
            {props.children}
        </Animated.View>
    );
};