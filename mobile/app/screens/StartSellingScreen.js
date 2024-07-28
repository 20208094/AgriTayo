import React from 'react'
import {Image, Text, TouchableOpacity} from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import ehh from "../assets/ehh.png";

function StartSelling({navigation, route}){
    const { profile } = route.params;
    return(
        <SafeAreaView className='flex-1  items-center'>
            <Image source={ehh} className='w-35 h-60' />
            <Text className=''>To get started, register as a seller by providing the necessary information</Text>
            <TouchableOpacity
            className=''
            onPress={() => navigation.navigate('Shop Information', {profile})}
            >
            <Text className=''>Start Registration</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default StartSelling