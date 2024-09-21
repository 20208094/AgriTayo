import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import placeholderimg from '../../assets/placeholder.png'; // Adjust the path as needed

const CompletedScreen = ({ navigation }) => {
    const completedOrders = [
        { id: '1', item: 'Tomato Seeds', date: '2024-08-29', total: '₱120', image: placeholderimg },
        { id: '2', item: 'Lettuce Seeds', date: '2024-08-25', total: '₱85', image: placeholderimg },
    ];

    return (
        <SafeAreaView>
            <ScrollView className="p-4">
                {completedOrders.map((completedOrder) => (
                    <TouchableOpacity
                        key={completedOrder.id}
                        className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center"
                        onPress={() => navigation.navigate('Order Details', { completedOrder })}
                    >
                        <Image source={completedOrder.image} className="w-16 h-16 rounded-lg mr-4" />
                        <View className="flex-1">
                            <Text className="text-lg font-semibold text-gray-800">{completedOrder.item}</Text>
                            <Text className="text-sm text-gray-600">Completed on: {completedOrder.date}</Text>
                            <Text className="text-sm text-green-600">Total: {completedOrder.total}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default CompletedScreen;
