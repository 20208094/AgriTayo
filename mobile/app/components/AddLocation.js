import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { styled } from "nativewind";
import Ionicons from "react-native-vector-icons/Ionicons";

const AddLocation = () => {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [checkedAddressId, setCheckedAddressId] = useState(null); // Single checked address
  const [locationError, setLocationError] = useState(null); // Error handling for location

  const addresses = [
    {
      id: "1",
      icon: "heart",
      label: "Partner",
      address: "St. John Inn Dominican Hill Rd Baguio Benguet",
      note: "pahintay nalang sa labas ng AHB Inn",
      latitude: 16.4003,
      longitude: 120.586,
    },
    {
      id: "2",
      icon: "home",
      label: "Home",
      address: "Pinget Hesed Baptist Church Upper Pinget Baguio",
      note: "meet at waiting shed",
      latitude: 16.425,
      longitude: 120.593,
    },
    {
      id: "3",
      icon: "map-marker",
      label: "Cornerstone Catholic Community Military Cut-Off",
      address: "Baguio Benguet",
      note: "none",
      latitude: 16.409,
      longitude: 120.6,
    },
    {
      id: "4",
      icon: "map-marker",
      label: "JD Store Baguio City",
      address: "Baguio Benguet",
      note: "none",
      latitude: 16.41,
      longitude: 120.601,
    },
    {
      id: "5",
      icon: "map-marker",
      label: "212 Pinget",
      address: "Baguio Benguet",
      note: "none",
      latitude: 16.425,
      longitude: 120.593,
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Permission to access location was denied");
          return;
        }

        let { coords } = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      } catch (error) {
        setLocationError("Error getting current location");
        console.log(error);
      }
    })();
  }, []);

  const handleCheck = (id) => {
    setCheckedAddressId((prevId) => (prevId === id ? null : id)); // Toggle the selection
  };

  // Custom checkbox component
  const CustomCheckbox = ({ checked }) => (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: checked ? "#00b251" : "#ccc",
        backgroundColor: checked ? "#00b251" : "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {checked && <Ionicons name="checkmark" size={16} color="white" />}
    </View>
  );

  const renderItem = ({ item }) => (
    <View className="flex-row justify-between items-center bg-white rounded-lg shadow p-4 mb-4">
      <View className="flex-1 flex-row items-center">
        <Icon name={item.icon} type="font-awesome" size={24} color="#00B251" />
        <View className="ml-4 flex-1">
          <Text className="text-lg font-semibold text-black">{item.label}</Text>
          <Text className="text-gray-600">{item.address}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleCheck(item.id)}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        {/* Use the CustomCheckbox component */}
        <CustomCheckbox checked={checkedAddressId === item.id} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-0">
      {/* Display location error if any */}
      {locationError && (
        <Text className="text-center text-red-600 mb-2">{locationError}</Text>
      )}
      
      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      <View className="px-4 py-4">
        <TouchableOpacity
          className="bg-green-600 rounded-full py-4 items-center"
          onPress={() => navigation.navigate("Shop Information")}
        >
          <Text className="text-white text-lg font-semibold">
            Add Location
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default styled(AddLocation);
