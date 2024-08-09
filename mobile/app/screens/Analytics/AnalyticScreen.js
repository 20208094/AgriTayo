import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

function AnalyticScreen({ navigation }) {
  const vegetablesCategory = [
    {
      id: 1,
      name: "Potato",
    },
    {
      id: 2,
      name: "Carrot",
    },
    {
      id: 3,
      name: "Tomato",
    },
    {
      id: 4,
      name: "Lettuce",
    },
    {
      id: 5,
      name: "Spinach",
    },
    {
      id: 6,
      name: "Broccoli",
    },
    {
      id: 7,
      name: "Onion",
    },
    {
      id: 8,
      name: "Cucumber",
    },
    {
      id: 9,
      name: "Bell Pepper",
    },
    {
      id: 10,
      name: "Zucchini",
    },
  ];

  const fruitsCategory = [
    {
      id: 1,
      name: "Apple",
    },
    {
      id: 2,
      name: "Banana",
    },
    {
      id: 3,
      name: "Orange",
    },
    {
      id: 4,
      name: "Strawberry",
    },
    {
      id: 5,
      name: "Grape",
    },
    {
      id: 6,
      name: "Mango",
    },
    {
      id: 7,
      name: "BlueBerry",
    },
    {
      id: 8,
      name: "Pineapple",
    },
    {
      id: 9,
      name: "Watermelon",
    },
    {
      id: 10,
      name: "Peach",
    },
  ];

  const spicesCategory = [
    {
      id: 1,
      name: "Turmeric",
    },
    {
      id: 2,
      name: "Cumin",
    },
    {
      id: 3,
      name: "Pepper",
    },
    {
      id: 4,
      name: "Cinnamon",
    },
    {
      id: 5,
      name: "Coriander",
    },
    {
      id: 6,
      name: "Ginger",
    },
    {
      id: 7,
      name: "Clove",
    },
    {
      id: 8,
      name: "Cardamom",
    },
    {
      id: 9,
      name: "Fennel",
    },
    {
      id: 10,
      name: "Mustard Seed",
    },
  ];

  const seedlingsCategory = [
    {
      id: 1,
      name: "Tomato Seedlings",
    },
    {
      id: 2,
      name: "Basil Seedlings",
    },
    {
      id: 3,
      name: "Sunflower Seedlings",
    },
    {
      id: 4,
      name: "Lettuce Seedlings",
    },
    {
      id: 5,
      name: "Cucumber Seedlings",
    },
    {
      id: 6,
      name: "Paper Seedlings",
    },
    {
      id: 7,
      name: "Marigold Seedlings",
    },
    {
      id: 8,
      name: "Mint Seedlings",
    },
    {
      id: 9,
      name: "Cilantaro Seedlings",
    },
    {
      id: 10,
      name: "Parsely Seedlings",
    },
  ];

  const plantsCategory = [
    {
      id: 1,
      name: "Spider Plant",
    },
    {
      id: 2,
      name: "Aloe Vera",
    },
    {
      id: 3,
      name: "Rose",
    },
    {
      id: 4,
      name: "Lavender",
    },
    {
      id: 5,
      name: "Snake Plant",
    },
    {
      id: 6,
      name: "Peace Lily",
    },
    {
      id: 7,
      name: "Pothos",
    },
    {
      id: 8,
      name: "Jade Plant",
    },
    {
      id: 9,
      name: "Hibiscus",
    },
    {
      id: 10,
      name: "Bamboo Plant",
    },
  ];

  const flowersCategory = [
    {
      id: 1,
      name: "Rose",
    },
    {
      id: 2,
      name: "Tulip",
    },
    {
      id: 3,
      name: "Marigold",
    },
    {
      id: 4,
      name: "Sunflower",
    },
    {
      id: 5,
      name: "Daisy",
    },
    {
      id: 6,
      name: "Lily",
    },
    {
      id: 7,
      name: "Orchid",
    },
    {
      id: 8,
      name: "Daffodil",
    },
    {
      id: 9,
      name: "Chrysanthemum",
    },
    {
      id: 10,
      name: "Peony",
    },
  ];
  return (
    <SafeAreaView className="">
      <ScrollView>
        <View className="">
          <Text className="">Vegetables</Text>
          {vegetablesCategory.map((vegetable) => (
            <TouchableOpacity
              key={vegetable.id}
              onPress={() =>
                navigation.navigate("Vegetable Analytics", {
                  vegetablesCategory,
                  selectedVegetableId: vegetable.id,
                })
              }
            >
              <Text>{vegetable.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="">
          <Text className="">Fruits</Text>
          {fruitsCategory.map((fruit) => (
            <TouchableOpacity
              key={fruit.id}
              className=""
              onPress={() =>
                navigation.navigate("Fruit Analytics", {
                  fruitsCategory,
                  selectedFruitId: fruit.id,
                })
              }
            >
              <Text className="">{fruit.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="">
          <Text className="">Spices</Text>
          {spicesCategory.map((spice) => (
            <TouchableOpacity
              key={spice.id}
              className=""
              onPress={() =>
                navigation.navigate("Spices Analytics", {
                  spicesCategory,
                  selectedSpiceId: spice.id,
                })
              }
            >
              <Text className="">{spice.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="">
          <Text className="">Seedlings</Text>
          {seedlingsCategory.map((seedling) => (
            <TouchableOpacity
              key={seedling.id}
              className=""
              onPress={() =>
                navigation.navigate("Seedling Analytics", {
                  seedlingsCategory,
                  selectedSeedlingId: seedling.id,
                })
              }
            >
              <Text className="">{seedling.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="">
          <Text className="">Plants</Text>
          {plantsCategory.map((plant) => (
            <TouchableOpacity
              key={plant.id}
              className=""
              onPress={() =>
                navigation.navigate("Plant Analytics", {
                  plantsCategory,
                  selectedPlantId: plant.id,
                })
              }
            >
              <Text className="">{plant.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="">
          <Text className="">Flowers</Text>
          {flowersCategory.map((flower) => (
            <TouchableOpacity
              className=""
              key={flower.id}
              onPress={() =>
                navigation.navigate("Flower Analytics", {
                  flowersCategory,
                  selectedFlowerId: flower.id,
                })
              }
            >
              <Text className="">{flower.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AnalyticScreen;
