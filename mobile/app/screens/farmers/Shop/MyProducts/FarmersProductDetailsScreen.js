import React from "react";
import { SafeAreaView, View, Text, Image, ScrollView } from "react-native";

function FarmersProductDetailScreen({ route }) {
    const { liveItem, reviewingItem, violationItem, delistedItem } = route.params;

    const product = liveItem || reviewingItem || violationItem || delistedItem;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="p-4">
                {product ? (
                    <>
                        <Image className="w-full h-72 object-cover" source={product.image} />
                        <Text className="text-2xl font-bold text-[#00B251] mt-4">{product.name}</Text>
                        <Text className="text-base my-2 text-gray-800">{product.description || product.violation || product.reason}</Text>
                        <Text className="text-xl font-bold text-green-500">Price: ₱{product.price}</Text>
                        <Text className="text-sm text-gray-600">Date: {product.date}</Text>
                    </>
                ) : (
                    <Text className="text-center text-gray-600">No item available</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default FarmersProductDetailScreen;
