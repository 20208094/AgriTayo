import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import logo from "../../assets/logo.png";
import ehh from "../../assets/ehh.png";
import { useNavigation } from "@react-navigation/native";

const dummyData = [
  {
    id: 1,
    name: "Potato",
    currentHighestBid: 1000,
    price: 500,
    discription:
      "Lorem ipsum dolor sit amet. In veritatis consequatur eos veritatis nihil eum magni dignissimos in delectus praesentium. Id eligendi quia vel nostrum minima sit dicta natus qui consectetur voluptatem et libero laboriosam ut nisi voluptatem rem nesciunt sequi. In reprehenderit enim eum doloribus ullam sit ullam tenetur.",
    day: 1,
    hour: 2,
    minutes: 3,
    pic: logo,
    michael: ehh,
    shopName: 'Michael Shop'
  },
  {
    id: 2,
    name: "Patatas",
    currentHighestBid: 2000,
    price: 600,
    discription:
      "Lorem ipsum dolor sit amet. In veritatis consequatur eos veritatis nihil eum magni dignissimos in delectus praesentium. Id eligendi quia vel nostrum minima sit dicta natus qui consectetur voluptatem et libero laboriosam ut nisi voluptatem rem nesciunt sequi. In reprehenderit enim eum doloribus ullam sit ullam tenetur.",
    day: 4,
    hour: 5,
    minutes: 6,
    pic: logo,
    michael: ehh,
    shopName: 'Michael Shop'
  },
  {
    id: 3,
    name: "Cabbage",
    currentHighestBid: 3000,
    price: 700,
    discription:
      "Lorem ipsum dolor sit amet. In veritatis consequatur eos veritatis nihil eum magni dignissimos in delectus praesentium. Id eligendi quia vel nostrum minima sit dicta natus qui consectetur voluptatem et libero laboriosam ut nisi voluptatem rem nesciunt sequi. In reprehenderit enim eum doloribus ullam sit ullam tenetur.",
    day: 7,
    hour: 8,
    minutes: 9,
    pic: logo,
    michael: ehh,
    shopName: 'Michael Shop'
  },
  {
    id: 4,
    name: "Sitaw",
    currentHighestBid: 4000,
    price: 800,
    discription:
      "Lorem ipsum dolor sit amet. In veritatis consequatur eos veritatis nihil eum magni dignissimos in delectus praesentium. Id eligendi quia vel nostrum minima sit dicta natus qui consectetur voluptatem et libero laboriosam ut nisi voluptatem rem nesciunt sequi. In reprehenderit enim eum doloribus ullam sit ullam tenetur.",
    day: 2,
    hour: 4,
    minutes: 6,
    pic: logo,
    michael: ehh,
    shopName: 'Michael Shop'
  },
];

const BiddingCard = ({ data }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Bidding Details", { data })}
      className="bg-white rounded-lg shadow m-2 w-[44%] mb-5"
    >
      <View className="rounded-t-lg overflow-hidden">
        <Image source={data.pic} className="w-full h-28" />
      </View>
      <View className="p-2.5">
        <Text className="text-base font-bold mb-1.5">{data.name}</Text>
        <Text className="text-green-700 mb-1.5">
          Current Highest Bid: ₱{data.currentHighestBid}
        </Text>
        <Text className="text-gray-700 mb-1.5">
          {data.day}d {data.hour}h {data.minutes}m
        </Text>
      </View>
    </TouchableOpacity>
  );
};

function BiddingScreen() {
  return (
    <SafeAreaView className="">
      <View className="flex-row flex-wrap justify-between">
        {dummyData.map((data) => (
          <BiddingCard key={data.id} data={data} />
        ))}
      </View>
    </SafeAreaView>
  );
}

export default BiddingScreen;
