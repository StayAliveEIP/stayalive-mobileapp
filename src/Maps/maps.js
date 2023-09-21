import React, { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { StyleSheet, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function Maps() {
  const [region, setRegion] = useState(null);

  const pinLocation = {
    latitude: 48.815788, // replace with the desired latitude (Currently Epitech)
    longitude: 2.363280, // replace with the desired longitude (Currently Epitech)
  };

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 }
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation={true}
        >
          <Marker coordinate={pinLocation} />
        </MapView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
