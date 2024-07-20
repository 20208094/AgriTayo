import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { styled } from "nativewind";
import { NotificationIcon, MessagesIcon } from "../components/SearchBarC";

function ViewAddressScreen({ route }) {
  const { profile } = route.params;
  const navigation = useNavigation();

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
          <Text className="text-2xl font-bold text-black">Current Address</Text>
          <Text className="text-black mt-2">{profile.address}</Text>
        </View>
      </View>

      <View className="mt-4 px-4">
        <View className="bg-white rounded-lg shadow p-4 space-y-4">
          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => navigation.navigate('Edit Address')}
          >
            <View className="flex-row items-center">
              <Icon name="edit" type="font-awesome" size={20} color="green" />
              <Text className="text-gray-800 font-semibold ml-4">Edit Address</Text>
            </View>
            <Icon name="chevron-right" type="font-awesome" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default styled(ViewAddressScreen);
