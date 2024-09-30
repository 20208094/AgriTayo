import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Alert, ActivityIndicator, Keyboard } from 'react-native';
import io from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styled } from 'nativewind';
import ImageViewing from 'react-native-image-viewing';
import { REACT_NATIVE_API_KEY } from '@env';
import moment from 'moment'; // Make sure moment is installed

const SOCKET_URL = 'https://agritayo.azurewebsites.net';

// Styled components with NativeWind
const Container = styled(View, 'flex-1 bg-white p-4');
const ChatContainer = styled(View, 'flex-1');
const MessageInputContainer = styled(View, 'border-t border-gray-200 p-2 flex-row items-center');  // Adjusted flex-row to align icons properly
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

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const socket = useRef(null);
  const { receiverId, receiverName } = route.params;
  const userId = 1;

  // Ref for FlatList
  const flatListRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.current.on('chat message', (msg) => {
      setMessages((prevMessages) => [msg, ...prevMessages]);
    });

    const fetchMessages = async () => {
      if (userId && receiverId) {
        try {
          setLoading(true);
          const response = await fetch(`https://agritayo.azurewebsites.net/api/chats`, {
            headers: {
              'x-api-key': REACT_NATIVE_API_KEY,
            },
          });

          if (response.ok) {
            const allMessages = await response.json();
            setMessages(allMessages.reverse());
          } else {
            console.error('Failed to fetch messages:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      socket.current.disconnect();
    };
  }, [receiverId, userId]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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

        try {
          const file = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
          formData.append('image', {
            uri: `data:${type};base64,${file}`,
            type,
            name,
          });
        } catch (error) {
          console.error('Error reading image file:', error);
          Alert.alert('Error', 'Failed to upload image. Please try again.');
          return;
        }
      }

      try {
        const response = await fetch('https://agritayo.azurewebsites.net/api/chats', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'x-api-key': REACT_NATIVE_API_KEY,
          },
          body: formData,
        });

        if (response.ok) {
          const savedMessage = await response.json();
          setNewMessage('');
          setNewImage(null);
          setMessages((prevMessages) => [savedMessage, ...prevMessages]);
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
                    <ProfileImage source={{ uri: item.sender_profile_image_url || 'https://example.com/default-profile.png' }} />
                  )}
                  <View style={{ alignItems: isSender ? 'flex-end' : 'flex-start', flex: 1 }}>
                    {!isSender && <NameText>{senderName}</NameText>}
                    {item.chat_message && (
                      <ChatBubble style={{ backgroundColor: isSender ? '#00B251' : '#E5E5EA', maxWidth: '100%', marginHorizontal: 10 }}>
                        <ChatBubbleText style={{ color: isSender ? 'white' : 'black' }}>{item.chat_message}</ChatBubbleText>
                        {/* Adding the timestamp below the message */}
                        <Text style={{ color: isSender ? 'white' : 'gray', fontSize: 10, marginTop: 5 }}>
                          {moment(item.sent_at).format('h:mm A')}
                        </Text>
                      </ChatBubble>
                    )}
                    {item.chat_image_url && (
                      <TouchableOpacity onPress={() => viewImage(item.chat_image_url)}>
                        <ChatImage source={{ uri: item.chat_image_url }} />
                        {/* Adding the timestamp for image messages as well */}
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
          {/* Icon buttons for camera and image */}
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
              accessible
              accessibilityLabel="Message input field"
              multiline
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
};

export default ChatScreen;
