import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { styled } from "nativewind";
import { NotificationIcon, MessagesIcon } from "../components/SearchBarC"; 

function AddressScreen({ route }) {
  const { profile } = route.params;
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Updated example addresses with accurate coordinates
  const addresses = [
    {
      id: '1',
      icon: 'heart',
      label: 'Partner',
      address: 'St. John Inn Dominican Hill Rd Baguio Benguet',
      note: 'pahintay nalang sa labas ng AHB Inn',
      latitude: 16.4003,
      longitude: 120.5860,
    },
    {
      id: '2',
      icon: 'home',
      label: 'Home',
      address: 'Pinget Hesed Baptist Church Upper Pinget Baguio',
      note: 'meet at waiting shed',
      latitude: 16.4250,
      longitude: 120.5930,
    },
    {
      id: '3',
      icon: 'map-marker',
      label: 'Cornerstone Catholic Community Military Cut-Off',
      address: 'Baguio Benguet',
      note: 'none',
      latitude: 16.4090,
      longitude: 120.6000,
    },
    {
      id: '4',
      icon: 'map-marker',
      label: 'JD Store Baguio City',
      address: 'Baguio Benguet',
      note: 'none',
      latitude: 16.4100,
      longitude: 120.6010,
    },
    {
      id: '5',
      icon: 'map-marker',
      label: '212 Pinget',
      address: 'Baguio Benguet',
      note: 'none',
      latitude: 16.4250,
      longitude: 120.5930,
    },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setCurrentLocation({ latitude: coords.latitude, longitude: coords.longitude });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00B251" />
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <View className="flex-row justify-between items-center bg-white rounded-lg shadow p-4 mb-4">
      <View className="flex-1 flex-row items-center">
        <Icon name={item.icon} type="font-awesome" size={24} color="#00B251" />
        <View className="ml-4 flex-1">
          <Text className="text-lg font-semibold text-black">{item.label}</Text>
          <Text className="text-gray-600">{item.address}</Text>
          <Text className="text-gray-600">Note to rider: {item.note}</Text>
        </View>
      </View>
      <View className="flex-row space-x-4">
        <TouchableOpacity onPress={() => navigation.navigate('Edit Address', { address: item })}>
          <Icon name="edit" type="font-awesome" size={20} color="#00B251" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Delete address')}>
          <Icon name="trash" type="font-awesome" size={20} color="#00B251" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-0">
      <View className="px-4 mt-0 flex-row justify-between items-center">
        <View className="flex-1"></View>
        <View className="flex-row space-x-4">
          <NotificationIcon onPress={() => navigation.navigate("Notifications")} />
          <MessagesIcon onPress={() => navigation.navigate("Messages")} />
        </View>
      </View>

      <View className="mt-1 bg-gray-100 pt-4 pb-6 rounded-b-lg">
        <View className="px-4">
          <Text className="text-2xl font-bold text-black">Addresses</Text>
        </View>
      </View>

      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      <View className="px-4 py-4">
        <TouchableOpacity
          className="bg-green-600 rounded-full py-4 items-center"
          onPress={() => navigation.navigate('Add Address', { currentLocation })}
        >
          <Text className="text-white text-lg font-semibold">Add New Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default styled(AddressScreen);
