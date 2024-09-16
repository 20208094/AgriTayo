import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { styled } from "nativewind";
import { FontAwesome } from "@expo/vector-icons";
import { NotificationIcon, MessagesIcon } from "../../components/SearchBarC";

function PickUpAddressScreen({ route }) {
  const { profile } = route.params;
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [checkedAddresses, setCheckedAddresses] = useState({});

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
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    })();
  }, []);

  const handleCheck = (id) => {
    setCheckedAddresses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
      <TouchableOpacity
        onPress={() => handleCheck(item.id)}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: checkedAddresses[item.id] ? "#2F855A" : "#ccc",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {checkedAddresses[item.id] && (
            <FontAwesome name="check-circle" size={20} color="#2F855A" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-0">
      <View className="px-4 mt-0 flex-row justify-between items-center">
        <View className="flex-1"></View>
        <View className="flex-row space-x-4">
          <NotificationIcon
            onPress={() => navigation.navigate("Notifications")}
          />
          <MessagesIcon onPress={() => navigation.navigate("ChatListScreen")} />
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
          onPress={() =>
            navigation.navigate("Shop Information", {profile})
          }
        >
          <Text className="text-white text-lg font-semibold">
            Add Pickup Address
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default styled(PickUpAddressScreen);
