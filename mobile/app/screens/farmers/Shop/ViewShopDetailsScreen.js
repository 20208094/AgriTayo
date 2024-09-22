import React from 'react';
import { SafeAreaView, View, Text, Image, ScrollView } from 'react-native';

function ViewShopDetailsScreen({ route }) {
    const { dummyProduct } = route.params;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView>
                <Image className="w-full h-72 object-cover" source={dummyProduct.image} />
                <View className="p-4">
                    <Text className="text-2xl font-bold text-[#00B251]">{dummyProduct.name}</Text>
                    <Text className="text-base my-2 text-gray-800">{dummyProduct.description}</Text>
                    <Text className="text-xl font-bold text-[#00B251]">Price: ₱{dummyProduct.price}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ViewShopDetailsScreen;
