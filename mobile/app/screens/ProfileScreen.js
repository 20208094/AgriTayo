import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import michael from "../assets/ehh.png";

function ProfileScreen({ navigation }) {
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
    <SafeAreaView className="">
      <View className="">
        <Image source={michael} className="w-24 h-24 rounded-full mb-2" />
        <Text className="">{profile.firstname}</Text>
      </View>
      <TouchableOpacity className=""
      onPress={() => navigation.navigate('Orders', { screen: 'Completed' })}
      >
        <Text className="">My Purchases View Purchase History</Text>
      </TouchableOpacity>
      <TouchableOpacity className=""
      onPress={() => navigation.navigate('Orders', { screen: 'To Pay' })}
      >
        <Text className="">To Pay</Text>
      </TouchableOpacity>
      <TouchableOpacity className=""
      onPress={() => navigation.navigate('Orders', { screen: 'To Ship' })}
      >
        <Text className="">To Ship</Text>
      </TouchableOpacity>
      <TouchableOpacity className=""
      onPress={() => navigation.navigate('Orders', { screen: 'To Recieve' })}
      >
        <Text className="">To Receive</Text>
      </TouchableOpacity>
      <TouchableOpacity className="">
        <Text className="">To Rate</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className=""
        onPress={() => navigation.navigate('View Profile', { profile })}
      >
        <Text className="">View Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      className=""
      onPress={() => navigation.navigate('Address', {profile})}
      >
        <Text className="">Address</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default ProfileScreen;
