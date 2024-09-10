import { useEffect } from 'react';
import { useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import invertCoordinates from './utils/geometry';


const MapLogic = ({ geoJSONData }) => {
    const map = useMap();

    useEffect(() => {
        if (geoJSONData) {
            // Invert coordinates of Multipolygon
            const invertedCoords = invertCoordinates(geoJSONData.coordinates);
            // Create the feature group
            var group = L.featureGroup();

            // Convert the inverted coordinates to polygons and add them to the feature group
            invertedCoords.forEach(coords => {
                const polygon = L.polygon(coords);
                group.addLayer(polygon);
            });

            const bounds = group.getBounds()

            map.fitBounds(bounds);

        }
    }, [geoJSONData, map]);

    return geoJSONData ? <GeoJSON data={geoJSONData} /> : null;
};

export default MapLogic;