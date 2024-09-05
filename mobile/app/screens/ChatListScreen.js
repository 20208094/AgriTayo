// ChatListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { REACT_NATIVE_API_KEY } from '@env'; // Use .env for API key

const API_URL = 'https://agritayo.azurewebsites.net/api/chats';

const ChatListScreen = () => {
  const [users, setUsers] = useState([]);
  const userId = 1; // Default user ID
  const [error, setError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserSessionAndUsers = async () => {
      try {
        // Simulate fetching session data
        const sessionData = { user_id: userId };

        if (sessionData.user_id) {
          // Fetch chats
          const chatResponse = await fetch(API_URL, {
            headers: { 'x-api-key': REACT_NATIVE_API_KEY }
          });

          if (chatResponse.ok) {
            const chats = await chatResponse.json();

            // Extract unique users
            const uniqueUsers = Array.from(new Set(
              chats.map(chat => chat.sender_id === userId ? chat.receiver_id : chat.sender_id)
            )).map(id => ({
              id,
              name: `User ${id}` // Replace with actual user/shop names if available
            }));

            setUsers(uniqueUsers);
          } else {
            console.error('Failed to fetch chats:', chatResponse.statusText);
          }
        } else {
          // Handle navigation to login or error
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again.');
      }
    };

    fetchUserSessionAndUsers();
  }, []);

  const handleUserClick = (receiverId) => {
    console.log('Navigating to ChatScreen with receiverId:', receiverId); // Log the receiverId
    navigation.navigate('ChatScreen', { receiverId: receiverId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Chats</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      {console.log('FlatList Data:', users)}
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userItem} onPress={() => handleUserClick(item.id)}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ChatListScreen;
