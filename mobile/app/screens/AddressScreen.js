import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

function AddressScreen({ route, navigation }) {
  const { profile } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setCurrentLocation({ latitude: coords.latitude, longitude: coords.longitude });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00B251" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="">
      <TouchableOpacity
        className=""
        onPress={() => navigation.navigate('View Address', { profile })}
      >
        <Text className="">
          Address: {"\n"} {profile.address}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className=""
        onPress={() => navigation.navigate('Add Address', { currentLocation })}
      >
        <Text className="">Add New Address</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default AddressScreen;
