import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function FlowerCategoryListScreen({navigation}){
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
    return(
        <SafeAreaView className=''>
            {flowersCategory.map(flower =>
                <TouchableOpacity 
                className=''
                key={flower.id}
                onPress = {() => navigation.navigate('Flower Category', {flowersCategory, selectedFlowerId: flower.id})}
                >
                    <Text className=''>{flower.name}</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    )
}

export default FlowerCategoryListScreen