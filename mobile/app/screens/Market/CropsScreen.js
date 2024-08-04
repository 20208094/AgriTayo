import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/logo.png";
import { useNavigation } from "@react-navigation/native";

const marketCategories = [
  {
    id: 1,
    title: "Vegetables",
    image: logo,
  },
  {
    id: 2,
    title: "Fruits",
    image: logo,
  },
  {
    id: 3,
    title: "Spices",
    image: logo,
  },
  {
    id: 4, 
    title: 'Seedlings',
    image: logo
  },
  {
    id: 5, 
    title: 'Plants',
    image: logo
  },
  {
    id: 6, 
    title: 'Flowers',
    image: logo
  },
];

const navigationTargets = {
  1: 'Vegetable Category',
  2: 'Fruit Category',
  3: 'Spices Category',
  4: 'Seedling Category',
  5: 'Plant Category',
  6: 'Flower Category'
};

const MarketCategoryCard = ({ marketCategory }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    const target = navigationTargets[marketCategory.id];
    if (target) {
      navigation.navigate(target);
    }
  };

  return (
    <SafeAreaView className="bg-white rounded-lg shadow m-2 w-[45%] mb-3">
      <ScrollView>
      <TouchableOpacity onPress={handlePress}>
        <View className="rounded-t-lg overflow-hidden">
          <Image source={marketCategory.image} className="w-full h-28" />
          <View className="p-2.5">
            <Text className="text-base font-bold mb-1.5">
              {marketCategory.title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      </ScrollView>
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
