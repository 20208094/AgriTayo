import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import placeholderimg from "../../../../assets/placeholder.png";
import SearchBarC from "../../../../components/SearchBarC";
import Reports from "../../../../components/Reports";

function ViolationScreen({ navigation }) {
  const violationItems = [
    {
      id: 1,
      name: "Product E",
      violation: "Inappropriate Content",
      image: placeholderimg,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan, tortor eget laoreet luctus, odio urna gravida nisi, sit amet ultrices nisl velit sit amet risus. Integer fermentum nunc sit amet magna fringilla, in convallis odio tincidunt.",
      price: 100, date: "2024-08-10"
    },
    {
      id: 2,
      name: "Product F",
      violation: "Misleading Information",
      image: placeholderimg,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan, tortor eget laoreet luctus, odio urna gravida nisi, sit amet ultrices nisl velit sit amet risus. Integer fermentum nunc sit amet magna fringilla, in convallis odio tincidunt.",
      price: 100, date: "2024-08-10"
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <SearchBarC />
      <Reports data={violationItems} dataType="violationItems" />
      <ScrollView className="p-4">
        {violationItems.map((violationItem) => (
          <TouchableOpacity
            key={violationItem.id}
            className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center"
            onPress={() =>
              navigation.navigate("Farmers Product Details", { violationItem })
            }
          >
            <Image
              source={violationItem.image}
              className="w-16 h-16 rounded-lg mr-4"
            />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">
                {violationItem.name}
              </Text>
              <Text className="text-sm text-red-600">
                Violation: {violationItem.violation}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default ViolationScreen;
