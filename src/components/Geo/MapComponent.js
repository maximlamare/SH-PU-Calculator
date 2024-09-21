import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import * as turf from '@turf/turf';


const MapComponent = ({ geoJSONData, clearGeoJSON, setArea }) => {
    const featureGroupRef = useRef();

    const handleCreated = (e) => {
        const layer = e.layer;
        const geoJSON = layer.toGeoJSON();
        const area = turf.area(geoJSON);
        setArea(area);
    };

    const handleDeleted = (e) => {
        const featureGroup = featureGroupRef.current;
        if (featureGroup) {
            e.layers.eachLayer(layer => {
                featureGroup.removeLayer(layer);
            });
        }
        setArea(null);
    };

    const MapUpdater = ({ geoJSONData }) => {
        const map = useMap();

        useEffect(() => {
            const featureGroup = featureGroupRef.current;

            if (geoJSONData && featureGroup) {
                // Clear previous layers if any
                featureGroup.clearLayers();
                const layer = L.geoJSON(geoJSONData);
                featureGroup.addLayer(layer);
                let bounds = layer.getBounds();
                if (bounds.isValid()) {
                    map.fitBounds(bounds);  // Zoom and center the map to fit the polygon
                }
                const area = turf.area(geoJSONData);
                console.log('Area:', area);
                setArea(area);

            }


        }, [geoJSONData, map]);
        return null;
    };

    useEffect(() => {
        if (clearGeoJSON) {
            clearGeoJSON.current = () => {
                const featureGroup = featureGroupRef.current;
                if (featureGroup) {
                    featureGroup.clearLayers();
                }
                setArea(null);
            };
        }
    }, [clearGeoJSON, setArea]);


    return (
        <div className="flex h-80vh"
        >

            <MapContainer
                style={{ height: '100%', width: '100%' }}
                center={[47.06, 15.44]}
                zoom={13}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                />
                <FeatureGroup ref={featureGroupRef}>
                    <EditControl
                        position="topright"
                        onCreated={handleCreated}
                        onDeleted={handleDeleted}
                        draw={{
                            rectangle: true,
                            circle: false,
                            circlemarker: false,
                            marker: false,
                            polyline: false,
                            polygon: true,
                        }}
                        edit={{
                            remove: true,
                        }}
                    />
                </FeatureGroup>
                <MapUpdater geoJSONData={geoJSONData} />
            </MapContainer>

        </div>

    );
};

export default MapComponent;