import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'
import { StayAliveColors } from '../../Style/StayAliveStyle'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from '../../Utils/Api'
import { CardRescue } from './CardRescue'

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
          top: -260,
          width: 550,
          height: 500,
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
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            size="large"
            color={StayAliveColors.StayAliveRed}
          />
        </View>
      )}

      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              top: -360,
            }}
          >
            <Image
              testID="user-avatar"
              style={{
                alignSelf: 'center',
                width: 160,
                height: 160,
                borderRadius: 100,
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
            top: -210,
            marginTop: 14,
            marginBottom: -150,
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
            top: -440,
            left: 30,
            zIndex: 1,
          }}
          onPress={goBack}
        >
          <Icon name="arrow-left" size={30} onPress={goBack} />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            marginTop: -30,
          }}
        >
          <Text style={{ fontSize: 18, color: StayAliveColors.black }}>
            Nombre de sauvetages :
          </Text>
          <View
            style={{
              marginLeft: 10,
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: StayAliveColors.StayAliveRed,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>{rescueNumber}</Text>
          </View>
        </View>
        {rescueNumber >= 2 ? (
          <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 10,
              marginBottom: 20,
              padding: 10,
            }}
            onChangeText={(text) => setSearchTerm(text)}
            value={searchTerm}
            placeholder="Rechercher une information d'un sauvetage..."
          />
        ) : null}

        {rescueNumber === 0 ? (
          <Text
            testID="no-rescues-message"
            style={{
              fontSize: 18,
              color: StayAliveColors.black,
              marginBottom: 20,
              marginTop: 130,
              maxWidth: 200,
            }}
          >
            Oupss, vous n'avez pas encore de sauvetages...
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
