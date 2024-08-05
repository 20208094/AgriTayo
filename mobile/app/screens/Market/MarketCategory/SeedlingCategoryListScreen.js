import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function SeedlingCategotyList({navigation}) {
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
  return (
    <SafeAreaView className="">
      {seedlingsCategory.map((seedling) => (
        <TouchableOpacity
          key={seedling.id}
          className=""
          onPress={() =>
            navigation.navigate("Seedling Category", {
              seedlingsCategory,
              selectedSeedlingId: seedling.id,
            })
          }
        >
          <Text className="">{seedling.name}</Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}

export default SeedlingCategotyList;
