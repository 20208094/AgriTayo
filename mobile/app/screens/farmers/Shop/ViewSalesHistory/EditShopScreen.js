import React, { useState } from 'react';
import { SafeAreaView, TextInput, Text, TouchableOpacity, View } from 'react-native';

function EditShopScreen({route, navigation}) {
    const {information} = route.params
    const [shopName, setShopName] = useState('');
    const [shopDescription, setShopDescription] = useState('');

    return (
        <SafeAreaView className='flex-1 bg-white p-4'>
            <View className='mb-4'>
                <Text className='text-lg font-bold text-gray-700 mb-2'>Shop Name</Text>
                <TextInput
                    className='border border-gray-300 rounded-lg p-2 text-base'
                    placeholder= {information.name}
                    value={shopName}
                    onChangeText={setShopName}
                />
            </View>

            <View className='mb-4'>
                <Text className='text-lg font-bold text-gray-700 mb-2'>Shop Description</Text>
                <TextInput
                    className='border border-gray-300 rounded-lg p-2 text-base h-32 text-top'
                    placeholder="Enter shop description"
                    value={shopDescription}
                    onChangeText={setShopDescription}
                    multiline={true}
                />
            </View>

            <TouchableOpacity
                className='bg-[#00b251] p-3 rounded-lg'
                onPress={() => navigation.navigate('View Shop', {information})}
            >
                <Text className='text-white text-center text-md font-bold'>Save Shop</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default EditShopScreen;
