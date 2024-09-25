import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import michael from "../../assets/ehh.png";
import { styled } from "nativewind";
import LogoutModal from "../Authentication/LogoutModal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from '@env';

function ProfileScreen({ fetchUserSession }) {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state is initially true
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (userData) {
      console.log('Updated userData:', userData.user_id);
    }
  }, [userData]);

  const getAsyncUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      console.log('stored:', storedData);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);  // Parse storedData
        console.log('parsedData:', parsedData);      // Log the parsed data
        
        if (Array.isArray(parsedData)) {
          const user = parsedData[0];  // Assuming user data is the first element of the array
          console.log('user:', user);   // Log the user object
          setUserData(user);            // Set userData state to the user object
        } else {
          setUserData(parsedData);      // If it's not an array, directly set parsed data
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  useEffect(() => {
    getAsyncUserData();
  }, []);

  const profilersed = {
    id: 1,
    firstname: "Michael",
    middlename: "Rosario",
    lastname: "Calalo",
    birthday: "02/05/2000",
    gender: "Male",
    address: "Baguio City",
    email: "michaelcalalo@gmail.com",
    phone: 6391234567890,
    password: "pogiako123",
  };

  if (loading) {
    return <Text>Loading...</Text>; // or your loading spinner
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-0">
      <View className="mt-1 bg-green-200 pt-0 pb-6 rounded-b-lg">
        <View className="flex-row items-center px-4">
          <View className="relative mr-4">
            <Image source={{uri: userData.user_image_url}} className="w-24 h-24 rounded-full" />
            <View className="absolute bottom-0 right-0 bg-green-600 p-1 rounded-full">
              <Icon name="camera" type="font-awesome" size={16} color="white" />
            </View>
          </View>
          <View>
            <Text className="text-2xl font-bold mt-4 text-black">
              {userData.firstname} {userData.lastname}
            </Text>
            <Text className="text-black">{userData.email}</Text>
            <Text className="text-black">{userData.phone}</Text>
          </View>
        </View>
      </View>

      {/* Other content */}
      <View className="mt-4 px-4">
        <View className="bg-white rounded-lg shadow p-4 space-y-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-800">My Purchases</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Orders", { screen: "Completed" })}>
              <Text className="text-green-600">View Purchase History</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-around mt-2">
            <TouchableOpacity onPress={() => navigation.navigate("Orders", { screen: "To Pay" })}>
              <View className="items-center">
                <Icon name="credit-card" type="font-awesome" size={24} color="green" />
                <Text className="text-gray-800 mt-1">To Pay</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Orders", { screen: "To Ship" })}>
              <View className="items-center">
                <Icon name="truck" type="font-awesome" size={24} color="green" />
                <Text className="text-gray-800 mt-1">To Ship</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Orders", { screen: "To Receive" })}>
              <View className="items-center">
                <Icon name="gift" type="font-awesome" size={24} color="green" />
                <Text className="text-gray-800 mt-1">To Receive</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Orders", { screen: "To Rate" })}>
              <View className="items-center">
                <Icon name="star" type="font-awesome" size={24} color="green" />
                <Text className="text-gray-800 mt-1">To Rate</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="mt-4 px-4">
        <View className="bg-white rounded-lg shadow p-4 space-y-4">
          <TouchableOpacity className="flex-row items-center justify-between" onPress={() => navigation.navigate("View Profile", { userData })}>
            <View className="flex-row items-center">
              <Icon name="user" type="font-awesome" size={20} color="green" />
              <Text className="text-gray-800 font-semibold ml-4">View Profile</Text>
            </View>
            <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between" onPress={() => navigation.navigate("Address", { userData })}>
            <View className="flex-row items-center">
              <Icon name="address-book" type="font-awesome" size={20} color="green" />
              <Text className="text-gray-800 font-semibold ml-4">Address</Text>
            </View>
            <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between" onPress={() => navigation.navigate("Welcome To Agritayo!", { userData })}>
            <View className="flex-row items-center">
              <Icon name="plus" type="font-awesome" size={20} color="green" />
              <Text className="text-gray-800 font-semibold ml-4">Start Selling</Text>
            </View>
            <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between" onPress={() => navigation.navigate("My Shop")}>
            <View className="flex-row items-center">
              <Icon name="store" type="material" size={20} color="green" />
              <Text className="text-gray-800 font-semibold ml-4">Shop</Text>
            </View>
            <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between" onPress={() => setModalVisible(true)}>
            <View className="flex-row items-center">
              <Icon name="log-out" type="ionicon" size={20} color="green" />
              <Text className="text-gray-800 font-semibold ml-4">Log out</Text>
            </View>
            <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Modal */}
      <LogoutModal
        isVisible={isModalVisible}
        onCancel={() => setModalVisible(false)}
        fetchUserSession={fetchUserSession} 
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

export default styled(ProfileScreen);
