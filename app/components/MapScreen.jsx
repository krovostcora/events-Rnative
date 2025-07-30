import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';

export default function MapScreen({ route, navigation }) {
    const { onSelect } = route.params;

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
        <style>
          #map { height: 100%; width: 100%; }
          body, html { margin: 0; padding: 0; height: 100%; }
        </style>
        <link href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" rel="stylesheet"/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([50.4501, 30.5234], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
          }).addTo(map);

          var marker;

          map.on('click', function(e) {
            var lat = e.latlng.lat.toFixed(6);
            var lng = e.latlng.lng.toFixed(6);
            if (marker) map.removeLayer(marker);
            marker = L.marker([lat, lng]).addTo(map).bindPopup("Selected").openPopup();
            window.ReactNativeWebView.postMessage(lat + "," + lng);
          });
        </script>
      </body>
    </html>
  `;

    const handleMessage = (event) => {
        const coords = event.nativeEvent.data;
        if (onSelect) onSelect(coords);  // викликає функцію з попереднього екрана
        navigation.goBack();             // повертаємось назад
    };

    return (
        <View style={styles.container}>
            <WebView
                originWhitelist={['*']}
                source={{ html }}
                onMessage={handleMessage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
