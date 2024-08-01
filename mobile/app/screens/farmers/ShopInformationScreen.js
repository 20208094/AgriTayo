import React from "react";
import { TextInput, Text, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from 'nativewind';
import { Icon } from "react-native-elements";

function ShopInformationScreen({ route, navigation }) {
  const { profile } = route.params;
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView className='px-4'>
        <View className='flex-row justify-between items-center mt-4'>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" type="font-awesome" size={24} color="#00B251" />
          </TouchableOpacity>
          <Text className='text-xl font-bold text-black'>Shop Information</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text className='text-green-600 font-bold'>Save</Text>
          </TouchableOpacity>
        </View>

        <View className='flex-row justify-between items-center mt-4'>
          <View className='flex-1 border-b-2 border-green-800 pb-2'>
            <Text className='text-center text-green-800'>Shop Information</Text>
          </View>
          <View className='flex-1 border-b-2 border-gray-300 pb-2'>
            <Text className='text-center text-gray-300'>Business Information</Text>
          </View>
        </View>

        <View className='mt-4'>
          <Text className='text-lg text-black mb-2'>Shop Name *</Text>
          <TextInput
            className='bg-gray-100 rounded-md p-4 text-black'
            placeholder='Shop Name'
          />
        </View>

        <TouchableOpacity 
          className='bg-gray-100 rounded-md p-4 my-2 flex-row justify-between items-center'
          onPress={() => navigation.navigate('Pickup Address', {profile})}
        >
          <Text className='text-base text-black'>Pickup Address: {profile.address}</Text>
          <Icon name="chevron-right" type="font-awesome" size={24} color="#2F855A" />
        </TouchableOpacity>

        <TouchableOpacity
          className='bg-gray-100 rounded-md p-4 my-2 flex-row justify-between items-center'
          onPress={() => navigation.navigate('Email Authentication', { profile })}
        >
          <Text className='text-base text-black'>Email: {profile.email}</Text>
          <Icon name="chevron-right" type="font-awesome" size={24} color="#2F855A" />
        </TouchableOpacity>

        <TouchableOpacity
          className='bg-gray-100 rounded-md p-4 my-2 flex-row justify-between items-center'
          onPress={() => navigation.navigate('Authentication', { profile })}
        >
          <Text className='text-base text-black'>Phone Number: {profile.phone}</Text>
          <Icon name="chevron-right" type="font-awesome" size={24} color="#2F855A" />
        </TouchableOpacity>

        <View className='flex-row justify-between mt-6'>
          <TouchableOpacity
            className='bg-gray-300 rounded-full py-4 px-8'
            onPress={() => navigation.goBack()}
          >
            <Text className='text-white text-lg font-semibold'>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='bg-green-600 rounded-full py-4 px-8'
            onPress={() => navigation.navigate('Business Information', { profile })}
          >
            <Text className='text-white text-lg font-semibold'>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default styled(ShopInformationScreen);
