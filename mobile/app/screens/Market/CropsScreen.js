import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native"; // Double-check these imports
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/logo.png";
import { useNavigation } from "@react-navigation/native";

const marketCategories = [
  { id: 1, title: "Vegetables", image: logo },
  { id: 2, title: "Fruits", image: logo },
  { id: 3, title: "Spices", image: logo },
  { id: 4, title: "Seedlings", image: logo },
  { id: 5, title: "Plants", image: logo },
  { id: 6, title: "Flowers", image: logo },
];

const MarketCategoryCard = ({ marketCategory }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="bg-white rounded-lg shadow m-2 w-[45%] mb-3">
      <TouchableOpacity
        onPress={() => navigation.navigate("Market List", { category: marketCategory.title })}
      >
        <View className="rounded-t-lg overflow-hidden">
          <Image source={marketCategory.image} className="w-full h-28" />
          <View className="p-2.5">
            <Text className="text-base font-bold mb-1.5">
              {marketCategory.title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

function CropsScreen() {
  return (
    <View className="flex-row flex-wrap justify-between">
      {marketCategories.map((marketCategory) => (
        <MarketCategoryCard
          key={marketCategory.id}
          marketCategory={marketCategory}
        />
      ))}
    </View>
  );
}

export default CropsScreen;
