import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'

export const CardRescue = ({ number, id, info, address, status }) => {
  const [expanded, setExpanded] = useState(false)

  const handleToggleExpansion = () => {
    setExpanded(!expanded)
  }

  CardRescue.propTypes = {
    number: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }

  return (
    <TouchableOpacity
      style={{ width: '100%', alignItems: 'center' }}
      onPress={handleToggleExpansion}
      testID={`rescue-card-${id}`}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Sauvetage {number}</Text>
          <Icon
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={StayAliveColors.black}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.id}>ID: {id}</Text>
        </View>

        {expanded && (
          <>
            <View style={styles.separator} />
            <View style={styles.row}>
              <Text style={styles.subtitle}>Info: </Text>
              <Text style={styles.infos}>{info}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.subtitle}>Address: </Text>
              <Text style={styles.infos}>{address}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.subtitle}>Status: </Text>
              <Text style={styles.infos}>{status}</Text>
            </View>
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
    marginBottom: 20,
    width: '80%',
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
    fontSize: 24,
    color: StayAliveColors.StayAliveRed,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
  },
  subtitle: {
    fontWeight: 'bold',
    color: StayAliveColors.black,
  },
  id: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 10,
  },
  status: {
    fontStyle: 'italic',
    color: '#666',
  },
  infos: {
    color: StayAliveColors.black,
    maxWidth: 265,
  },
  separator: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
})
