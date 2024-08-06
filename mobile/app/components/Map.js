// Map.js
import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Icon } from "react-native-elements";
import { styled } from "nativewind";

const Map = ({ currentLocation, onLocationSelect: handleLocationSelect }) => {
  const [position, setPosition] = useState(currentLocation);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!currentLocation) {
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
  }, [currentLocation]);

  const recenterMap = () => {
    if (mapRef.current && currentLocation) {
      mapRef.current.animateToRegion({
        ...currentLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },1000);
      setPosition(currentLocation);
      handleLocationSelect(currentLocation);
    }
  };

  return (
    <>
      <MapView
        ref={mapRef}
        className="h-50 w-full"
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: position?.latitude || 37.78825,
          longitude: position?.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(e) => {
          setPosition(e.nativeEvent.coordinate);
          handleLocationSelect(e.nativeEvent.coordinate);
        }}
      >
        {position && <Marker coordinate={position} />}
      </MapView>
      <TouchableOpacity onPress={recenterMap} className="">
        <Icon name="my-location" type="material" color="pink" />
      </TouchableOpacity>
      <TouchableOpacity className="absolute top-2.5 left-1/2 transform -translate-x-1/2 bg-green-600 py-1 px-4 rounded-full">
        <Text className="text-white text-sm">Move to edit location</Text>
      </TouchableOpacity>
    </>
  );
};

export default styled(Map);
