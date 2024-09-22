import React from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, Image, View, Text } from "react-native";
import Reports from "../../../../components/Reports";
import placeholderimg from '../../../../assets/placeholder.png';

function ToShipScreen({ navigation }) {
  const toShipOrders = [
    {
      title: "Order #1234",
      description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan, tortor eget laoreet luctus, odio urna gravida nisi, sit amet ultrices nisl velit sit amet risus. Integer fermentum nunc sit amet magna fringilla, in convallis odio tincidunt.",
      date: "2024-08-15",
      image: placeholderimg,
      price: 100
    },
    {
      title: "Order #1235",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan, tortor eget laoreet luctus, odio urna gravida nisi, sit amet ultrices nisl velit sit amet risus. Integer fermentum nunc sit amet magna fringilla, in convallis odio tincidunt.",
      date: "2024-08-14",
      image: placeholderimg,
      price: 100
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Reports data={toShipOrders} dataType="toShipOrders" />
      <ScrollView className="p-4">
        {toShipOrders.map((toShipOrder, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center"
            onPress={() => navigation.navigate('Farmers Orders Details', { toShipOrder })}
          >
            <Image source={toShipOrder.image} className="w-16 h-16 rounded-lg mr-4" />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{toShipOrder.title}</Text>
              <Text className="text-sm text-green-600">Date: {toShipOrder.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default ToShipScreen;
