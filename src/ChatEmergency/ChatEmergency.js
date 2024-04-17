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

const ChatEmergency = ({ navigation, route }) => {
  const [socket, setSocket] = useState(null)
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  // const { conversationId } = route?.params;

  ChatEmergency.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
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

        newSocket.on('messageCallCenter', (data) => {
          if (!chatHistory.find((msg) => msg.text === data.message)) {
            setChatHistory((prevChat) => [
              ...prevChat,
              { text: data.message, sender: 'callCenter' },
            ])
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
      socket.emit('messageRescuer', {
        conversationId: '661be68b6c652f93a36f9ea1',
        message: message,
      })
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

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const savedChatHistory = await AsyncStorage.getItem('chatHistory')
        if (savedChatHistory !== null) {
          setChatHistory(JSON.parse(savedChatHistory))
        }
      } catch (error) {
        console.error('Error loading chat history:', error)
      }
    }
    loadChatHistory()
  }, [])

  const renderMessageBubble = ({ item }) => {
    const bubbleStyle =
      item.sender === 'user' ? styles.userBubble : styles.callCenterBubble
    const textStyle =
      item.sender === 'user' ? styles.userText : styles.callCenterText

    return (
      <View style={[styles.messageBubble, bubbleStyle]}>
        <Text style={textStyle}>{item.text}</Text>
      </View>
    )
  }

  const goBack = async () => {
    console.log('arrow left clicked !')
    if (socket) {
      socket.disconnect()
      setSocket(null)
    }
    await AsyncStorage.setItem('chatHistory', JSON.stringify(chatHistory))
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
          showsVerticalScrollIndicator={false}
          data={chatHistory.slice().reverse()}
          renderItem={renderMessageBubble}
          keyExtractor={(item, index) => index.toString()}
          inverted
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
    backgroundColor: colors.StayAliveRed,
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  callCenterBubble: {
    backgroundColor: 'lightgrey',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  userText: {
    color: 'white',
  },
  callCenterText: {
    color: 'black',
  },
  iconBack: {
    marginLeft: 10,
  },
  messageBubble: {
    maxWidth: '80%',
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
