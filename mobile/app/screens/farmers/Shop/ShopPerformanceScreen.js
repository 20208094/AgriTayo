import React from 'react'
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native'

function ShopPerformaceScreen({navigation}){
    return(
        <SafeAreaView className=''>
            <View className=''>
                <Text className=''>All your Performance</Text>
                <TouchableOpacity className='' onPress={() => navigation.navigate('Shop Rating')}>
                    <Text className=''>Shop Rating</Text>
                </TouchableOpacity>
                <TouchableOpacity className='' onPress={() => navigation.navigate('Bussiness Insights')}>
                    <Text className=''>Business Insights</Text>
                </TouchableOpacity>
                <TouchableOpacity className='' onPress={() => navigation.navigate('Account Health')}>
                    <Text className=''>Account Health</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ShopPerformaceScreen