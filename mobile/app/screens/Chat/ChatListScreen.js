import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { REACT_NATIVE_API_KEY } from '@env';
import { styled } from 'nativewind';

const API_URL_CHATS = 'https://agritayo.azurewebsites.net/api/chats';
const API_URL_USERS = 'https://agritayo.azurewebsites.net/api/users';
const API_URL_SHOPS = 'https://agritayo.azurewebsites.net/api/shops';

const Container = styled(View, 'flex-1 p-4 bg-white');
const Header = styled(View, 'flex-row items-center justify-between mb-4');
const Title = styled(Text, 'text-xl font-bold text-[#00B251]');
const ErrorText = styled(Text, 'text-red-500 mb-4');
const UserItem = styled(TouchableOpacity, 'flex-row items-center p-4 bg-white border-b border-gray-200');
const UserName = styled(Text, 'text-lg font-semibold text-[#00B251]');
const LastMessage = styled(Text, 'text-sm text-gray-500');
const Avatar = styled(Image, 'w-12 h-12 rounded-full bg-gray-200 mr-4');
const TimeText = styled(Text, 'text-xs text-gray-400 ml-auto');
const SearchInput = styled(TextInput, 'bg-gray-100 ml-5 rounded-full p-2 flex-1 text-gray-700 text-sm');

// New Button design with shadow, gradient, and enhanced aesthetics
const Button = styled(TouchableOpacity, 'flex-1 py-3 rounded-full mx-2 shadow-md');
const ButtonText = styled(Text, 'text-center font-semibold text-base text-[#00B251]');

// Main Component
const ChatListScreen = () => {
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('User');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const userId = 1;
  const [allUsers, setAllUsers] = useState([]);
  const [allShops, setAllShops] = useState([]);

  const fetchChats = async () => {
    try {
      const chatResponse = await fetch(API_URL_CHATS, {
        headers: { 'x-api-key': REACT_NATIVE_API_KEY },
      });

      if (chatResponse.ok) {
        const chats = await chatResponse.json();

        chats.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));

        const userResponse = await fetch(API_URL_USERS, {
          headers: { 'x-api-key': REACT_NATIVE_API_KEY },
        });
        const shopResponse = await fetch(API_URL_SHOPS, {
          headers: { 'x-api-key': REACT_NATIVE_API_KEY },
        });

        if (userResponse.ok && shopResponse.ok) {
          const usersData = await userResponse.json();
          const shopsData = await shopResponse.json();

          const uniqueUserIds = Array.from(new Set(
            chats.filter(chat => chat.sender_type === 'User' || chat.receiver_type === 'User')
              .map(chat => chat.sender_id === userId ? chat.receiver_id : chat.sender_id)
          ));
          const chatUsers = uniqueUserIds.map(id => {
            const user = usersData.find(user => user.user_id === id);
            const lastChat = chats.find(chat =>
              (chat.sender_id === userId && chat.receiver_id === id) ||
              (chat.receiver_id === userId && chat.sender_id === id)
            );
            return {
              ...user,
              lastMessage: lastChat?.chat_message || 'No recent messages',
              time: lastChat ? new Date(lastChat.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown Time'
            };
          });

          const uniqueShopIds = Array.from(new Set(
            chats.filter(chat => chat.sender_type === 'Shop' || chat.receiver_type === 'Shop')
              .map(chat => chat.sender_id === userId ? chat.receiver_id : chat.sender_id)
          ));
          const chatShops = uniqueShopIds.map(id => {
            const shop = shopsData.find(shop => shop.shop_id === id);
            const lastChat = chats.find(chat =>
              (chat.sender_id === userId && chat.receiver_id === id) ||
              (chat.receiver_id === userId && chat.sender_id === id)
            );
            return {
              ...shop,
              lastMessage: lastChat?.chat_message || 'No recent messages',
              time: lastChat ? new Date(lastChat.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown Time'
            };
          });

          setUsers(chatUsers);
          setAllUsers(usersData);
          setFilteredUsers(chatUsers);
          setShops(chatShops);
          setAllShops(shopsData);
          setFilteredShops(chatShops);
        } else {
          setError('Failed to fetch user/shop data.');
        }
      } else {
        setError('Failed to fetch chats.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      if (selectedType === 'User') {
        const filtered = allUsers.filter(user => user?.firstname?.toLowerCase().includes(lowerCaseQuery));
        setFilteredUsers(filtered);
      } else {
        const filtered = allShops.filter(shop => shop?.shop_name?.toLowerCase().includes(lowerCaseQuery));
        setFilteredShops(filtered);
      }
    } else {
      setFilteredUsers(users);
      setFilteredShops(shops);
    }
  };

  const handleUserClick = (id, name) => {
    navigation.navigate('ChatScreen', { receiverId: id, receiverName: name, type: selectedType });
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSearchQuery('');
    setFilteredUsers(users);
    setFilteredShops(shops);
  };

  return (
    <Container>
      <Header>
        <Title>{selectedType === 'User' ? 'User Chats' : 'Shop Chats'}</Title>
        <SearchInput
          placeholder={`Search ${selectedType === 'User' ? 'users' : 'shops'} by name`}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </Header>

      {error && <ErrorText>{error}</ErrorText>}

      <View style={{ flexDirection: 'row', marginBottom: 10, justifyContent: 'space-around' }}>
        <Button
          onPress={() => handleTypeChange('User')}
          style={selectedType === 'User' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-200'}
        >
          <ButtonText style={selectedType === 'User' ? 'text-white' : 'text-gray-700'}>{'Users Chats'}</ButtonText>
        </Button>
        <Button
          onPress={() => handleTypeChange('Shop')}
          style={selectedType === 'Shop' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-200'}
        >
          <ButtonText style={selectedType === 'Shop' ? 'text-white' : 'text-gray-700'}>{'Shops Chats'}</ButtonText>
        </Button>
      </View>

      <FlatList
        data={selectedType === 'User' ? filteredUsers : filteredShops}
        renderItem={({ item }) => (
          <UserItem onPress={() => handleUserClick(item.user_id || item.shop_id, item.firstname || item.shop_name)}>
            <Avatar source={{ uri: item.user_image_url || item.shop_image_url || 'https://example.com/default-avatar.png' }} />
            <View style={{ flex: 1 }}>
              <UserName>{item.firstname || item.shop_name}</UserName>
              <LastMessage>{item.lastMessage || 'No recent messages'}</LastMessage>
            </View>
            <TimeText>{item.time || 'Unknown time'}</TimeText>
          </UserItem>
        )}
        keyExtractor={(item, index) => {
          if (item.user_id) {
            return `user-${item.user_id}`;
          } else if (item.shop_id) {
            return `shop-${item.shop_id}`;
          } else {
            return `item-${index}`;
          }
        }}
      />
    </Container>
  );
};

export default ChatListScreen;
