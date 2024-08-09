import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function SpiceCategoryListScreen({navigation}){
    const spicesCategory = [
        {
            id: 1,
            name: 'Turmeric'
        },
        {
            id: 2,
            name: 'Cumin'
        },
        {
            id: 3, 
            name: 'Pepper'
        },
        {
            id: 4,
            name: 'Cinnamon'
        },
        {
            id: 5,
            name: 'Coriander'
        },
        {
            id: 6,
            name: 'Ginger'
        },
        {
            id: 7,
            name: 'Clove'
        },
        {
            id: 8,
            name: 'Cardamom'
        },
        {
            id: 9,
            name: 'Fennel'
        },
        {
            id: 10,
            name: 'Mustard Seed'
        }
    ]
    return(
        <SafeAreaView className=''>
            {spicesCategory.map(spice =>
                <TouchableOpacity 
                key={spice.id}
                className=''
                onPress = {() => navigation.navigate('Spices Category', {spicesCategory, selectedSpiceId: spice.id})}
                >
                    <Text className=''>{spice.name}</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    )
}

export default SpiceCategoryListScreen