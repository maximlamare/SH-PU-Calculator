import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapLogic from './MapLogic';

const MapComponent = ({ geoJSONData }) => {
    return (
        <MapContainer
            style={{ height: '500px', width: '100%' }}
            center={[51.505, -0.09]}
            zoom={13}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© OpenStreetMap contributors'
            />
            <MapLogic geoJSONData={geoJSONData} />
        </MapContainer>
    );
};

export default MapComponent;