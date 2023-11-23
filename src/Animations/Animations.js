import * as React from 'react'
import { Animated } from 'react-native'
import PropTypes from 'prop-types'

const useFocusEffect = (effect) => {
  const cleanup = () => {}

  effect()

  return cleanup
}

export function FadeInView(props) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current

  useFocusEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: props.duration,
      useNativeDriver: true,
    }).start()
  })

  return (
    <Animated.View style={{ opacity: fadeAnim }} testID={props.testID}>
      {props.children}
    </Animated.View>
  )
}

FadeInView.propTypes = {
  duration: PropTypes.number.isRequired,
  testID: PropTypes.string,
  children: PropTypes.node,
}

export function SlideInView(props) {
  const slideAnim = React.useRef(new Animated.Value(props.value)).current

  useFocusEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: props.duration,
      useNativeDriver: true,
    }).start()
  })

  return (
    <Animated.View
      style={{
        transform: [{ translateX: slideAnim }],
      }}
      testID={props.testID}
    >
      {props.children}
    </Animated.View>
  )
}

SlideInView.propTypes = {
  value: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  testID: PropTypes.string,
  children: PropTypes.node,
}

export function ScaleInView(props) {
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current

  useFocusEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start()
  })

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
      testID={props.testID}
    >
      {props.children}
    </Animated.View>
  )
}

ScaleInView.propTypes = {
  testID: PropTypes.string,
  children: PropTypes.node,
}

export function RotateInView(props) {
  const rotateAnim = React.useRef(new Animated.Value(0)).current

  RotateInView.propTypes = {
    testID: PropTypes.string,
    children: PropTypes.node,
  }

  useFocusEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  })

  const interpolatedRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <Animated.View
      style={{
        transform: [{ rotate: interpolatedRotate }],
      }}
      testID={props.testID}
    >
      {props.children}
    </Animated.View>
  )
}
