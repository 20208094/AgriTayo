import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function FruitCategoryListScreen({navigation}){
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
    return(
        <SafeAreaView className=''>
            {fruitsCategory.map(fruit =>
                <TouchableOpacity
                key = {fruit.id}
                className=''
                onPress={() => navigation.navigate('Fruit Category', {fruitsCategory, selectedFruitId: fruit.id})}
                >
                    <Text className=''>{fruit.name}</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    )
}

export default FruitCategoryListScreen