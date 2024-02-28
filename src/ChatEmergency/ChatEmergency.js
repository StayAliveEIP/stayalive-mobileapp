import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native'
import { io } from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from '../Utils/Api'
import { colors } from '../Style/StayAliveStyle'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Appbar } from 'react-native-paper'
import PropTypes from 'prop-types'

const ChatEmergency = ({ navigation }) => {
  const [socket, setSocket] = useState(null)
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])

  ChatEmergency.propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  const initializeWebSocket = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      if (token) {
        const socketUrl = `${urlApi}/chat/ws?token=${token}`
        const newSocket = io(socketUrl)

        newSocket.on('connect', () => {
          console.log('Connected to WebSocket')
        })

        newSocket.on('message', (data) => {
          const jsonData = data?.data
          if (jsonData !== null && jsonData !== undefined) {
            setChatHistory((prevChat) => [...prevChat, jsonData])
          }
        })

        setSocket(newSocket)

        await AsyncStorage.setItem('WebSocket', socketUrl)
      }
    } catch (error) {
      console.error('Error initializing WebSocket:', error)
    }
  }

  const sendMessage = () => {
    if (socket && message.trim() !== '') {
      socket.emit('message', { text: message })
      setChatHistory((prevChat) => [
        ...prevChat,
        { text: message, sender: 'user' },
      ])
      setMessage('')
    }
  }

  useEffect(() => {
    initializeWebSocket()

    return () => {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
    }
  }, [])

  const renderMessageBubbleUser = ({ item }) => {
    return (
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.callCenterBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    )
  }

  const goBack = () => {
    console.log('arrow left clicked !')
    navigation.goBack()
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={styles.appBar}>
        <Icon
          style={styles.iconBack}
          name="arrow-left"
          size={27}
          onPress={goBack}
        />
        <Appbar.Content title="Centre d'appel" titleStyle={styles.title} />
      </Appbar.Header>

      <Image
        source={require('./../../assets/ChatEmergency.png')}
        style={styles.image}
      />
      <View style={styles.container}>
        <FlatList
          inverted
          showsVerticalScrollIndicator={false}
          data={chatHistory}
          renderItem={({ item }) => renderMessageBubbleUser({ item })}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <Icon
            name="send"
            size={30}
            style={styles.icon}
            onPress={sendMessage}
            color={colors.StayAliveRed}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 'auto',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  userBubble: {
    flex: 1,
    backgroundColor: colors.StayAliveRed,
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  iconBack: {
    marginLeft: 10,
  },
  messageText: {
    color: 'white',
  },
  icon: {
    marginRight: 10,
  },
  appBar: {
    backgroundColor: '#f9f9f9',
    elevation: 5,
  },
  title: {
    color: colors.StayAliveRed,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    position: 'absolute',
    width: 400,
    height: 400,
    marginTop: '50%',
    resizeMode: 'center',
    opacity: 0.7,
    marginBottom: 20,
  },
})

export default ChatEmergency
