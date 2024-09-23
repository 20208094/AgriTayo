import React from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, Image, View, Text } from "react-native";
import Reports from "../../../../components/Reports";
import placeholderimg from '../../../../assets/placeholder.png'; // Adjust the path as needed

function CompletedScreen({ navigation }) {
  const completedOrders = [
    {
      title: "Order #1232",
      description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan, tortor eget laoreet luctus, odio urna gravida nisi, sit amet ultrices nisl velit sit amet risus. Integer fermentum nunc sit amet magna fringilla, in convallis odio tincidunt.",
      date: "2024-08-13",
      image: placeholderimg,
      price: 100
    },
    {
      title: "Order #1231",
      description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan, tortor eget laoreet luctus, odio urna gravida nisi, sit amet ultrices nisl velit sit amet risus. Integer fermentum nunc sit amet magna fringilla, in convallis odio tincidunt.",
      date: "2024-08-12",
      image: placeholderimg,
      price: 100
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Reports data={completedOrders} dataType="completedOrders" />
      <ScrollView className="p-4">
        {completedOrders.map((completedOrder, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center"
            onPress={() =>
              navigation.navigate("Farmers Orders Details", { completedOrder })
            }
          >
            <Image source={completedOrder.image} className="w-16 h-16 rounded-lg mr-4" />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{completedOrder.title}</Text>
              <Text className="text-sm text-green-600">Completed on: {completedOrder.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default CompletedScreen;
