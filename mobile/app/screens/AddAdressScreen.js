import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

function AddAddressScreen({ route, onLocationSelect: handleLocationSelect = () => {} }) {
  const { currentLocation } = route.params;
  const [position, setPosition] = useState(currentLocation);

  useEffect(() => {
    if (!currentLocation) {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            // pagawa ako ng alert dito kasi naka console.log lang. Kung kaya
          console.log('Permission to access location was denied');
          return;
        }

        let { coords } = await Location.getCurrentPositionAsync({});
        setPosition({ latitude: coords.latitude, longitude: coords.longitude });
      })();
    }
  }, [currentLocation]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
            // pagawa din ako dito ng alert kung kaya
          console.log('Address confirmed:', position);
        }}
      >
        <Text style={styles.buttonText}>Confirm Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -0.5 * 200 }],
    width: 200,
    backgroundColor: '#00B251',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddAddressScreen;
