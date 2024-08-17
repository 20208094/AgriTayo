import React from 'react'
import {SafeAreaView, View, Text} from 'react-native'

function AllScreen(){
    const shops = [
        { id: 1, rating: "0.00"},
      ];
    
      return (
        <SafeAreaView className="flex-1 p-4">
          {shops.map((shop) => (
            <View
              key={shop.id}
              className="my-2"
            >
              <Text className="font-semibold">{shop.rating}</Text>
                  <Text className="text-yellow-500">
                    ★★★★★
                  </Text>
            </View>
          ))}
        </SafeAreaView>
      );
}

export default AllScreen