import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import michael from "../assets/ehh.png";
import { styled } from "nativewind";
import { NotificationIcon, MessagesIcon } from "../components/SearchBarC"; // Import icons

function ProfileScreen() {
  const navigation = useNavigation();

  const profile = {
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

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-0">
      {/* Add Notification and Messages icons */}
      <View className="px-4 mt-8 flex-row justify-between items-center">
        {/* Empty View to push icons to the right */}
        <View className="flex-1"></View>
        <View className="flex-row space-x-4">
          <NotificationIcon
            onPress={() => navigation.navigate("Notifications")}
          />
          <MessagesIcon onPress={() => navigation.navigate("Messages")} />
        </View>
      </View>

      <View className="mt-6 bg-green-200 pt-0 pb-6 rounded-b-lg">
        <View className="flex-row items-center px-4">
          <View className="relative mr-4">
            <Image source={michael} className="w-24 h-24 rounded-full" />
            <View className="absolute bottom-0 right-0 bg-green-600 p-1 rounded-full">
              <Icon name="camera" type="font-awesome" size={16} color="white" />
            </View>
          </View>
          <View>
            <Text className="text-2xl font-bold mt-4 text-black">
              {profile.firstname} {profile.lastname}
            </Text>
            <Text className="text-black">{profile.email}</Text>
            <Text className="text-black">{profile.phone}</Text>
          </View>
        </View>
      </View>

      {/* Other content */}
      <View className="mt-4 px-4">
        <View className="bg-white rounded-lg shadow p-4 space-y-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-800">
              My Purchases
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Orders", { screen: "Completed" })
              }
            >
              <Text className="text-green-600">View Purchase History</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-around mt-2">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Orders", { screen: "To Pay" })
              }
            >
              <View className="items-center">
                <Icon
                  name="credit-card"
                  type="font-awesome"
                  size={24}
                  color="green"
                />
                <Text className="text-gray-800 mt-1">To Pay</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Orders", { screen: "To Ship" })
              }
            >
              <View className="items-center">
                <Icon
                  name="truck"
                  type="font-awesome"
                  size={24}
                  color="green"
                />
                <Text className="text-gray-800 mt-1">To Ship</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Orders", { screen: "To Receive" })
              }
            >
              <View className="items-center">
                <Icon name="gift" type="font-awesome" size={24} color="green" />
                <Text className="text-gray-800 mt-1">To Receive</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Orders", { screen: "To Rate" })
              }
            >
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
          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => navigation.navigate("View Profile", { profile })}
          >
            <View className="flex-row items-center">
              <Icon name="user" type="font-awesome" size={20} color="green" />
              <Text className="text-gray-800 font-semibold ml-4">
                View Profile
              </Text>
            </View>
            <Icon
              name="chevron-right"
              type="font-awesome"
              size={20}
              color="gray"
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => navigation.navigate("Address", { profile })}
          >
            <View className="flex-row items-center">
              <Icon
                name="address-book"
                type="font-awesome"
                size={20}
                color="green"
              />
              <Text className="text-gray-800 font-semibold ml-4">Address</Text>
            </View>
            <Icon
              name="chevron-right"
              type="font-awesome"
              size={20}
              color="gray"
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => navigation.navigate("Welcome To Agritayo!", { profile })}
          >
            <View className="flex-row items-center">
              <Icon
                name="plus"
                type="font-awesome"
                size={20}
                color="green"
              />
              <Text className="text-gray-800 font-semibold ml-4">Start Selling</Text>
            </View>
            <Icon
              name="chevron-right"
              type="font-awesome"
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default styled(ProfileScreen);
