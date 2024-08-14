import React from 'react';
import { View, Image, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import michael from "../../../assets/ehh.png";

function ViewShopScreen({ navigation, route }) {
    const { information } = route.params;

    return (
        <SafeAreaView className=''>
            <View className=''>
                <Image source={michael} className="w-24 h-24 rounded-full" />
                <Text className=''>{information.name}</Text>
                <Text className=''>{information.followers}</Text>
                <Text className=''>{information.verify}</Text>
                <TouchableOpacity className='' onPress={() => navigation.navigate('')}>
                    <Text className=''>Edit</Text>
                </TouchableOpacity>
            </View>
            <View className=''>
                <Text className=''>View Shop Contents</Text>
            </View>
        </SafeAreaView>
    );
}

export default ViewShopScreen;
