import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function PlantCategoryListScreen({navigation}){
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
            name: "Bamboo Plant"
        }
    ]
    return(
        <SafeAreaView className=''>
            {plantsCategory.map(plant =>
                <TouchableOpacity
                key={plant.id}
                className=''
                onPress={() => navigation.navigate('Plant Category', {plantsCategory, selectedPlantId: plant.id})}
                >
                    <Text className=''>{plant.name}</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    )
}

export default PlantCategoryListScreen