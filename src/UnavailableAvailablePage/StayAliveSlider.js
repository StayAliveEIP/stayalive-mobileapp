import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types'; // Import de PropTypes
import { StayAliveColors } from '../Style/StayAliveStyle';

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
    outputRange: [5, 175],
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
            size={24}
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
    width: 230,
    height: 60,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4, // For Android shadow
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    position: 'absolute',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 45,
    borderWidth: 2,
  },
});

export default StayAliveSlider;
