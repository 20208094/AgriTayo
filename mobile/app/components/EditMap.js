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
          onPositionChange(e.nativeEvent.coordinate);
        }}
      >
        {position && <Marker coordinate={position} />}
      </MapView>
      <TouchableOpacity onPress={recenterMap}>
        <Icon name="my-location" type="material" color="pink" />
      </TouchableOpacity>
    </>
  );
};

export default styled(EditMap);
