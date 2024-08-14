import React from 'react';
import { View, Image, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import michael from "../../../assets/ehh.png";

function ViewShopScreen({ navigation, route }) {
    const { information } = route.params;

    return (
        <SafeAreaView className="bg-white flex-1">
            {/* Header Section */}
            <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center">
                    <Image source={michael} className="w-12 h-12 rounded-full" />
                    <View className="ml-3">
                        <Text className="text-lg font-semibold">{information.name}</Text>
                        <Text className="text-gray-500 text-sm">{information.followers} Followers</Text>
                        <Text className="text-gray-500 text-sm">{information.verify}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    className="px-4 py-1 border border-[#00B251] rounded-full"
                    onPress={() => navigation.navigate('Edit Shop', { information })}
                >
                    <Text className="text-[#00B251]">Edit</Text>
                </TouchableOpacity>
            </View>

            {/* Banner Placeholder */}
            <View className="bg-[#00B251] w-full h-20 mt-2 mb-4" />

            {/* Shop Contents Section */}
            <View className="px-6">
                <Text className="text-lg font-semibold mb-4">View Shop Contents</Text>
                
                {/* Example Shop Content */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-md">Product 1</Text>
                    <TouchableOpacity
                        className="px-4 py-1 border border-gray-300 rounded-full"
                        onPress={() => {}}
                    >
                        <Text className="text-gray-700">View Details</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-md">Product 2</Text>
                    <TouchableOpacity
                        className="px-4 py-1 border border-gray-300 rounded-full"
                        onPress={() => {}}
                    >
                        <Text className="text-gray-700">View Details</Text>
                    </TouchableOpacity>
                </View>

                {/* Add more shop content here as needed */}
            </View>
        </SafeAreaView>
    );
}

export default ViewShopScreen;
