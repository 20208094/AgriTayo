import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { REACT_NATIVE_API_KEY } from '@env';
import { styled } from 'nativewind';

const API_URL = 'https://agritayo.azurewebsites.net/api/chats';

// Styled components using NativeWind
const Container = styled(View, 'flex-1 p-4 bg-white');
const Header = styled(View, 'flex-row items-center justify-between mb-4');
const Title = styled(Text, 'text-xl font-bold text-[#00B251]');
const ErrorText = styled(Text, 'text-red-500 mb-4');
const UserItem = styled(TouchableOpacity, 'flex-row items-center p-4 bg-white border-b border-gray-200');
const UserName = styled(Text, 'text-lg font-semibold text-black');
const LastMessage = styled(Text, 'text-sm text-gray-500');
const Avatar = styled(Image, 'w-12 h-12 rounded-full bg-gray-200 mr-4');
const TimeText = styled(Text, 'text-xs text-gray-400 ml-auto');
const SearchInput = styled(TextInput, 'bg-gray-100 ml-5 rounded-full p-2 flex-1 text-gray-700 text-sm');

const ChatListScreen = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const userId = 1; // Default user ID

  const fetchChats = async () => {
    try {
      const chatResponse = await fetch(API_URL, {
        headers: { 'x-api-key': REACT_NATIVE_API_KEY },
      });

      if (chatResponse.ok) {
        const chats = await chatResponse.json();

        // Sort chats by sent_at to ensure the latest message is displayed
        chats.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));

        // Group chats by unique user and keep only the latest message
        const chatMap = new Map();
        chats.forEach(chat => {
          const otherUserId = chat.sender_id === userId ? chat.receiver_id : chat.sender_id;
          if (!chatMap.has(otherUserId)) {
            chatMap.set(otherUserId, chat);
          }
        });

        // Prepare user data with the latest message and formatted timestamp
        const uniqueUsers = Array.from(chatMap.entries()).map(([id, latestChat]) => {
          const chatDate = new Date(latestChat.sent_at);

          const formattedTime = !isNaN(chatDate.getTime())
            ? chatDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Unknown Time';  // Adjust if timestamp is invalid

          return {
            id,
            name: `User ${id}`, // Replace with actual name if available
            avatar: 'https://example.com/default-avatar.png', // Placeholder avatar
            lastMessage: latestChat.chat_message || 'Image',
            time: formattedTime,
          };
        });

        setUsers(uniqueUsers);
        setFilteredUsers(uniqueUsers); // Initialize filteredUsers with full list
      } else {
        setError('Failed to fetch chats. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  // Use useFocusEffect to refresh chats when the screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [])
  );

  // Handle search query changes and filter the chat list
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // Reset to full list if search is cleared
    }
  };

  const handleUserClick = (receiverId, receiverName) => {
    navigation.navigate('ChatScreen', { receiverId, receiverName });
  };

  return (
    <Container>
      {/* Header with title and search input */}
      <Header>
        <Title>Your Chats</Title>
        <SearchInput
          placeholder="Search by name"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </Header>

      {error && <ErrorText>{error}</ErrorText>}

      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => (
          <UserItem onPress={() => handleUserClick(item.id, item.name)}>
            <Avatar source={{ uri: item.avatar }} />
            <View style={{ flex: 1 }}>
              <UserName>{item.name}</UserName>
              <LastMessage>{item.lastMessage}</LastMessage>
            </View>
            <TimeText>{item.time}</TimeText>
          </UserItem>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </Container>
  );
};

export default ChatListScreen;
