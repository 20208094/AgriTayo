import React from 'react'
import {SafeAreaView, View, Text} from 'react-native'

function ToReplyScreen(){
    const shops = [
        { id: 1, comment: "Comment A", rating: 4 },
        { id: 2, comment: "Comment B", rating: 3 },
        { id: 3, comment: "Comment C", rating: 5 },
      ];
    
      return (
        <SafeAreaView className="flex-1 p-4">
          {shops.map((shop) => (
            <View
              key={shop.id}
              className="flex-row items-center justify-between my-2"
            >
              <Text className="font-semibold">{shop.comment}</Text>
              <View className="flex-row">
                {[...Array(shop.rating)].map((_, i) => (
                  <Text key={i} className="text-yellow-500">
                    ★
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </SafeAreaView>
      );
}

export default ToReplyScreen