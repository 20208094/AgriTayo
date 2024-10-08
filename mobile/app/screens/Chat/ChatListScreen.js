import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from 'nativewind';
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';

const API_URL_CHATS = `${REACT_NATIVE_API_BASE_URL}/api/chats`;
const API_URL_USERS = `${REACT_NATIVE_API_BASE_URL}/api/users`;
const API_URL_SHOPS = `${REACT_NATIVE_API_BASE_URL}/api/shops`;

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

// Button component for switching between chat views
const Button1 = styled(TouchableOpacity, 'flex-1 py-3 rounded-full mx-2');
const Button = styled(TouchableOpacity, 'flex-1 py-3 rounded-full mx-2 shadow-sm');
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
  const [allUsers, setAllUsers] = useState([]);
  const [allShops, setAllShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);

  const getAsyncUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');

      if (storedData) {
        const parsedData = JSON.parse(storedData);

        if (Array.isArray(parsedData)) {
          const user = parsedData[0];
          setUserData(user);
          setUserId(user.user_id);
        } else {
          setUserData(parsedData);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAsyncUserData();
    }, [])
  );

  const fetchChats = async () => {
    try {
      if (!userId) return;

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
              (chat.sender_id === userId && chat.receiver_id === id && chat.receiver_type === 'User') ||
              (chat.receiver_id === userId && chat.sender_id === id && chat.receiver_type === 'User')
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
              (chat.sender_id === userId && chat.receiver_id === id && chat.receiver_type === 'Shop') ||
              (chat.receiver_id === userId && chat.sender_id === id && chat.receiver_type === 'Shop')
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
      if (userId) {
        fetchChats();
      }
    }, [userId])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      if (selectedType === 'User') {
        const filtered = allUsers.filter(user => user?.firstname?.toLowerCase().includes(lowerCaseQuery));
        setFilteredUsers(filtered);
      } else if (selectedType === 'Shop') {
        const filtered = allShops.filter(shop => shop?.shop_name?.toLowerCase().includes(lowerCaseQuery));
        setFilteredShops(filtered);
      } else if (selectedType === 'Seller') {
        const filtered = allUsers.filter(user => user.user_type_id === 2 && user?.firstname?.toLowerCase().includes(lowerCaseQuery));
        setFilteredUsers(filtered);
      } else if (selectedType === 'Buyer') {
        const filtered = allUsers.filter(user => user.user_type_id === 3 && user?.firstname?.toLowerCase().includes(lowerCaseQuery));
        setFilteredUsers(filtered);
      }
    } else {
      setFilteredUsers(users);
      setFilteredShops(shops);
    }
  };

  const handleUserClick = (receiver_id, name, receiver_image) => {
    navigation.navigate('ChatScreen', {
      senderId: userId,
      receiverId: receiver_id,
      receiverName: name,
      receiverType: selectedType,
      receiverImage: receiver_image,
    });
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSearchQuery('');

    if (type === 'User') {
      setFilteredUsers(users);
    } else if (type === 'Shop') {
      setFilteredShops(shops);
    } else if (type === 'Seller') {
      const filteredSellers = allUsers.filter(user => user.user_type_id === 2);
      setFilteredUsers(filteredSellers);
    } else if (type === 'Buyer') {
      const filteredBuyers = allUsers.filter(user => user.user_type_id === 3);
      setFilteredUsers(filteredBuyers);
    }
  };

  return (
    <Container>
      <View style={{ flexDirection: 'row', marginBottom: 10, justifyContent: 'space-around'}}>
        <Button1
          onPress={() => handleTypeChange('Seller')}
          style={selectedType === 'Seller' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-200'}
        >
          <ButtonText style={selectedType === 'Seller' ? 'text-white' : 'text-gray-700'}>{'Sellers Chats'}</ButtonText>
        </Button1>

        <Text style={{ marginHorizontal: 10, fontSize: 30, color: '#00B251' }}>|</Text>

        <Button1
          onPress={() => handleTypeChange('Buyer')}
          style={selectedType === 'Buyer' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-200'}
        >
          <ButtonText style={selectedType === 'Buyer' ? 'text-white' : 'text-gray-700'}>{'Buyers Chats'}</ButtonText>
        </Button1>

      </View>
      <Header>
        <Title>
          {selectedType === 'User'
            ? 'User Chats'
            : selectedType === 'Shop'
              ? 'Shop Chats'
              : selectedType === 'Seller'
                ? 'Seller Chats'
                : 'Buyer Chats'}
        </Title>
        <SearchInput
          placeholder={`Search ${selectedType === 'User' ? 'users' : selectedType === 'Shop' ? 'shops' : selectedType === 'Seller' ? 'sellers' : 'buyers'} by name`}
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
        data={selectedType === 'User' || selectedType === 'Seller' || selectedType === 'Buyer' ? filteredUsers : filteredShops}
        renderItem={({ item }) => (
          <UserItem
            onPress={() =>
              handleUserClick(item.shop_id || item.user_id, item.firstname || item.shop_name, item.user_image_url || item.shop_image_url)
            }
          >
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

