import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { REACT_NATIVE_API_KEY } from '@env';
import { styled } from 'nativewind';

const API_URL = 'https://agritayo.azurewebsites.net/api/chats';

// Styled components using NativeWind
const Container = styled(View, 'flex-1 p-4 bg-white');
const Title = styled(Text, 'text-xl font-bold mb-4 text-[#00B251]');
const ErrorText = styled(Text, 'text-red-500 mb-4');
const UserItem = styled(TouchableOpacity, 'flex-row items-center p-4 bg-white border-b border-gray-200');
const UserName = styled(Text, 'text-lg font-semibold text-black');
const LastMessage = styled(Text, 'text-sm text-gray-500');
const Avatar = styled(Image, 'w-12 h-12 rounded-full bg-gray-200 mr-4');
const TimeText = styled(Text, 'text-xs text-gray-400 ml-auto');

const ChatListScreen = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const userId = 1; // Default user ID

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatResponse = await fetch(API_URL, {
          headers: { 'x-api-key': REACT_NATIVE_API_KEY },
        });

        if (chatResponse.ok) {
          const chats = await chatResponse.json();
          
          // Extract unique users and simulate last message and time
          const uniqueUsers = Array.from(new Set(
            chats.map(chat => chat.sender_id === userId ? chat.receiver_id : chat.sender_id)
          )).map(id => ({
            id,
            name: `User ${id}`, // Replace with actual names
            avatar: 'https://example.com/default-avatar.png', // Placeholder avatar
            lastMessage: 'Last message content here', // Placeholder message
            time: '2h ago', // Placeholder time
          }));

          setUsers(uniqueUsers);
        } else {
          setError('Failed to fetch chats. Please try again.');
        }
      } catch (error) {
        setError('Network error. Please try again.');
      }
    };

    fetchChats();
  }, []);

  const handleUserClick = (receiverId) => {
    navigation.navigate('ChatScreen', { receiverId });
  };

  return (
    <Container>
      <Title>Your Chats</Title>
      {error && <ErrorText>{error}</ErrorText>}
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <UserItem onPress={() => handleUserClick(item.id)}>
            {/* User Avatar */}
            <Avatar source={{ uri: item.avatar }} />

            <View style={{ flex: 1 }}>
              {/* User Name */}
              <UserName>{item.name}</UserName>
              {/* Last Message */}
              <LastMessage>{item.lastMessage}</LastMessage>
            </View>

            {/* Timestamp */}
            <TimeText>{item.time}</TimeText>
          </UserItem>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </Container>
  );
};

export default ChatListScreen;
