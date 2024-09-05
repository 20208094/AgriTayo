// ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import io from 'socket.io-client';
import { REACT_NATIVE_API_KEY } from '@env'; // Use .env for API key

const SOCKET_URL = 'https://agritayo.azurewebsites.net/api/chat';

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useRef(null);
  const { receiverId } = route.params; // Get receiverId from route params
  const userId = 1; // Default user ID

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(SOCKET_URL, {
      transports: ['websocket']
    });

    // Handle incoming messages
    socket.current.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up socket connection on unmount
    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        sender_id: userId,
        receiver_id: receiverId,
        chat_message: newMessage,
        receiver_type: 'User',
      };
      socket.current.emit('chat message', message);

      try {
        // Save message to the server
        const response = await fetch('https://agritayo.azurewebsites.net/api/chats', {
          method: 'POST',
          headers: {
            'x-api-key': REACT_NATIVE_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        // Clear input field after sending
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>
                <Text style={styles.userId}>{item.sender_id}:</Text> {item.chat_message}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messageList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            style={styles.input}
          />
          <Button title="Send" onPress={handleSendMessage} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
  },
  userId: {
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
});

export default ChatScreen;
