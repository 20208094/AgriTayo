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

      setError('');

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

          // Get relevant chats for the current sender
          const relevantChats = chats.filter(chat => 
            (chat.sender_id === senderId && chat.sender_type === senderType) ||
            (chat.receiver_id === senderId && chat.receiver_type === senderType)
          );

          if (senderType === 'Shop') {
            // For Chat as Seller mode
            // Filter buyers (user_type_id === 3) for User Chats
            const buyerChats = relevantChats.filter(chat => 
              chat.sender_type === 'User' || chat.receiver_type === 'User'
            );

            const uniqueBuyerIds = [...new Set(buyerChats.map(chat => 
              chat.sender_id === senderId ? chat.receiver_id : chat.sender_id
            ))];

            const filteredBuyers = usersData
              .filter(user => user.user_type_id === 3) // Only buyers
              .filter(user => uniqueBuyerIds.includes(user.user_id))
              .map(user => {
                const lastChat = buyerChats.find(chat =>
                  (chat.sender_id === user.user_id || chat.receiver_id === user.user_id)
                );
                
                if (!lastChat) return null;

                return {
                  ...user,
                  lastMessage: lastChat.chat_message,
                  time: new Date(lastChat.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
              })
              .filter(Boolean);

            // For Shop Chats in seller mode
            const shopChats = relevantChats.filter(chat => 
              chat.sender_type === 'Shop' || chat.receiver_type === 'Shop'
            );

            const uniqueShopIds = [...new Set(shopChats.map(chat => 
              chat.sender_id === senderId ? chat.receiver_id : chat.sender_id
            ))];

            const filteredShops = shopsData
              .filter(shop => uniqueShopIds.includes(shop.shop_id))
              .map(shop => {
                const lastChat = shopChats.find(chat =>
                  (chat.sender_id === shop.shop_id || chat.receiver_id === shop.shop_id)
                );
                
                if (!lastChat) return null;

                return {
                  ...shop,
                  lastMessage: lastChat.chat_message,
                  time: new Date(lastChat.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
              })
              .filter(Boolean);

            setUsers(filteredBuyers);
            setAllUsers(usersData.filter(user => user.user_type_id === 3)); // Only buyers in allUsers
            setFilteredUsers(filteredBuyers);
            setShops(filteredShops);
            setAllShops(shopsData);
            setFilteredShops(filteredShops);
          } else {
            // For Chat as Buyer mode - keep existing logic
            const uniqueUserIds = [...new Set(relevantChats.map(chat => 
              chat.sender_id === senderId ? chat.receiver_id : chat.sender_id
            ))];

            const filteredUsers = usersData
              .filter(user => user.user_type_id === 1) // Only admins for buyer mode
              .filter(user => uniqueUserIds.includes(user.user_id))
              .map(user => {
                const lastChat = relevantChats.find(chat =>
                  (chat.sender_id === user.user_id || chat.receiver_id === user.user_id)
                );
                
                if (!lastChat) return null;

                return {
                  ...user,
                  lastMessage: lastChat.chat_message,
                  time: new Date(lastChat.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
              })
              .filter(Boolean);

            const uniqueShopIds = [...new Set(relevantChats.map(chat => 
              chat.sender_id === senderId ? chat.receiver_id : chat.sender_id
            ))];

            const filteredShops = shopsData
              .filter(shop => uniqueShopIds.includes(shop.shop_id))
              .map(shop => {
                const lastChat = relevantChats.find(chat =>
                  (chat.sender_id === shop.shop_id || chat.receiver_id === shop.shop_id)
                );
                
                if (!lastChat) return null;

                return {
                  ...shop,
                  lastMessage: lastChat.chat_message,
                  time: new Date(lastChat.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
              })
              .filter(Boolean);

            setUsers(filteredUsers);
            setAllUsers(usersData.filter(user => user.user_type_id === 1)); // Only admins in allUsers
            setFilteredUsers(filteredUsers);
            setShops(filteredShops);
            setAllShops(shopsData);
            setFilteredShops(filteredShops);
          }
        } else {
          console.error('Failed to fetch users/shops:', userResponse.status, shopResponse.status);
          setError('Failed to fetch user/shop data.');
        }
      } else {
        console.error('Failed to fetch chats:', chatResponse.status);
        setError('Failed to fetch chats.');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please try again.');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      if (selectedType === 'User') {
        // Filter users based on sender type (admin for buyer mode, buyers for seller mode)
        const filtered = allUsers
          .filter(user => senderType === 'User' ? user?.user_type_id === 1 : user?.user_type_id === 3)
          .filter(user => user?.firstname?.toLowerCase().includes(lowerCaseQuery))
          .map(user => {
            // Find existing chat data to preserve last message
            const existingUserChat = users?.find(u => u.user_id === user.user_id);
            if (existingUserChat) {
              return {
                ...user,
                lastMessage: existingUserChat.lastMessage,
                time: existingUserChat.time
              };
            }
            return {
              ...user,
              lastMessage: 'No recent messages',
              time: null
            };
          });
        setFilteredUsers(filtered);
      } else if (selectedType === 'Shop') {
        const filtered = allShops
          .filter(shop => shop?.shop_name?.toLowerCase().includes(lowerCaseQuery))
          .map(shop => {
            // Find existing chat data to preserve last message
            const existingShopChat = shops?.find(s => s.shop_id === shop.shop_id);
            if (existingShopChat) {
              return {
                ...shop,
                lastMessage: existingShopChat.lastMessage,
                time: existingShopChat.time
              };
            }
            return {
              ...shop,
              lastMessage: 'No recent messages',
              time: null
            };
          });
        setFilteredShops(filtered);
      }
    } else {
      // When search query is empty, restore original lists
      setFilteredUsers(users || []);
      setFilteredShops(shops || []);
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
              ? senderType === 'User' ? 'Admin Chats' : 'User Chats'
              : selectedType === 'Shop'
                ? 'Shop Chats'
                : null
            }
          </Title>
          <SearchInput
            placeholder={`Search ${
              selectedType === 'User'
                ? senderType === 'User' 
                  ? 'admin'
                  : 'users'
                : selectedType === 'Shop'
                  ? 'shops'
                  : ''
            } by name`}
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
            <ButtonText className={selectedType === 'User' ? 'text-white' : 'text-[#00B251]'}>
              {senderType === 'User' ? 'Admin Chats' : 'User Chats'}
            </ButtonText>
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
          keyExtractor={(item, index) => {
            if (selectedType === 'User') {
              return `user-${item.user_id}-${index}-${Date.now()}`;
            } else {
              return `shop-${item.shop_id}-${index}-${Date.now()}`;
            }
          }}
        />
      </Container>
    </>
  );
};

export default ChatListScreen;

