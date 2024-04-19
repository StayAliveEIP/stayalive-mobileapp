import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native'
import { io } from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from '../Utils/Api'
import { colors } from '../Style/StayAliveStyle'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Appbar } from 'react-native-paper'

const ChatEmergency = ({ navigation, route }) => {
  const [socket, setSocket] = useState(null)
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [chatConversationId, setChatConversationId] = useState("")
  const [rescuerId, setRescuerId] = useState("");
  const [loading, setLoading] = useState(true);
  const { callCenterId } = route?.params;

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
          setChatHistory((prevChat) => [
            ...prevChat,
            { text: data?.message, sender: 'callCenter' },
          ])
        })

        setSocket(newSocket)

        await AsyncStorage.setItem('WebSocket', socketUrl)
      }
    } catch (error) {
      console.error('Error initializing WebSocket:', error)
    }
  }

  const getConversationId = async () => {
    try {
      const url = `${urlApi}/rescuer/chat/conversations`;
      const token = await AsyncStorage.getItem('userToken')
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        let lastId = "";
        let lastRescuerId = "";
        for (let i = data.length - 1; i >= 0; i--) {
          if (data[i].callCenterId === callCenterId) {
            lastId = data[i]._id;
            lastRescuerId = data[i].rescuerId;
            break;
          }
        }
        setChatConversationId(lastId)
        setRescuerId(lastRescuerId)
        setLoading(false);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      if (error?.message !== 'Invalid credentials') {
        console.error(
            'There has been an issue with the fetch operation:',
            error
        );
        Alert?.alert('Error', 'Nous ne parvenons pas à contacter nos serveurs');
      }
    }
  }

  const sendMessage = () => {
    if (socket && message?.trim() !== '') {
      socket.emit('messageRescuer', {
        conversationId: chatConversationId,
        message: message,
      })
      setChatHistory((prevChat) => [
        ...prevChat,
        { text: message, sender: rescuerId },
      ])
      setMessage('')
    }
  }

  const loadChatHistory = async () => {
    try {
      const url = `${urlApi}/rescuer/chat/messages?id=${chatConversationId}`;
      const token = await AsyncStorage.getItem('userToken')

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const formattedMessages = data.map(message => ({
            text: message?.content,
            sender: message?.senderId
          }));
          setChatHistory(formattedMessages);
          setLoading(false);
        }
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
    }
  }

  useEffect(() => {
    initializeWebSocket();
    getConversationId();
  }, []);

  useEffect(() => {
    if (chatConversationId) {
      loadChatHistory();
    }
  }, [chatConversationId]);

  const renderMessageBubble = ({ item }) => {
    const bubbleStyle =
        item?.sender === rescuerId ? styles.userBubble : styles.callCenterBubble
    const textStyle =
        item?.sender === rescuerId ? styles.userText : styles.callCenterText

    return (
        <View style={[styles.messageBubble, bubbleStyle]}>
          <Text style={textStyle}>{item.text}</Text>
        </View>
    )
  }

  const goBack = async () => {
    console.log('arrow left clicked !')
    if (socket) {
      socket?.disconnect()
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
        {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.StayAliveRed} />
            </View>
        ) : (
            <View style={styles.container}>
              <FlatList
                  showsVerticalScrollIndicator={false}
                  data={chatHistory?.slice()?.reverse()}
                  renderItem={renderMessageBubble}
                  keyExtractor={(item, index) => index?.toString()}
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
        )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ChatEmergency
