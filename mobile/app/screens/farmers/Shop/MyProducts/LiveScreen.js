import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import SearchBarC from "../../../../components/SearchBarC";
import Reports from "../../../../components/Reports";
import placeholderimg from "../../../../assets/placeholder.png";
import { Text, View } from "react-native";

function LiveScreen({ navigation }) {
  const liveItems = [
    {
      id: 1,
      name: "Product A",
      date: "2024-08-10",
      image: placeholderimg,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      price: 100,
    },
    {
      id: 2,
      name: "Product B",
      date: "2024-08-11",
      image: placeholderimg,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      price: 100,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <SearchBarC />
      <View className="">
        <Reports data={liveItems} dataType="liveItems" />
        <TouchableOpacity
          className="bg-green-600 py-4 px-3 rounded-lg shadow-lg w-1/2 max-w-xs"
          onPress={() => navigation.navigate("Add Product")}
        >
          <Text className="text-white font-semibold text-center">
            Add New Product
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="p-4">
        {liveItems.map((liveItem) => (
          <TouchableOpacity
            key={liveItem.id}
            className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center"
            onPress={() =>
              navigation.navigate("Farmers Product Details", { liveItem })
            }
          >
            <Image
              source={liveItem.image}
              className="w-16 h-16 rounded-lg mr-4"
            />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">
                {liveItem.name}
              </Text>
              <Text className="text-sm text-green-600">
                Available since: {liveItem.date}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default LiveScreen;
