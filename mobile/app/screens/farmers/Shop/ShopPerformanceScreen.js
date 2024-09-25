import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Make sure you have this import

function ShopPerformanceScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-lg font-semibold mb-4">All Your Performance</Text>
      
      <View className="flex-row justify-around">
        <TouchableOpacity
          className="items-center"
          onPress={() => navigation.navigate('Shop Rating')}
        >
          <View className="h-16 w-16 justify-center items-center bg-gray-100 rounded-full mb-2">
            <FontAwesome5 name="star" size={24} color="#00B251" />
          </View>
          <Text className="text-center text-sm text-gray-600">Shop Rating</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center"
          onPress={() => navigation.navigate('Bussiness Insights')}
        >
          <View className="h-16 w-16 justify-center items-center bg-gray-100 rounded-full mb-2">
            <FontAwesome5 name="chart-bar" size={24} color="#00B251" />
          </View>
          <Text className="text-center text-sm text-gray-600">Business Insights</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          className="items-center"
          onPress={() => navigation.navigate('Account Health')}
        >
          <View className="h-16 w-16 justify-center items-center bg-gray-100 rounded-full mb-2">
            <FontAwesome5 name="heartbeat" size={24} color="#00B251" />
          </View>
          <Text className="text-center text-sm text-gray-600">Account Health</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

export default ShopPerformanceScreen;
