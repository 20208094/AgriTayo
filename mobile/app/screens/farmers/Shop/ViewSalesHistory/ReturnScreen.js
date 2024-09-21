import React from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, Image, View, Text } from 'react-native';
import Reports from '../../../../components/Reports';
import placeholderimg from '../../../../assets/placeholder.png'; // Adjust the path as needed

function ReturnScreen({ navigation }) {
    const returnOrders = [
        { title: 'Order #1227', description: '1 item', date: '2024-08-09', image: placeholderimg },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <Reports data={returnOrders} dataType="returnOrders" />
            <ScrollView className="p-4">
                {returnOrders.map((returnOrder, index) => (
                    <TouchableOpacity 
                        key={index}
                        className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center"
                        onPress={() => navigation.navigate('Farmers Orders Details', { returnOrder })}
                    >
                        <Image source={returnOrder.image} className="w-16 h-16 rounded-lg mr-4" />
                        <View className="flex-1">
                            <Text className="text-lg font-semibold text-gray-800">{returnOrder.title}</Text>
                            <Text className="text-sm text-green-600">Return requested on: {returnOrder.date}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default ReturnScreen;
