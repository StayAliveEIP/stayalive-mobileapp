import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'
import { urlApi } from '../Utils/Api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StayAliveColors } from '../Style/StayAliveStyle'
import { CardDefibrilator } from './CardDefibrilator'
import PropTypes from 'prop-types'

const { width, height } = Dimensions.get('window')

export default function DefibrilatorListPage({ navigation }) {
  const [defibrillators, setDefibrillators] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState([])

  DefibrilatorListPage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }
  const goBack = () => {
    navigation.goBack()
  }

  useEffect(() => {
    const fetchDefibrillators = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken')
        const url = `${urlApi}/rescuer/defibrillator`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        if (response.ok) {
          setDefibrillators(data)
          setFilteredData(data)
        }
      } catch (error) {
        console.error('Error fetching defibrillators:', error)
      }
    }

    fetchDefibrillators()
  }, [])

  useEffect(() => {
    const filterData = () => {
      if (!searchTerm.trim()) {
        setFilteredData(defibrillators)
      } else {
        const filtered = defibrillators.filter((item) => {
          return Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        })
        setFilteredData(filtered)
      }
    }
    filterData()
  }, [searchTerm, defibrillators])

  const validatedDefibrillatorsCount = defibrillators.filter(
    (defib) => defib.status === 'VALIDATED'
  ).length

  return (
    <View style={styles.container}>
      <View style={styles.gradientBackground}>
        <LinearGradient
          colors={[StayAliveColors.StayAliveRed, StayAliveColors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>
      <TouchableOpacity
        testID="button-left-arrow"
        style={styles.backButton}
        onPress={goBack}
      >
        <Icon testID="document-logo" name="arrow-left" size={30} />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Image
          style={styles.image}
          source={require('../../assets/DefibrilatorListPage.png')}
        />
        <Text style={styles.header}>Listes des défibrillateurs</Text>

        <View style={styles.validatedCountContainer}>
          <Text style={styles.validatedCountText}>
            Nombre de défibrillateurs validés :
          </Text>
          <View style={styles.countBox}>
            <Text style={styles.countText}>{validatedDefibrillatorsCount}</Text>
          </View>
        </View>
      </View>

      {defibrillators.length > 0 && (
        <TextInput
          style={styles.searchInput}
          onChangeText={(text) => setSearchTerm(text)}
          value={searchTerm}
          placeholder="Rechercher un défibrillateur..."
        />
      )}

      {filteredData.length === 0 ? (
        <Text
          testID="no-defibrillators-message"
          style={styles.noDefibrillatorsMessage}
        >
          Aucun défibrillateur trouvé...
        </Text>
      ) : (
        <FlatList
          style={{ width: '100%' }}
          data={filteredData.map((item, index) => ({
            ...item,
            number: index + 1,
          }))}
          renderItem={({ item }) => <CardDefibrilator item={item} />}
          keyExtractor={(item) => item._id}
        />
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.mapButton]}
          onPress={() =>
            navigation.navigate('MapDefibrilatorPage', { defibrillators })
          }
          s
        >
          <Icon
            name="map-marker"
            size={35}
            color={StayAliveColors.StayAliveRed}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={() => navigation.navigate('DefibrilatorPage')}
        >
          <Icon name="plus" size={35} color={StayAliveColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  gradientBackground: {
    position: 'absolute',
    alignSelf: 'center',
    top: -height * 0.3,
    width: width * 1.2,
    height: height * 0.52,
    borderRadius: 1000,
    overflow: 'hidden',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.04,
    left: width * 0.1,
    zIndex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  image: {
    alignSelf: 'center',
    width: width * 0.3,
    height: height * 0.135,
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: height * 0.01,
    marginTop: height * 0.02,
  },
  validatedCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  validatedCountText: {
    fontSize: width * 0.04,
    color: StayAliveColors.black,
  },
  countBox: {
    marginLeft: height * 0.01,
    width: width * 0.08,
    height: height * 0.032,
    borderRadius: 15,
    backgroundColor: StayAliveColors.StayAliveRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: 'white',
    fontSize: width * 0.04,
  },
  searchInput: {
    height: height * 0.04,
    marginTop: height * 0.02,
    marginBottom: height * 0.04,
    width: width * 0.7,
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  noDefibrillatorsMessage: {
    fontSize: width * 0.05,
    alignSelf: 'center',
    color: StayAliveColors.black,
    marginTop: height * 0.17,
    maxWidth: width * 0.6,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: height * 0.02,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    width: width * 0.15,
    height: height * 0.07,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapButton: {
    borderColor: StayAliveColors.StayAliveRed,
    borderWidth: 2,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: StayAliveColors.StayAliveRed,
  },
  addButtonText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
  },
})
