import React from "react";
import { Text, TextInput, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ViewProfileScreen({ route, navigation }) {
    const {profile} = route.params
  return (
    <SafeAreaView className="">
      <Text className="">
        First Name: {"\n"} {profile.firstname}{" "}
      </Text>
      <Text className="">
        Middle Name: {"\n"} {profile.middlename}{" "}
      </Text>
      <Text className="">
        Last Name: {"\n"} {profile.lastname}{" "}
      </Text>
      <Text className="">
        Birthday: {"\n"} {profile.birthday}{" "}
      </Text>
      <Text className="">
        Gender: {"\n"} {profile.gender}{" "}
      </Text>
      <Text className="">
        Address: {"\n"} {profile.address}{" "}
      </Text>
      <Text className="">
        Email: {"\n"} {profile.email}{" "}
      </Text>
      <Text className="">
        Phone: {"\n"} {profile.phone}{" "}
      </Text>
      <TouchableOpacity className='' onPress={() => navigation.navigate('Edit Profile', {profile})}>
        <Text className=''>Edit Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default ViewProfileScreen;
