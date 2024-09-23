import React from "react";
import {
  View,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import michael from "../../../assets/ehh.png";
import img from "../../../assets/placeholder.png";

const dummyProducts = [
  {
    id: 1,
    name: "Product 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan, tortor eget laoreet luctus, odio urna gravida nisi, sit amet ultrices nisl velit sit amet risus. Integer fermentum nunc sit amet magna fringilla, in convallis odio tincidunt.",
    price: 100,
    image: img,
  },
  {
    id: 2,
    name: "Product 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan, tortor eget laoreet luctus, odio urna gravida nisi, sit amet ultrices nisl velit sit amet risus. Integer fermentum nunc sit amet magna fringilla, in convallis odio tincidunt.",
    price: 200,
    image: img,
  },
];

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
            <Text className="text-gray-500 text-sm">
              {information.followers} Followers
            </Text>
            <Text className="text-gray-500 text-sm">{information.verify}</Text>
          </View>
        </View>
        <TouchableOpacity
          className="px-4 py-1 border border-[#00B251] rounded-full"
          onPress={() => navigation.navigate("Edit Shop", {information})}
        >
          <Text className="text-[#00B251]">Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Banner Placeholder */}
      <View className="bg-[#00B251] w-full h-20 mt-2 mb-4" />
      {/* Shop Contents Section */}
      <View className="px-6">
        <Text className="text-lg font-semibold mb-4">View Shop Contents</Text>
        {dummyProducts.map((dummyProduct) => (
          <View
            key={dummyProduct.id}
            className="flex-row justify-between items-center mb-4"
          >
            <Text className="text-md">{dummyProduct.name}</Text>
            <TouchableOpacity
              className="px-4 py-1 border border-gray-300 rounded-full"
              onPress={() =>
                navigation.navigate("View Shop Details", { dummyProduct })
              }
            >
              <Text className="text-gray-700">View Details</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default ViewShopScreen;
