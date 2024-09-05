import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Alert } from 'react-native';
import io from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker'; // Import from expo-image-picker
import { REACT_NATIVE_API_KEY } from '@env'; // Use .env for API key
import * as FileSystem from 'expo-file-system';

const SOCKET_URL = 'https://agritayo.azurewebsites.net';

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newImage, setNewImage] = useState(null); // For storing the selected image
  const socket = useRef(null);
  const { receiverId } = route.params; // Get receiverId from route params
  const userId = 1; // Default user ID

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5, // Allow reconnections
      reconnectionDelay: 1000, // Delay between reconnections
    });

    // Handle incoming messages
    socket.current.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Fetch initial messages
    const fetchMessages = async () => {
      if (userId && receiverId) {
        try {
          const response = await fetch(`https://agritayo.azurewebsites.net/api/chats`, {
            headers: {
              'x-api-key': REACT_NATIVE_API_KEY
            }
          });

          if (response.ok) {
            const allMessages = await response.json();
            setMessages(allMessages); // Store all messages
          } else {
            console.error('Failed to fetch messages:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchMessages();

    // Clean up socket connection on unmount
    return () => {
      socket.current.disconnect();
    };
  }, [receiverId, userId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() || newImage) {
      const formData = new FormData();
      formData.append('sender_id', userId.toString());
      formData.append('receiver_id', receiverId.toString());
      formData.append('chat_message', newMessage);
      formData.append('receiver_type', 'User'); // Include receiver_type field
  
      if (newImage) {
        const { uri } = newImage;
        const name = uri.split('/').pop();
        const type = 'image/jpeg'; // Default type if not provided
  
        // Read file from filesystem
        const file = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  
        formData.append('image', {
          uri: `data:${type};base64,${file}`, // Encode file as Base64
          type,
          name,
        });
      }
  
      try {
        const response = await fetch('https://agritayo.azurewebsites.net/api/chats', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'x-api-key': REACT_NATIVE_API_KEY,
          },
          body: formData, // Use FormData for both image and message data
        });
  
        if (response.ok) {
          const savedMessage = await response.json();
          console.log('Message saved to DB:', savedMessage.data);
  
          // Clear inputs
          setNewMessage('');
          setNewImage(null); // Clear the image input
        } else {
          console.error('Failed to send message:', response.statusText);
          Alert.alert('Error', 'Failed to send message. Please try again.');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', 'Network request failed. Please check your connection.');
      }
    } else {
      Alert.alert('Error', 'Message or image is required.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      const { uri, type } = selectedImage;
      console.log(uri)
      setNewImage(selectedImage);
    }
  };

  const userIdStr = String(userId);
  const receiverIdStr = String(receiverId);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          renderItem={({ item, index }) => {
            const senderIdStr = String(item.sender_id);
            const msgReceiverIdStr = String(item.receiver_id);

            // Check if the message is between the current user and the receiver
            const isSenderMatch = senderIdStr === userIdStr && msgReceiverIdStr === receiverIdStr;
            const isReceiverMatch = msgReceiverIdStr === userIdStr && senderIdStr === receiverIdStr;

            if (isSenderMatch || isReceiverMatch) {
              return (
                <View key={index} style={styles.messageContainer}>
                  <Text style={styles.messageText}>
                    <Text style={styles.userId}>{senderIdStr === userIdStr ? 'You' : senderIdStr}:</Text> {item.chat_message}
                  </Text>
                  {item.chat_image_url && (
                    <Image source={{ uri: item.chat_image_url }} style={styles.chatImage} />
                  )}
                </View>
              );
            }

            return null; // Do not render the item if it doesn't match
          }}
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
          <TouchableOpacity onPress={pickImage} style={styles.button}>
            <Text>Select Image</Text>
          </TouchableOpacity>
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
  button: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  chatImage: {
    width: 200,
    height: 200,
    marginVertical: 5,
  },
});

export default ChatScreen;
