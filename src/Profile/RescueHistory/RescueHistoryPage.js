import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
  Dimensions,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'
import { StayAliveColors } from '../../Style/StayAliveStyle'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from '../../Utils/Api'
import { CardRescue } from './CardRescue'

const { width, height } = Dimensions.get('window')

export default function RescueHistoryPage({ navigation }) {
  const [avatarSource, setAvatarSource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState(null)
  const [rescueData, setRescueData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [rescueNumber, setRescueNumber] = useState(0)

  RescueHistoryPage.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  const goBack = () => {
    console.log('arrow left clicked !')
    navigation.goBack()
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)

        const token = await AsyncStorage.getItem('userToken')

        const response = await fetch(`${urlApi}/rescuer/account`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setProfileData(data)
        setAvatarSource(null)
        console.log(data.firstname + ' ' + data.lastname)

        getHistoryRescue(token)
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des données du profil',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    const getHistoryRescue = async (token) => {
      try {
        setLoading(true)

        const response = await fetch(`${urlApi}/rescuer/emergency/history`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        console.log('data')
        console.log(data)
        setRescueData(data)
        setFilteredData(data)
        setRescueNumber(data.length)
        console.log(data.firstname + ' ' + data.lastname)
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des données du profil',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const renderRescueCard = (item) => (
    <View style={{ alignItems: 'center' }}>
      <CardRescue
        number={item.number}
        id={item.id}
        info={item.info}
        address={item.address}
        status={item.status}
      />
    </View>
  )

  const filterData = () => {
    if (!searchTerm.trim()) {
      setFilteredData(rescueData)
    } else {
      const filtered = rescueData.filter((item) => {
        return Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
      setFilteredData(filtered)
    }
  }

  useEffect(() => {
    filterData()
  }, [searchTerm])

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          alignSelf: 'center',
          top: -height * 0.43,
          width: width * 1.3,
          height: height * 0.67,
          borderRadius: 1000,
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

      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <ActivityIndicator
            size="large"
            color={StayAliveColors.StayAliveRed}
          />
        </View>
      )}

      <View style={{ alignItems: 'center' }}>
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              top: -height * 0.57,
            }}
          >
            <Image
              testID="user-avatar"
              style={{
                alignSelf: 'center',
                width: width * 0.4,
                height: width * 0.4,
                borderRadius: width * 0.2,
                resizeMode: 'contain',
              }}
              source={
                avatarSource
                  ? { uri: avatarSource }
                  : require('../../../assets/StayAlive-logo.png')
              }
            />
          </View>
        </View>

        <Text
          testID="user-name"
          style={{
            alignSelf: 'center',
            top: -height * 0.38,
            marginTop: height * 0.02,
            marginBottom: -height * 0.32,
            fontSize: 22,
            color: 'black',
            fontWeight: 'bold',
          }}
        >
          {profileData
            ? `${profileData.firstname} ${profileData.lastname}`
            : 'Chargement...'}
        </Text>

        <TouchableOpacity
          testID="button-left-arrow"
          style={{
            position: 'absolute',
            top: -height * 0.6,
            left: 30,
            zIndex: 1,
          }}
          onPress={goBack}
        >
          <Icon name="arrow-left" size={width * 0.075} onPress={goBack} />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: width * 0.03,
            marginTop: -height * 0.04,
          }}
        >
          <Text
            style={{ fontSize: width * 0.04, color: StayAliveColors.black }}
          >
            Nombre de sauvetages :
          </Text>
          <View
            style={{
              marginLeft: height * 0.01,
              width: width * 0.08,
              height: height * 0.04,
              borderRadius: 15,
              backgroundColor: StayAliveColors.StayAliveRed,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: width * 0.04 }}>
              {rescueNumber}
            </Text>
          </View>
        </View>
        {rescueNumber > 1 && (
          <TextInput
            style={{
              height: height * 0.04,
              marginTop: height * 0.02,
              marginBottom: height * 0.04,
              width: width * 0.75,
              alignSelf: 'center',
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 1,
            }}
            onChangeText={(text) => setSearchTerm(text)}
            value={searchTerm}
            placeholder="Rechercher une information..."
          />
        )}

        {rescueNumber === 0 ? (
          <Text
            testID="no-rescues-message"
            style={{
              flex: 1,
              fontSize: width * 0.05,
              color: StayAliveColors.black,
              marginTop: height * 0.1,
              maxWidth: width * 0.6,
            }}
          >
            Vous n'avez pas encore de sauvetages...
          </Text>
        ) : (
          <FlatList
            style={{ width: '100%' }}
            data={filteredData.map((item, index) => ({
              ...item,
              number: index + 1,
            }))}
            renderItem={({ item }) => renderRescueCard(item)}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </View>
  )
}
