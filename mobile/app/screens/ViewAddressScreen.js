import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

function ViewAddressScreen({ route, navigation }) {
  const { profile } = route.params;

  return (
    <SafeAreaView className=''>
      <Text className=''>Current Address: {"\n"} {profile.address}</Text>
      <TouchableOpacity
        className=''
        onPress={() => navigation.navigate('Edit Address')}
      >
        <Text className=''>Edit Address</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default ViewAddressScreen;
