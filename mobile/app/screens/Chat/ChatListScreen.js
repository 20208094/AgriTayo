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
  const [selectedRole, setSelectedRole] = useState(null); // Added for role-based filtering (Seller/Buyer)
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
        const parsedData = JSON.parse(storedData); // Parse storedData

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
      const filtered = allUsers.filter(user => 
        user?.firstname?.toLowerCase().includes(lowerCaseQuery) && 
        (!selectedRole || user.user_type_id === selectedRole)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
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
    setFilteredUsers(users);
    setFilteredShops(shops);
  };

  // New function to handle role change between seller and buyer
  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId); // 2 = Seller, 3 = Buyer
    const filtered = allUsers.filter(user => user.user_type_id === roleId);
    setFilteredUsers(filtered);
  };

  return (
    <Container>
            {/* New Seller/Buyer buttons */}
            <View style={{ flexDirection: 'row', marginBottom: 10, justifyContent: 'space-around' }}>
        {userData && (
          <>
            <Button
              onPress={() => handleRoleChange(2)} // Seller
              style={selectedRole === 2 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-200'}
            >
              <ButtonText>{`Chat as Seller`}</ButtonText>
            </Button>
            <Button
              onPress={() => handleRoleChange(3)} // Buyer
              style={selectedRole === 3 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-200'}
            >
              <ButtonText>{`Chat as Buyer`}</ButtonText>
            </Button>
          </>
        )}
      </View>

      <Header>
        <Title>{selectedType === 'User' ? 'User Chats' : 'Shop Chats' }</Title>
        <SearchInput
          placeholder={`Search ${selectedType === 'User' ? 'users' : 'shops'} by name`}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </Header>

      {error && <ErrorText>{error}</ErrorText>}



      {/* Existing Buttons for User Chats and Shop Chats */}
      <View style={{ flexDirection: 'row', marginBottom: 10, justifyContent: 'space-around' }}>
        <Button
          onPress={() => handleTypeChange('User')}
          style={selectedType === 'User' ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-200'}
        >
          <ButtonText>User Chats</ButtonText>
        </Button>
        <Button
          onPress={() => handleTypeChange('Shop')}
          style={selectedType === 'Shop' ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-200'}
        >
          <ButtonText>Shop Chats</ButtonText>
        </Button>
      </View>

      {/* Chat List */}
      <FlatList
        data={selectedType === 'User' ? filteredUsers : filteredShops}
        keyExtractor={item => item.user_id?.toString() || item.shop_id?.toString()}
        renderItem={({ item }) => (
          <UserItem onPress={() => handleUserClick(item.user_id || item.shop_id, item.firstname || item.shop_name, item.user_image_url || item.shop_image_url)}>
            <Avatar source={{ uri: item.user_image_url || item.shop_image_url }} />
            <View>
              <UserName>{item.firstname || item.shop_name}</UserName>
              <LastMessage>{item.lastMessage}</LastMessage>
            </View>
            <TimeText>{item.time}</TimeText>
          </UserItem>
        )}
      />
    </Container>
  );
};

export default ChatListScreen;
