import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Alert } from 'react-native';
import io from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Icon package
import { styled } from 'nativewind';
import ImageViewing from 'react-native-image-viewing'; // Full screen image viewer
import { REACT_NATIVE_API_KEY } from '@env';

const SOCKET_URL = 'https://agritayo.azurewebsites.net';

// Styled components with NativeWind
const Container = styled(View, 'flex-1 bg-white p-4');
const ChatContainer = styled(View, 'flex-1');
const MessageInputContainer = styled(View, 'flex-row items-center border-t border-gray-200 p-2');
const Input = styled(TextInput, 'flex-1 border border-gray-300 rounded-lg p-2 bg-white text-black');
const SendButton = styled(TouchableOpacity, 'p-2 rounded-full bg-[#00B251] ml-2');
const IconButton = styled(TouchableOpacity, 'ml-2 p-2');
const ChatBubble = styled(View, 'p-3 m-1 rounded-lg max-w-full');
const ChatBubbleText = styled(Text, 'text-white text-sm');
const ChatImage = styled(Image, 'w-48 h-48 rounded-lg mt-2');
const ProfileImage = styled(Image, 'w-10 h-10 rounded-full mr-2');
const NameText = styled(Text, 'font-bold text-xs text-gray-600 mb-1');

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // For image viewer
  const socket = useRef(null);
  const { receiverId } = route.params;
  const userId = 1;

  // Ref for FlatList to scroll to the end
  const flatListRef = useRef(null);

  // State to track if the user is near the bottom
  const [isNearBottom, setIsNearBottom] = useState(true);

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.current.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);

      // Only scroll to the end if the user is already near the bottom
      if (isNearBottom) {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    });

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
            setMessages(allMessages);

            // Scroll to the end when messages are loaded initially
            flatListRef.current?.scrollToEnd({ animated: false });
          } else {
            console.error('Failed to fetch messages:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchMessages();

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
      formData.append('receiver_type', 'User');

      if (newImage) {
        const { uri } = newImage;
        const name = uri.split('/').pop();
        const type = 'image/jpeg';

        const file = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

        formData.append('image', {
          uri: `data:${type};base64,${file}`,
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
          body: formData,
        });

        if (response.ok) {
          const savedMessage = await response.json();
          setNewMessage('');
          setNewImage(null);

          // Scroll to the bottom after sending a message
          flatListRef.current?.scrollToEnd({ animated: true });
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
      setNewImage(selectedImage);
    }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setNewImage(selectedImage);
    }
  };

  const viewImage = (uri) => {
    setSelectedImage([{ uri }]);
    setIsImageViewerVisible(true);
  };

  // Handle the scroll event to detect if the user is near the bottom
  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;

    // Calculate if the user is near the bottom (within 50px from the bottom)
    const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;
    setIsNearBottom(isAtBottom);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container>
        <ChatContainer>
          <FlatList
            ref={flatListRef} // Attach ref to FlatList
            data={messages}
            renderItem={({ item }) => {
              const isSender = item.sender_id === userId;

              return (
                <View style={{ flexDirection: isSender ? 'row-reverse' : 'row', alignItems: 'center', marginVertical: 5 }}>
                  {!isSender && (
                    <ProfileImage source={{ uri: item.sender_profile_image_url || 'https://example.com/default-profile.png' }} />
                  )}
                  <View style={{ alignItems: isSender ? 'flex-end' : 'flex-start', flex: 1 }}>
                    {!isSender && <NameText>{item.sender_name || 'Unknown'}</NameText>}
                    {item.chat_message && (
                      <ChatBubble
                        style={{
                          backgroundColor: isSender ? '#00B251' : '#E5E5EA',
                          maxWidth: '100%', // Ensure the chat bubble can grow to full width
                          marginHorizontal: 10, // Padding to avoid edges
                        }}
                      >
                        <ChatBubbleText style={{ color: isSender ? 'white' : 'black' }}>
                          {item.chat_message}
                        </ChatBubbleText>
                      </ChatBubble>
                    )}
                    {item.chat_image_url && (
                      <TouchableOpacity onPress={() => viewImage(item.chat_image_url)}>
                        <ChatImage source={{ uri: item.chat_image_url }} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 1 }}
            onScroll={handleScroll} // Track user scroll
            onContentSizeChange={() => {
              if (isNearBottom) {
                flatListRef.current?.scrollToEnd({ animated: true });
              }
            }}
          />
        </ChatContainer>

        <MessageInputContainer>
          <IconButton onPress={openCamera}>
            <Icon name="camera-alt" size={24} color="#00B251" />
          </IconButton>
          <IconButton onPress={pickImage}>
            <Icon name="photo" size={24} color="#00B251" />
          </IconButton>
          <Input
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
          />
          <SendButton onPress={handleSendMessage}>
            <Icon name="send" size={24} color="white" />
          </SendButton>
        </MessageInputContainer>

        {selectedImage && (
          <ImageViewing
            images={selectedImage}
            imageIndex={0}
            visible={isImageViewerVisible}
            onRequestClose={() => setIsImageViewerVisible(false)}
          />
        )}
      </Container>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
