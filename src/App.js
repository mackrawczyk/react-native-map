import Mapbox from '@rnmapbox/maps';
import {StyleSheet, View, Image, Button, Pressable} from 'react-native';
import {useState, useRef} from 'react';

const markerTypes = {
    ambulance: 'ambulance',
    bell: 'bell',
    briefcase: 'briefcase',
    building: 'building',
    coffee: 'coffee',
    dollarSign: 'dollar-sign',
    eye: 'eye',
    fireExtinguisher: 'fire-extinguisher',
    flagCheckered: 'flag-checkered',
    glassMartini: 'glass-martini',
}

const markerIcons = {
    [markerTypes.ambulance]: require('../assets/markers/ambulance_6.png'),
    [markerTypes.bell]: require('../assets/markers/bell_6.png'),
    [markerTypes.briefcase]: require('../assets/markers/briefcase_6.png'),
    [markerTypes.building]: require('../assets/markers/building_6.png'),
    [markerTypes.coffee]: require('../assets/markers/coffee_6.png'),
    [markerTypes.dollarSign]: require('../assets/markers/dollar_sign_6.png'),
    [markerTypes.eye]: require('../assets/markers/eye_6.png'),
    [markerTypes.fireExtinguisher]: require('../assets/markers/fire_extinguisher_6.png'),
    [markerTypes.flagCheckered]: require('../assets/markers/flag_checkered_6.png'),
    [markerTypes.glassMartini]: require('../assets/markers/glass_martini_6.png'),
}

const App = () => {
    const [markers, setMarkers] = useState([]);
    const [userLocation, setUserLocation] = useState([18.6491484, 54.3514215]);
    const cameraRef = useRef(null);

    const clearMarkers = () => setMarkers([]);

    const addMarker = (type, coordinates) => setMarkers([...markers, {type, coordinates}]);

    const addRandomMarker = () => {
        const randomType = Object.values(markerTypes)[Math.floor(Math.random() * Object.values(markerTypes).length)];
        const distance = 0.1;
        const randomCoordinates = [
            userLocation[0] + Math.random() * distance - distance / 2,
            userLocation[1] + Math.random() * distance - distance / 2,
        ];
        addMarker(randomType, randomCoordinates);
    }

    const focusOnCoordinates = (coordinates) => {
        cameraRef.current.flyTo(coordinates, 500);
    }

    return (
        <View style={styles.page}>
            <Mapbox.MapView style={styles.map} >
                <Mapbox.UserLocation androidRenderMode={'gps'}
                                     animated={true}
                                     visible={true}
                                     onUpdate={({coords}) => setUserLocation([coords.longitude, coords.latitude])}
                                     showsUserHeadingIndicator={true} />
                <Mapbox.Camera
                    defaultSettings={{
                        centerCoordinate: userLocation,
                        zoomLevel: 14,
                    }}
                    minZoomLevel={10}
                    maxZoomLevel={20}
                    ref={cameraRef}
                />

                { markers.map(({type, coordinates}, index) => (
                    <Mapbox.MarkerView key={`marker-${index}`}
                                       allowOverlapWithPuck={true}
                                       allowOverlap={true}
                                       anchor={{x: 0.5, y: 1}}
                                       coordinate={coordinates}>
                        <Pressable onPress={() => focusOnCoordinates(coordinates) }>
                            <Image
                                source={markerIcons[type]}
                                style={{ height: 48, width: 48 }}
                            />
                        </Pressable>
                    </Mapbox.MarkerView>
                )) }
            </Mapbox.MapView>

            <View style={styles.actions}>
                <Button title={'Add marker'} onPress={addRandomMarker} />
                <Button title={'Clear markers'} onPress={clearMarkers} />
            </View>
        </View>
    );
}

export default App;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        flex: 1,
        height: '100vh',
        width: '100%',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        padding: 16,
    }
});