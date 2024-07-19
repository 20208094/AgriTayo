import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function AddressScreen({ route, navigation }) {
  const { profile } = route.params;
  return (
    <SafeAreaView className="">
      <TouchableOpacity className=""
      onPress={() => navigation.navigate('View Address' , { profile })}
      >
        <Text className="">
          Address: {"\n"} {profile.address}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className=''
      onPress={() => navigation.navigate('Add Address')}
      >
        <Text className=''>Add New Address</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default AddressScreen;
