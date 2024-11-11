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
const Button1 = styled(TouchableOpacity, 'flex-1 py-3 rounded-lg');
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
  const [selectedSenderType, setSelectedSenderType] = useState('User');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const [allUsers, setAllUsers] = useState([]);
  const [allShops, setAllShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [shopData, setShopData] = useState(null);
  const [shopId, setShopId] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [senderType, setSenderType] = useState('User');

  const getAsyncUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');

      if (storedData) {
        const parsedData = JSON.parse(storedData);

        if (Array.isArray(parsedData)) {
          const user = parsedData[0];
          setUserData(user);
          setUserId(user.user_id);
          setSenderId(user.user_id);
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

  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('shopData');

      if (storedData) {
        const parsedData = JSON.parse(storedData);

        if (Array.isArray(parsedData)) {
          const shop = parsedData[0];
          setShopData(shop);
          setShopId(shop.shop_id);
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
      getAsyncShopData();
    }, [])
  );

  // Update the senderId and senderType based on user selection
  const handleSenderTypeChange = (type) => {
    setUsers(null);
    setAllUsers(null);
    setFilteredUsers(null);
    setShops(null);
    setAllShops(null);
    setFilteredShops(null);
    if (type === 'User') {
      setAllUsers(null);
      setFilteredUsers(null);
      setShops(null);
      setAllShops(null);
      setFilteredShops(null);
      setSenderId(userId);
      setSenderType('User');
      fetchChats();
    } else if (type === 'Shop') {
      setAllUsers(null);
      setFilteredUsers(null);
      setShops(null);
      setAllShops(null);
      setFilteredShops(null);
      setSenderId(shopId);
      setSenderType('Shop');
      fetchChats();
    } else {
      setSenderId(userId);
      setSenderType('User');
      fetchChats();
    }
  };

  // Fetch chat data whenever senderId or senderType changes
  useEffect(() => {
    if (senderId && senderType) {
      fetchChats();
    }
  }, [senderId, senderType]);

  const fetchChats = async () => {
    try {
      if (!senderId) return;

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
            chats.filter(chat => chat.sender_type === senderType)
              .map(chat => chat.sender_id === senderId && chat.sender_type === senderType && chat.receiver_type === 'User' ? chat.receiver_id : chat.sender_id)
          ));
          const chatUsers = uniqueUserIds.map(id => {
            const user = usersData.find(user => user.user_id === id);
            const lastChat = chats.find(chat =>
              (chat.sender_id === senderId && chat.sender_type === senderType && chat.receiver_id === id && chat.receiver_type === 'User') ||
              (chat.receiver_id === senderId && chat.receiver_type === senderType && chat.sender_id === id && chat.sender_type === 'User')
            );
            return {
              ...user,
              lastMessage: lastChat?.chat_message || 'No recent messages',
              time: lastChat ? new Date(lastChat.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
            };
          });

          const filteredChatUsers = chatUsers.filter(user => user.lastMessage !== 'No recent messages');

          const uniqueShopIds = Array.from(new Set(
            chats.filter(chat => chat.sender_type === senderType)
              .map(chat => chat.sender_id === senderId && chat.sender_type === senderType && chat.receiver_type === 'Shop' ? chat.receiver_id : chat.sender_id)
          ));
          const chatShops = uniqueShopIds.map(id => {
            const shop = shopsData.find(shop => shop.shop_id === id);
            const lastChat = chats.find(chat =>
              (chat.sender_id === senderId && chat.sender_type === senderType && chat.receiver_id === id && chat.receiver_type === 'Shop') ||
              (chat.receiver_id === senderId && chat.receiver_type === senderType && chat.sender_id === id && chat.sender_type === 'Shop')
            );
            return {
              ...shop,
              lastMessage: lastChat?.chat_message || 'No recent messages',
              time: lastChat ? new Date(lastChat.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
            };
          });

          const filteredChatShops = chatShops.filter(user => user.lastMessage !== 'No recent messages');


          setUsers(filteredChatUsers);
          setAllUsers(usersData);
          setFilteredUsers(filteredChatUsers);
          setShops(filteredChatShops);
          setAllShops(shopsData);
          setFilteredShops(filteredChatShops);
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
      }
    } else {
      setFilteredUsers(users);
      setFilteredShops(shops);
    }
  };

  const handleUserClick = (receiver_id, name, receiver_image) => {
    navigation.navigate('ChatScreen', {
      senderId: senderId,
      receiverId: receiver_id,
      receiverName: name,
      receiverType: selectedType,
      senderType: senderType,
      receiverImage: receiver_image,
    });
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSearchQuery('');

    // Set senderId based on the type of chat
    if (type === 'User') {
      setFilteredUsers(users);
    } else if (type === 'Shop') {
      setFilteredShops(shops);
    }
  };


  return (
    <>
      {shopData && (
        <View style={{ flexDirection: 'row' }}>
          <Button1
            onPress={() => handleSenderTypeChange('User')}
            className={senderType === 'User' ? 'bg-[#00B251]' : 'bg-gray-200'}
          >
            <ButtonText className={senderType === 'User' ? 'text-white' : 'text-[#00B251]'}>{'Chat as Buyer'}</ButtonText>
          </Button1>

          <Button1
            onPress={() => handleSenderTypeChange('Shop')}
            className={senderType === 'Shop' ? 'bg-[#00B251]' : 'bg-gray-200'}
          >
            <ButtonText className={senderType === 'Shop' ? 'text-white' : 'text-[#00B251]'}>{'Chat as Seller'}</ButtonText>
          </Button1>
        </View>
      )}
      <Container>

        <Header>
          <Title>
            {selectedType === 'User'
              ? 'User Chats'
              : selectedType === 'Shop'
                ? 'Shop Chats'
                : null
            }
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
            className={selectedType === 'User' ? 'bg-[#00B251]' : 'bg-gray-200'}
          >
            <ButtonText className={selectedType === 'User' ? 'text-white' : 'text-[#00B251]'}>{'User Chats'}</ButtonText>
          </Button>
          <Button
            onPress={() => handleTypeChange('Shop')}
            className={selectedType === 'Shop' ? 'bg-[#00B251]' : 'bg-gray-200'}
          >
            <ButtonText className={selectedType === 'Shop' ? 'text-white' : 'text-[#00B251]'}>{'Shop Chats'}</ButtonText>
          </Button>

        </View>

        <FlatList
          data={selectedType === 'User' ? filteredUsers : filteredShops}
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
              <TimeText>{item.time || ''}</TimeText>
            </UserItem>
          )}
          keyExtractor={(item) => {
            // If the item has a `user_id`, use it as a key
            if (item.user_id) {
              return `user-${item.user_id}`;
            }
            // If the item has a `shop_id`, use it as a key
            if (item.shop_id) {
              return `shop-${item.shop_id}`;
            }
            // Fallback in case there's no `user_id` or `shop_id` (this should rarely be the case)
            return `item-${Math.random().toString(36).substr(2, 9)}`;
          }}

        />
      </Container>
    </>
  );
};

export default ChatListScreen;

