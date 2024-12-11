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
  const [isSearching, setIsSearching] = useState(false);

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

  // Modify the useEffect for fetching to respect search state
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (senderId && senderType && !isSearching) {
        fetchChats();
      }
    }, 1000); // Fetch every 5 seconds

    return () => clearInterval(intervalId);
  }, [senderId, senderType, isSearching]);

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

          // Filter unique user IDs based on chat history
          const uniqueUserIds = Array.from(new Set(
            chats.filter(chat => 
              (chat.sender_id === senderId && chat.sender_type === senderType) ||
              (chat.receiver_id === senderId && chat.receiver_type === senderType)
            ).map(chat => 
              chat.sender_id === senderId ? chat.receiver_id : chat.sender_id
            )
          ));

          // Map users based on mode
          const chatUsers = uniqueUserIds.map(id => {
            const user = usersData.find(user => user.user_id === id);
            
            // Skip if in buyer mode and user is not admin
            if (senderType === 'User' && (!user || user.user_type_id !== 1)) {
              return null;
            }

            // Skip if in seller mode and user is admin
            if (senderType === 'Shop' && user?.user_type_id === 1) {
              return null;
            }

            const lastChat = chats.find(chat =>
              (chat.sender_id === senderId && chat.receiver_id === id) ||
              (chat.receiver_id === senderId && chat.sender_id === id)
            );

            if (!lastChat) return null;

            return user ? {
              ...user,
              lastMessage: lastChat.chat_message,
              time: new Date(lastChat.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            } : null;
          }).filter(Boolean);

          // Set users based on mode
          if (senderType === 'User') {
            // For Chat as Buyer: only show admins with chat history
            const adminUsers = chatUsers.filter(user => user.user_type_id === 1);
            setUsers(adminUsers);
            setAllUsers(usersData.filter(user => user.user_type_id === 1));
            setFilteredUsers(adminUsers);
          } else {
            // For Chat as Seller: show only users with chat history
            const regularUsers = chatUsers.filter(user => user.user_type_id !== 1);
            setUsers(regularUsers);
            setAllUsers(usersData.filter(user => user.user_type_id !== 1));
            setFilteredUsers(regularUsers);
          }

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
    setIsSearching(true);
    const lowerCaseQuery = query.toLowerCase();

    if (selectedType === 'User') {
      if (senderType === 'User') {
        // For Chat as Buyer: search within admin users
        const adminUsers = allUsers?.filter(user => user?.user_type_id === 1) || [];
        const filtered = adminUsers.filter(user => {
          const firstNameMatch = user?.firstname?.toLowerCase().includes(lowerCaseQuery);
          const lastNameMatch = user?.lastname?.toLowerCase().includes(lowerCaseQuery);
          return (firstNameMatch || lastNameMatch) && user?.user_id;
        }).map(user => {
          // Find the matching user from users array to get the lastMessage
          const userWithChat = users.find(u => u.user_id === user.user_id);
          return {
            ...user,
            lastMessage: userWithChat?.lastMessage || 'No recent messages',
            time: userWithChat?.time || ''
          };
        });
        setFilteredUsers(filtered);
      } else {
        // For Chat as Seller: search within regular users
        const regularUsers = allUsers?.filter(user => user?.user_type_id !== 1) || [];
        const filtered = regularUsers.filter(user => {
          const firstNameMatch = user?.firstname?.toLowerCase().includes(lowerCaseQuery);
          const lastNameMatch = user?.lastname?.toLowerCase().includes(lowerCaseQuery);
          return (firstNameMatch || lastNameMatch) && user?.user_id;
        }).map(user => {
          // Find the matching user from users array to get the lastMessage
          const userWithChat = users.find(u => u.user_id === user.user_id);
          return {
            ...user,
            lastMessage: userWithChat?.lastMessage || 'No recent messages',
            time: userWithChat?.time || ''
          };
        });
        setFilteredUsers(filtered);
      }
    } else if (selectedType === 'Shop') {
      // Search within shops
      const filtered = allShops?.filter(shop => 
        shop?.shop_name?.toLowerCase().includes(lowerCaseQuery) &&
        shop?.shop_id
      ).map(shop => {
        // Find the matching shop from shops array to get the lastMessage
        const shopWithChat = shops.find(s => s.shop_id === shop.shop_id);
        return {
          ...shop,
          lastMessage: shopWithChat?.lastMessage || 'No recent messages',
          time: shopWithChat?.time || ''
        };
      }) || [];
      setFilteredShops(filtered);
    }

    // If search query is empty, restore original filtered lists and resume fetching
    if (!query) {
      setIsSearching(false);
      if (selectedType === 'User') {
        if (senderType === 'User') {
          // For Chat as Buyer: show only admins with chat history
          const adminChats = users?.filter(user => 
            user?.user_type_id === 1 && 
            user?.lastMessage !== 'No recent messages'
          ) || [];
          setFilteredUsers(adminChats);
        } else {
          // For Chat as Seller: show only users with chat history
          const usersWithChats = users?.filter(user => 
            user?.user_type_id !== 1 && 
            user?.lastMessage !== 'No recent messages'
          ) || [];
          setFilteredUsers(usersWithChats);
        }
      } else {
        setFilteredShops(shops?.filter(shop => 
          shop?.lastMessage !== 'No recent messages'
        ) || []);
      }
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

  // Add cleanup for search state when changing types
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSearchQuery('');
    setIsSearching(false);

    if (type === 'User') {
      if (senderType === 'User') {
        // For Chat as Buyer: show only admins with chat history
        const adminUsers = users?.filter(user => 
          user?.user_type_id === 1 &&
          user?.lastMessage
        );
        setFilteredUsers(adminUsers || []);
      } else {
        // For Chat as Seller: show only users with actual chat history
        const usersWithChats = users?.filter(user => 
          user?.user_type_id !== 1 && 
          user?.lastMessage
        );
        setFilteredUsers(usersWithChats || []);
      }
    } else if (type === 'Shop') {
      setFilteredShops(shops?.filter(shop => shop?.shop_id) || []);
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
            {senderType === 'User' 
              ? (selectedType === 'User' ? 'Admin Chats' : 'Shop Chats')
              : (selectedType === 'User' ? 'User Chats' : 'Shop Chats')
            }
          </Title>
          <SearchInput
            placeholder={`Search ${
              senderType === 'User' 
                ? (selectedType === 'User' ? 'admins' : 'shops')
                : (selectedType === 'User' ? 'users' : 'shops')
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
          renderItem={({ item, index }) => (
            <UserItem
              onPress={() =>
                handleUserClick(
                  item.shop_id || item.user_id,
                  item.firstname || item.shop_name,
                  item.user_image_url || item.shop_image_url
                )
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
            const itemId = item?.shop_id || item?.user_id || `index-${index}`;
            const itemType = selectedType === 'User' ? 'user' : 'shop';
            const senderPrefix = senderType === 'User' ? 'buyer' : 'seller';
            return `${itemType}-${itemId}-${senderPrefix}-${index}`;
          }}
        />
      </Container>
    </>
  );
};

export default ChatListScreen;