import * as React from "react";
import { Animated } from "react-native";
const useFocusEffect = (effect) => {
    const cleanup = () => {};

    effect();

    return cleanup;
};

export const FadeInView = (props) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useFocusEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: props.duration,
            useNativeDriver: true,
        }).start();
    });

    return (
        <Animated.View style={{ opacity: fadeAnim }}>
            {props.children}
        </Animated.View>
    );
};

export const SlideInView = (props) => {
    const slideAnim = React.useRef(new Animated.Value(props.value)).current;

    useFocusEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: props.duration,
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

export const ScaleInView = (props) => {
    const scaleAnim = React.useRef(new Animated.Value(0.5)).current;

    useFocusEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5, // contrôle la vitesse de la transition
            useNativeDriver: true,
        }).start();
    });

    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }],
            }}>
            {props.children}
        </Animated.View>
    );
};

export const RotateInView = (props) => {
    const rotateAnim = React.useRef(new Animated.Value(0)).current;

    useFocusEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    });

    const interpolatedRotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View
            style={{
                transform: [{ rotate: interpolatedRotate }],
            }}>
            {props.children}
        </Animated.View>
    );
};