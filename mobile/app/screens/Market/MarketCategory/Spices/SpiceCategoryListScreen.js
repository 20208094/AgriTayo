import React from "react";
import { Text, TouchableOpacity, SafeAreaView, View, Image, ScrollView } from "react-native";
import { styled } from "nativewind";
import placeholderimg from "../../../../assets/placeholder.png"; // Import the placeholder image

function SpiceCategoryListScreen({ navigation }) {
    const spicesCategory = [
        { id: 1, name: 'Turmeric', image: placeholderimg },
        { id: 2, name: 'Cumin', image: placeholderimg },
        { id: 3, name: 'Pepper', image: placeholderimg },
        { id: 4, name: 'Cinnamon', image: placeholderimg },
        { id: 5, name: 'Coriander', image: placeholderimg },
        { id: 6, name: 'Ginger', image: placeholderimg },
        { id: 7, name: 'Clove', image: placeholderimg },
        { id: 8, name: 'Cardamom', image: placeholderimg },
        { id: 9, name: 'Fennel', image: placeholderimg },
        { id: 10, name: 'Mustard Seed', image: placeholderimg }
    ];

    return (
        <SafeAreaView className="flex-1 p-4 bg-gray-100">
            <ScrollView>
                <View className="flex-row flex-wrap -mx-2">
                    {spicesCategory.map(spice => (
                        <View key={spice.id} className="w-1/2 px-2 mb-4">
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Spices Category', {
                                    spicesCategory,
                                    selectedSpiceId: spice.id
                                })}
                                className="bg-white rounded-lg shadow-md"
                            >
                                <Image
                                    source={spice.image}
                                    className="w-full h-32 rounded-t-lg"
                                    resizeMode="cover"
                                />
                                <View className="p-4">
                                    <Text className="text-lg font-semibold text-gray-800">
                                        {spice.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default styled(SpiceCategoryListScreen);
