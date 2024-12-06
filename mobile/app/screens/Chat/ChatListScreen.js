import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from 'nativewind';
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';
import io from 'socket.io-client';

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
  const socketRef = useRef(null);

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

  // Add this useEffect for socket connection and real-time updates
  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(REACT_NATIVE_API_BASE_URL, { transports: ['websocket'] });

    // Listen for new messages and chat updates
    socketRef.current.on("chat message", (msg) => {
      console.log("New message received:", msg);
      // Immediately fetch latest chats when new message arrives
      fetchChats();
    });

    // Initial fetch
    if (senderId && senderType) {
      fetchChats();
    }

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.off("chat message");
        socketRef.current.disconnect();
      }
    };
  }, [senderId, senderType]); // Dependencies ensure socket reconnects when user changes

  // Update the fetchChats function
  const fetchChats = async () => {
    try {
      if (!senderId) return;

      const chatResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/chats`, {
        headers: { 
          'x-api-key': REACT_NATIVE_API_KEY,
          'Cache-Control': 'no-cache'  // Prevent caching
        },
      });

      if (!chatResponse.ok) {
        throw new Error('Failed to fetch chats');
      }

      const chats = await chatResponse.json();
      
      // Filter chats for current user
      const relevantChats = chats.filter(chat => 
        (chat.sender_id === senderId && chat.sender_type === senderType) ||
        (chat.receiver_id === senderId && chat.receiver_type === senderType)
      );

      // Get latest messages by grouping conversations
      const latestMessages = {};
      relevantChats.forEach(chat => {
        const otherPartyId = chat.sender_id === senderId ? chat.receiver_id : chat.sender_id;
        const otherPartyType = chat.sender_id === senderId ? chat.receiver_type : chat.sender_type;
        const key = `${otherPartyType}-${otherPartyId}`;
        
        if (!latestMessages[key] || new Date(chat.sent_at) > new Date(latestMessages[key].sent_at)) {
          latestMessages[key] = chat;
        }
      });

      // Fetch users and shops data
      const [usersResponse, shopsResponse] = await Promise.all([
        fetch(`${REACT_NATIVE_API_BASE_URL}/api/users`, {
          headers: { 
            'x-api-key': REACT_NATIVE_API_KEY,
            'Cache-Control': 'no-cache'
          }
        }),
        fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops`, {
          headers: { 
            'x-api-key': REACT_NATIVE_API_KEY,
            'Cache-Control': 'no-cache'
          }
        })
      ]);

      const [usersData, shopsData] = await Promise.all([
        usersResponse.json(),
        shopsResponse.json()
      ]);

      // Process and combine chat data with user/shop info
      const processChats = (messages, data, type) => {
        return Object.values(messages)
          .filter(msg => msg.sender_type === type || msg.receiver_type === type)
          .map(msg => {
            const id = msg.sender_id === senderId ? msg.receiver_id : msg.sender_id;
            const item = data.find(d => (type === 'User' ? d.user_id : d.shop_id) === id);
            
            if (!item) return null;

            return {
              ...item,
              lastMessage: msg.chat_message,
              time: new Date(msg.sent_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              sent_at: msg.sent_at,
              chat_id: msg.chat_id // Add chat_id for better tracking
            };
          })
          .filter(Boolean)
          .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at)); // Sort by most recent
      };

      const userChats = processChats(latestMessages, usersData, 'User');
      const shopChats = processChats(latestMessages, shopsData, 'Shop');

      // Update state with new data
      setUsers(userChats);
      setFilteredUsers(userChats);
      setShops(shopChats);
      setFilteredShops(shopChats);
      setAllUsers(usersData);
      setAllShops(shopsData);

    } catch (error) {
      console.error('Error fetching chats:', error);
      setError('Failed to fetch latest messages. Please try again.');
    }
  };

  // Add this to refresh chats when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (senderId && senderType) {
        fetchChats();
      }
      return () => {};
    }, [senderId, senderType])
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
          keyExtractor={(item) => {
            // Create a unique key combining type, id, and timestamp
            const type = item.user_id ? 'user' : 'shop';
            const id = item.user_id || item.shop_id;
            const timestamp = item.sent_at ? new Date(item.sent_at).getTime() : Date.now();
            return `${type}-${id}-${timestamp}`;
          }}
        />
      </Container>
    </>
  );
};

export default ChatListScreen;

