import React from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, Image, View, Text } from 'react-native';
import Reports from '../../../../components/Reports';
import placeholderimg from '../../../../assets/placeholder.png'; // Adjust the path as needed

function ReviewScreen({ navigation }) {
    const reviewOrders = [
        { title: 'Order #1226', description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan, tortor eget laoreet luctus, odio urna gravida nisi, sit amet ultrices nisl velit sit amet risus. Integer fermentum nunc sit amet magna fringilla, in convallis odio tincidunt.",date: '2024-08-08', image: placeholderimg, price: 100},
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <Reports data={reviewOrders} dataType="orders" />
            <ScrollView className="p-4">
                {reviewOrders.map((reviewOrder, index) => (
                    <TouchableOpacity 
                        key={index}
                        className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center"
                        onPress={() => navigation.navigate('Farmers Orders Details', { reviewOrder })}
                    >
                        <Image source={reviewOrder.image} className="w-16 h-16 rounded-lg mr-4" />
                        <View className="flex-1">
                            <Text className="text-lg font-semibold text-gray-800">{reviewOrder.title}</Text>
                            <Text className="text-sm text-green-600">Review requested on: {reviewOrder.date}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default ReviewScreen;
