import React, { useState } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import { StayAliveColors } from '../Style/StayAliveStyle'

const { width, height } = Dimensions.get('window')

export const CardDefibrilator = ({ item }) => {
  const [expanded, setExpanded] = useState(false)

  const handleToggleExpansion = () => {
    setExpanded(!expanded)
  }

  CardDefibrilator.propTypes = {
    item: PropTypes.shape({
      number: PropTypes.number.isRequired,
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      pictureUrl: PropTypes.string,
      status: PropTypes.string.isRequired,
    }).isRequired,
  }
  return (
    <TouchableOpacity
      style={{ width: '100%', alignItems: 'center' }}
      onPress={handleToggleExpansion}
      testID={`defibrilator-card-${item._id}`}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Défibrilateur {item.number}</Text>
          <Icon
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={StayAliveColors.black}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.id}>ID: {item._id}</Text>
        </View>

        {expanded && (
          <>
            <View style={styles.separator} />
            <View style={styles.row}>
              <Text style={styles.subtitle}>Nom: </Text>
              <Text style={styles.infos}>{item.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.subtitle}>Address: </Text>
              <Text style={styles.infos}>{item.address}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.subtitle}>Status: </Text>
              <Text style={styles.infos}>{item.status}</Text>
            </View>
            {item.pictureUrl ? (
              <Image source={{ uri: item.pictureUrl }} style={styles.image} />
            ) : null}
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: height * 0.03,
    width: width * 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.055,
    color: StayAliveColors.StayAliveRed,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginVertical: width * 0.01,
  },
  subtitle: {
    fontWeight: 'bold',
    color: StayAliveColors.black,
  },
  id: {
    fontStyle: 'italic',
    color: '#666',
  },
  infos: {
    color: StayAliveColors.black,
    maxWidth: width * 0.51,
  },
  separator: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginVertical: width * 0.03,
  },
  image: {
    width: width * 0.02,
    height: height * 0.2,
    borderRadius: 8,
    marginBottom: height * 0.02,
  },
})
