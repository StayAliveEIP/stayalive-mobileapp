import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { StayAliveColors } from '../Style/StayAliveStyle';

const { width, height } = Dimensions.get('window');

const StayAliveSlider = ({ defaultValue, setAvailable, onPress }) => {
  const [isAvailable, setIsAvailable] = useState(defaultValue);
  const animation = useRef(new Animated.Value(defaultValue ? 1 : 0)).current;

  useEffect(() => {
    setIsAvailable(defaultValue);
    Animated.timing(animation, {
      toValue: defaultValue ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [defaultValue]);

  const toggleSwitch = () => {
    const newValue = !isAvailable;

    Animated.timing(animation, {
      toValue: newValue ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsAvailable(newValue);
    setAvailable(newValue);
    onPress(newValue);
  };

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F6F7EE', StayAliveColors.StayAliveRed],
  });

  const textColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [StayAliveColors.StayAliveRed, 'white'],
  });

  const sliderPosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [5, width * 0.44],
  });

  const textPosition = animation.interpolate({
    inputRange: [0, 2],
    outputRange: [80, 20],
  });

  return (
    <TouchableOpacity style={styles.container} onPress={toggleSwitch}>
      <Animated.View style={[styles.button, { backgroundColor }]}>
        <Animated.Text
          style={[
            styles.buttonText,
            { color: textColor, marginLeft: textPosition },
          ]}
        >
          {isAvailable ? 'Disponible' : 'Indisponible'}
        </Animated.Text>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ translateX: sliderPosition }],
              borderColor: isAvailable ? 'white' : StayAliveColors.StayAliveRed,
              backgroundColor: isAvailable ? 'white' : StayAliveColors.StayAliveRed,
            },
          ]}
        >
          <Icon
            name={isAvailable ? 'check' : 'times'}
            size={width * 0.06}
            color={isAvailable ? StayAliveColors.StayAliveRed : 'white'}
          />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

StayAliveSlider.propTypes = {
  defaultValue: PropTypes.bool.isRequired, // Propriété defaultValue de type booléen requis
  setAvailable: PropTypes.func.isRequired, // Propriété setAvailable de type fonction requise
  onPress: PropTypes.func.isRequired, // Propriété onPress de type fonction requise
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: StayAliveColors.StayAliveRed,
    borderWidth: 2,
    borderRadius: 50,
    width: width * 0.58,
    height: height * 0.078,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4, // For Android shadow
  },
  buttonText: {
    fontSize: width * 0.048,
    fontWeight: 'bold',
  },
  iconContainer: {
    position: 'absolute',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.11,
    height: height * 0.06,
    borderWidth: 2,
  },
});

export default StayAliveSlider;
