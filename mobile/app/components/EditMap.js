import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Icon } from "react-native-elements";
import { styled } from "nativewind";

const EditMap = ({ initialPosition, onPositionChange, selectedAddress }) => {
  const [position, setPosition] = useState(initialPosition);
  const mapRef = React.useRef(null);

  useEffect(() => {
    if (!initialPosition) {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Location Permission Denied",
            "Permission to access location was denied"
          );
          return;
        }

        let { coords } = await Location.getCurrentPositionAsync({});
        setPosition({ latitude: coords.latitude, longitude: coords.longitude });
      })();
    }
  }, [initialPosition]);

  const recenterMap = () => {
    if (mapRef.current && selectedAddress) {
      const { latitude, longitude } = selectedAddress;
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
      setPosition(selectedAddress);
      onPositionChange(selectedAddress);
    }
  };

  return (
    <View className="relative h-60 w-full">
      <MapView
        ref={mapRef}
        className="h-full w-full"
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: position?.latitude || 37.78825,
          longitude: position?.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(e) => {
          setPosition(e.nativeEvent.coordinate);
          onPositionChange(e.nativeEvent.coordinate);
        }}
      >
        {position && <Marker coordinate={position} />}
      </MapView>
      {/* Centered recenter button */}
      <TouchableOpacity
        onPress={recenterMap}
        className="absolute bottom-4 right-2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg"
      >
        <Icon name="my-location" type="material" color="green" size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default styled(EditMap);
