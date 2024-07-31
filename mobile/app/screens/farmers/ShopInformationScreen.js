import React from "react";
import { TextInput, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ShopInformationScreen({ route, navigation }) {
    const { profile } = route.params;
    return (
        <SafeAreaView className=''>
            <ScrollView className=''>
                <Text className=''>Shop Information</Text>
                <Text className=''>Business Information</Text>
                <Text className=''>Shop Name</Text>
                <TextInput
                    className=''
                    placeholder='Shop Name'
                />
                <TouchableOpacity 
                    className=''
                    onPress={() => navigation.navigate('')}
                >
                    <Text className=''>Pickup Address: {profile.address}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className=''
                    onPress={() => navigation.navigate('Email Authentication', {profile})}
                >
                    <Text className=''>Email: {profile.email}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className=''
                    onPress={() => navigation.navigate('Authentication', {profile})}
                >
                    <Text className=''>Phone number: {profile.phone}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className=''
                    onPress={() => navigation.goBack()}
                >
                    <Text className=''>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className=''
                    onPress={() => navigation.navigate('Business Information', {profile})}
                >
                    <Text className=''>Next</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ShopInformationScreen;
