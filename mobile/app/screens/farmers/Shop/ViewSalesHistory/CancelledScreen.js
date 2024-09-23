import React from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, Image, View, Text } from 'react-native';
import Reports from '../../../../components/Reports';
import placeholderimg from '../../../../assets/placeholder.png'; // Adjust the path as needed

function CancelledScreen({ navigation }) {
    const cancelledOrders = [
        { title: 'Order #1229', description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan, tortor eget laoreet luctus, odio urna gravida nisi, sit amet ultrices nisl velit sit amet risus. Integer fermentum nunc sit amet magna fringilla, in convallis odio tincidunt.",date: '2024-08-10', reason: 'Mali pala', image: placeholderimg, price: 100 },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <Reports data={cancelledOrders} dataType="cancelledOrders" />
            <ScrollView className="p-4">
                {cancelledOrders.map((cancelledOrder, index) => (
                    <TouchableOpacity 
                        key={index}
                        className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center"
                        onPress={() => navigation.navigate('Farmers Orders Details', { cancelledOrder })}
                    >
                        <Image source={cancelledOrder.image} className="w-16 h-16 rounded-lg mr-4" />
                        <View className="flex-1">
                            <Text className="text-lg font-semibold text-gray-800">{cancelledOrder.title}</Text>
                            <Text className="text-sm text-green-600">Cancelled on: {cancelledOrder.date}</Text>
                            <Text className="text-sm text-red-600">Reason: {cancelledOrder.reason}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default CancelledScreen;
