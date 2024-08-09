import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import veggies from "../../assets/Market/Veggies.png";
import fruits from "../../assets/Market/Fruits.png";
import seedlings from "../../assets/Market/Seedlings.png";
import spices from "../../assets/Market/Spices.png";
import flowers from "../../assets/Market/Flowers.png";
import plants from "../../assets/Market/Plants.png";
import logo from "../../assets/logo.png"
import { useNavigation } from "@react-navigation/native";

const marketCategories = [
  {
    id: 1,
    title: "Vegetables",
    image: veggies,
  },
  {
    id: 2,
    title: "Fruits",
    image: fruits,
  },
  {
    id: 3,
    title: "Spices",
    image: spices,
  },
  {
    id: 4, 
    title: 'Seedlings',
    image: seedlings,
  },
  {
    id: 5, 
    title: 'Plants',
    image: plants,
  },
  {
    id: 6, 
    title: 'Flowers',
    image: flowers
  },
];

const navigationTargets = {
  1: 'Vegetable List',
  2: 'Fruit List',
  3: 'Spice List',
  4: 'Seedling List',
  5: 'Plant List',
  6: 'Flower List'
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
