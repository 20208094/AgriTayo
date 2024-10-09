import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import io from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styled } from 'nativewind';
import ImageViewing from 'react-native-image-viewing';
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';
import moment from 'moment';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Styled components with NativeWind
const Container = styled(View, 'flex-1 bg-white p-4');
const ChatContainer = styled(View, 'flex-1');
const MessageInputContainer = styled(View, 'border-t border-gray-200 p-2 flex-row items-center');
const InputWrapper = styled(View, 'flex-row flex-1 items-center border border-gray-300 rounded-lg p-1 bg-white text-black');
const Input = styled(TextInput, 'flex-1 bg-white text-black p-2');
const SendButton = styled(TouchableOpacity, 'p-2 rounded-full bg-[#00B251] ml-2');
const IconButton = styled(TouchableOpacity, 'ml-1 p-2');
const ChatBubble = styled(View, 'p-3 m-1 rounded-lg max-w-full');
const ChatBubbleText = styled(Text, 'text-white text-sm');
const ChatImage = styled(Image, 'w-48 h-48 rounded-lg mt-2');
const ProfileImage = styled(Image, 'w-10 h-10 rounded-full mr-2');
const NameText = styled(Text, 'font-bold text-xs text-gray-600 mb-1');
const HeaderText = styled(Text, 'text-lg font-bold text-center text-gray-800 py-2 bg-gray-100');
const ImagePreview = styled(Image, 'w-16 h-16 rounded-lg mr-2');

function ChatScreen({ route }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [userData, setUserData] = useState(null);

  const socket = useRef(null);
  const { receiverId, receiverName, senderId, receiverType, senderType, receiverImage } = route.params;
  const userId = senderId;
  const flatListRef = useRef(null);

  // Fetch user data from AsyncStorage
  const getAsyncUserData = async () => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      } else {
        console.log('No user data found.');
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages from the server
  const fetchMessages = async () => {
    if (userId && receiverId) {
        console.log("User IDs:", userId, receiverId, senderType, receiverType);
        try {
            const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/chatsId/${userId}/${receiverId}/${receiverType}/${senderType}`, {
                headers: { "x-api-key": REACT_NATIVE_API_KEY },
            });

            if (response.ok) {
                // Parse the JSON response
                const allMessages = await response.json();

                // Sort messages based on chat_id in ascending order
                const sortedMessages = allMessages.sort((a, b) => {
                    return b.chat_id - a.chat_id; // Ascending order
                });

                // Update state with sorted messages
                setMessages(sortedMessages);
            } else {
                console.error("Failed to fetch messages:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }
};


  useFocusEffect(
    React.useCallback(() => {
      getAsyncUserData();
    }, [])
  );

  useEffect(() => {
    console.log('useEffect :', useEffect);
    if (userId) {
      console.log('userId :', userId);
      fetchMessages();
    }
  }, [userId, receiverId, receiverType, senderType]);

  useEffect(() => {
    const socket = io(REACT_NATIVE_API_BASE_URL, { transports: ['websocket'] });
    const receiverIdNum = Number(receiverId);
    socket.on("chat message", (msg) => {
      const isMessageForThisChat =
        (msg.sender_id === userId && msg.receiver_id === receiverIdNum && msg.receiver_type === receiverType && msg.sender_type === senderType) ||
        (msg.receiver_id === userId && msg.sender_id === receiverIdNum && msg.receiver_type === senderType && msg.sender_type === receiverType);

      // If the message belongs to the current chat, add it to the list
      if (isMessageForThisChat) {
        console.log('isMessageForThisChat :', isMessageForThisChat);
        setMessages((prevMessages) => [...prevMessages, msg]);
        fetchMessages();
      }
    });

    return () => {
      socket.off("chat message");
      socket.disconnect();
    };
  }, [userId, receiverId]);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Send message handler
  const handleSendMessage = async () => {
    if (newMessage.trim() || newImage) {
      console.log('receiverId :', receiverId);
      const formData = new FormData();
      formData.append('sender_id', userId);
      formData.append('receiver_id', receiverId.toString());
      formData.append('chat_message', newMessage);
      formData.append('receiver_type', receiverType);
      formData.append('sender_type', senderType);
      formData.append('sent_at', new Date().toISOString());

      if (newImage) {
        const { uri } = newImage;
        const name = uri.split('/').pop();
        const type = 'image/jpeg'; // Make sure to adjust the type based on your image

        formData.append('image', {
          uri,   // No Base64 encoding here
          type,
          name,
        });
      }

      try {
        const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/chats`, {
          method: 'POST',
          headers: { "x-api-key": REACT_NATIVE_API_KEY },  // No explicit Content-Type for FormData
          body: formData,
        });

        if (response.ok) {
          setNewMessage("");
          setNewImage(null);
        } else {
          console.error("Failed to send message:", response.statusText);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', 'Network request failed. Please check your connection.');
      }
    } else {
      Alert.alert('Error', 'Message or image is required.');
    }
  };


  // Image selection handlers
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewImage(result.assets[0]);
    }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewImage(result.assets[0]);
    }
  };

  const viewImage = (uri) => {
    setSelectedImage([{ uri }]);
    setIsImageViewerVisible(true);
  };

  const removeSelectedImage = () => {
    setNewImage(null);
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0 });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <HeaderText>{receiverName}</HeaderText>

      <Container>
        {loading && <ActivityIndicator size="large" color="#00B251" />}

        <ChatContainer>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => {
              const isSender = item.sender_id === userId;
              const senderName = isSender ? 'You' : receiverName;

              return (
                <View style={{ flexDirection: isSender ? 'row-reverse' : 'row', alignItems: 'center', marginVertical: 5 }}>
                  {!isSender && (
                    <ProfileImage source={{ uri: receiverImage || 'https://example.com/default-profile.png' }} />
                  )}
                  <View style={{ alignItems: isSender ? 'flex-end' : 'flex-start', flex: 1 }}>
                    {!isSender && <NameText>{senderName}</NameText>}
                    {item.chat_message && (
                      <ChatBubble style={{ backgroundColor: isSender ? '#00B251' : '#E5E5EA', maxWidth: '100%', marginHorizontal: 10 }}>
                        <ChatBubbleText style={{ color: isSender ? 'white' : 'black' }}>{item.chat_message}</ChatBubbleText>
                        <Text style={{ color: isSender ? 'white' : 'gray', fontSize: 10, marginTop: 5 }}>
                          {moment(item.sent_at).format('h:mm A')}
                        </Text>
                      </ChatBubble>
                    )}
                    {item.chat_image_url && (
                      <TouchableOpacity onPress={() => viewImage(item.chat_image_url)}>
                        <ChatImage source={{ uri: item.chat_image_url }} />
                        <Text style={{ color: isSender ? 'white' : 'gray', fontSize: 10, marginTop: 5 }}>
                          {moment(item.sent_at).format('h:mm A')}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 1 }}
            inverted
            windowSize={10}
            initialNumToRender={20}
          />
        </ChatContainer>

        <MessageInputContainer>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <IconButton onPress={openCamera}>
              <Icon name="camera-alt" size={24} color="#00B251" />
            </IconButton>
            <IconButton onPress={pickImage}>
              <Icon name="photo" size={24} color="#00B251" />
            </IconButton>
          </View>
          <InputWrapper>
            {newImage && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ImagePreview source={{ uri: newImage.uri }} />
                <TouchableOpacity onPress={removeSelectedImage}>
                  <Icon name="close" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}

            <Input
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              multiline
              accessibilityLabel="Message input field"
            />

            <SendButton onPress={handleSendMessage}>
              <Icon name="send" size={24} color="white" />
            </SendButton>
          </InputWrapper>
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
}

export default ChatScreen;
