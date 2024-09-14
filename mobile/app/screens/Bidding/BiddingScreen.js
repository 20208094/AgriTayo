import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import logo from "../../assets/logo.png";
import ehh from "../../assets/ehh.png";
import { useNavigation } from "@react-navigation/native";

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const dummyData = [
  {
    id: 1,
    name: "Potato",
    currentHighestBid: 1000,
    price: 500,
    description:
      "Lorem ipsum dolor sit amet. In veritatis consequatur eos veritatis nihil eum magni dignissimos in delectus praesentium.",
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
    description:
      "Lorem ipsum dolor sit amet. In veritatis consequatur eos veritatis nihil eum magni dignissimos.",
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
    description:
      "Lorem ipsum dolor sit amet. In veritatis consequatur eos veritatis nihil eum magni dignissimos in delectus praesentium. Id eligendi quia vel nostrum minima sit dicta natus qui consectetur voluptatem et libero laboriosam ut nisi voluptatem rem nesciunt sequi.",
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
    description:
      "Lorem ipsum dolor sit amet. In veritatis consequatur eos veritatis nihil eum magni dignissimos in delectus praesentium. Id eligendi quia vel nostrum minima sit dicta natus qui consectetur voluptatem et libero laboriosam ut nisi voluptatem rem nesciunt sequi.",
    day: 2,
    hour: 4,
    minutes: 6,
    pic: logo,
    michael: ehh,
    shopName: 'Michael Shop'
  },
  // More items here
];

const BiddingCard = ({ data }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Bidding Details", { data })}
      style={{
        width: screenWidth * 0.85,  // Card width: 85% of screen width
        marginHorizontal: screenWidth * 0.075, // Center it properly
        backgroundColor: '#ffffff', // Light background color
        borderRadius: 15, // Rounded corners
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        marginBottom: 20,
      }}
    >
      {/* Card Header (Image) */}
      <View style={{ borderTopLeftRadius: 15, borderTopRightRadius: 15, overflow: 'hidden' }}>
        <Image
          source={data.pic}
          style={{ width: '100%', height: screenHeight * 0.6 }} // Large image, 40% of screen height
          resizeMode="cover"
        />
      </View>

      {/* Card Body */}
      <View style={{ padding: 20 }}>
        {/* Title */}
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 8 }}>
          {data.name}
        </Text>

        {/* Shop name */}
        <Text style={{ fontSize: 14, color: '#777', marginBottom: 10 }}>
          Sold by: {data.shopName}
        </Text>

        {/* Highest Bid */}
        <Text style={{ fontSize: 18, color: '#008000', marginBottom: 5 }}>
          Current Highest Bid: ₱{data.currentHighestBid}
        </Text>

        {/* Countdown */}
        <Text style={{ fontSize: 16, color: '#555' }}>
          {data.day}d {data.hour}h {data.minutes}m
        </Text>
      </View>
    </TouchableOpacity>
  );
};

function BiddingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7', paddingVertical: 20 }}>
      <FlatList
        data={dummyData}
        renderItem={({ item }) => <BiddingCard data={item} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={screenWidth * 0.95} // Space between cards
        contentContainerStyle={{ paddingHorizontal: screenWidth * 0.05 }}
      />
    </SafeAreaView>
  );
}

export default BiddingScreen;
