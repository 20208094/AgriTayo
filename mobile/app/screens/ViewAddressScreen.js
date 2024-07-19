import React from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';

function ViewAddressScreen({ route, navigation }) {
  const { profile } = route.params;

  return (
    <SafeAreaView className=''>
      <Text className=''>Current Address: {"\n"} {profile.address}</Text>
      <TouchableOpacity
        className=''
      >
        <Text className=''>Edit Address</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default ViewAddressScreen;
