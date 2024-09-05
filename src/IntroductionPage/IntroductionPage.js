import React from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-swiper'
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'
import { StayAliveColors } from '../Style/StayAliveStyle'

export function IntroductionPage1({ navigation }) {
  IntroductionPage1.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  return (
    <View style={styles.slide}>
      <View
        style={{
          position: 'absolute',
          bottom: -300,
          left: -400,
          width: 500,
          height: 500,
          borderRadius: 10000,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[StayAliveColors.StayAliveRed, StayAliveColors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: -450,
          width: 300,
          height: 300,
          left: -100,
          borderRadius: 10000,
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        <LinearGradient
          colors={[StayAliveColors.StayAliveRed, StayAliveColors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>
      <View style={styles.slideContent}>
        <Image
          style={styles.image}
          source={require('../../assets/Introduction1.png')}
          testID="introImage1"
        />
        <Image
          style={styles.logo}
          source={require('../../assets/StayAlive-logo.png')}
          testID="introLogo1"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Bienvenue sur StayAlive !</Text>
          <Text style={styles.description}>
            Chaque <Text style={styles.redText}>seconde</Text> compte pour
            sauver une vie
          </Text>
          <Text style={styles.description}>
            C'est la <Text style={styles.redText}>mission</Text> de StayAlive
          </Text>
          <Text style={styles.description}>
            StayAlive <Text style={styles.redText}>révolutionne</Text>{' '}
            l'intervention d'urgence.
          </Text>
        </View>
      </View>
    </View>
  )
}

export function IntroductionPage2({ navigation }) {
  IntroductionPage2.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  return (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        <Image
          testID="introImage2"
          style={styles.image}
          source={require('../../assets/Introduction2.png')}
        />
        <Image
          testID="introLogo2"
          style={styles.logo}
          source={require('../../assets/StayAlive-logo.png')}
        />
        <View style={styles.textContainer}>
          <View style={styles.textWithLogo}>
            <Text style={styles.title}>Le but de StayAlive</Text>
          </View>
          <View style={styles.textWithLogo}>
            <Image
              style={styles.logoIcon}
              source={require('../../assets/Introduction-logo1.png')}
            />
            <Text style={styles.description2}>
              Accélération du <Text style={styles.redText}>temps</Text> de prise
              en charge
            </Text>
          </View>
          <View style={styles.textWithLogo}>
            <Image
              style={styles.logoIcon}
              source={require('../../assets/Introduction-logo2.png')}
            />
            <Text style={styles.description2}>
              Accroissement des <Text style={styles.redText}>chances</Text> de
              survie
            </Text>
          </View>
          <View style={styles.textWithLogo}>
            <Image
              style={styles.logoIcon}
              source={require('../../assets/Introduction-logo3.png')}
            />
            <Text style={styles.description2}>
              <Text> Une communauté </Text>
              <Text style={styles.redText}>d'experts</Text> dédiés et prêts à
              agir
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export function IntroductionPage3({ navigation }) {
  IntroductionPage3.propTypes = {
    navigation: PropTypes.object.isRequired,
  }
  const onClickUnderstand = () => {
    navigation.navigate('LoginPage')
  }

  return (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        <Image
          testID="introImage3"
          style={styles.image}
          source={require('../../assets/Introduction3.png')}
        />
        <Image
          testID="introLogo3"
          style={styles.logo}
          source={require('../../assets/StayAlive-logo.png')}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Le fonctionnement de StayAlive !</Text>

          <Text style={styles.description3}>
            Dès qu'un centre d'appel d'urgence transfère l'alerte, notre système{' '}
            <Text style={styles.redText}>
              notifie les soignants qualifiés à proximité
            </Text>
            .{'\n\n'}
            Cela garantit une réponse rapide et augmente les chances de survie.
          </Text>
          <Text style={styles.description3} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onClickUnderstand} style={styles.button}>
            <Text style={styles.buttonText}>J'ai compris</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default function IntroductionPage({ navigation }) {
  const renderPagination = (index, total) => {
    if (index === total - 1) {
      return
    }

    return (
      <View style={styles.paginationContainer}>
        {Array.from({ length: total }).map((_, i) => (
          <Text
            key={i}
            style={{
              fontSize: 40,
              color: i === index ? StayAliveColors.StayAliveRed : 'lightgray',
              marginHorizontal: 5,
            }}
          >
            ●
          </Text>
        ))}
      </View>
    )
  }

  return (
    <Swiper
      style={styles.wrapper}
      showsButtons={false}
      loop={false}
      renderPagination={renderPagination}
      dotStyle={{
        marginBottom: 40,
        width: 15,
        height: 15,
        borderRadius: 10000,
      }}
    >
      <IntroductionPage1 />
      <IntroductionPage2 />
      <IntroductionPage3 navigation={navigation} />
    </Swiper>
  )
}

IntroductionPage.propTypes = {
  navigation: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 80,
    zIndex: 0,
  },
  button: {
    borderWidth: 3,
    borderRadius: 50,
    borderColor: StayAliveColors.StayAliveRed,
    paddingHorizontal: 50,
    paddingVertical: 10,
    backgroundColor: StayAliveColors.StayAliveRed,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    color: StayAliveColors.white,
    fontWeight: 'bold',
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
    marginTop: -20,
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 40,
    marginTop: -150,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: StayAliveColors.black,
    marginBottom: 20,
  },
  description: {
    fontSize: 17,
    fontWeight: 'bold',
    color: StayAliveColors.black,
    flexWrap: 'wrap',
  },
  description2: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: StayAliveColors.black,
    flexWrap: 'wrap',
  },
  description3: {
    alignItems: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    color: StayAliveColors.black,
    marginLeft: 20,
  },
  textWithLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  redText: {
    color: StayAliveColors.StayAliveRed,
  },
  logoIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 15,
  },
  paginationContainer: {
    position: 'absolute',
    flexDirection: 'row',
    marginTop: '170%',
    alignSelf: 'center',
  },
})
