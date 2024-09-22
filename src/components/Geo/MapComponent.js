import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from 'leaflet';

import { computeArea } from '../../js/functions/geoCalculations';


const MapComponent = ({ onAreaUpdate, geoJSONData, clearGeoJSONRef }) => {
  const position = [47.06, 15.44]; // Graz coordinates
  const [polygons, setPolygons] = useState([]);
  const featureGroupRef = useRef();
  const mapRef = useRef();

  const updateTotalArea = useCallback((newPolygons) => {
    const newTotalArea = newPolygons.reduce((sum, polygon) => sum + polygon.area, 0);
    onAreaUpdate(newTotalArea);
  }, [onAreaUpdate]);

  const onCreated = useCallback((e) => {
    const { layer } = e;
    const geoJSON = layer.toGeoJSON();
    const area = computeArea(geoJSON);

    setPolygons(prevPolygons => {
      const newPolygons = [...prevPolygons, { layer, area }];
      updateTotalArea(newPolygons);
      return newPolygons;
    });
  }, [updateTotalArea]);

  const onDeleted = useCallback((e) => {
    const { layers } = e;
    setPolygons(prevPolygons => {
      const newPolygons = prevPolygons.filter(polygon => !layers.hasLayer(polygon.layer));
      updateTotalArea(newPolygons);
      return newPolygons;
    });
  }, [updateTotalArea]);

  const clearAllPolygons = useCallback(() => {
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }
    updateTotalArea([]);
  }, [updateTotalArea]);

  useEffect(() => {
    clearGeoJSONRef.current = clearAllPolygons;
  }, [clearAllPolygons, clearGeoJSONRef]);

  useEffect(() => {
    if (geoJSONData) {
      // Add to map after clearing
      const currentFeatureGroup = featureGroupRef.current;
      currentFeatureGroup.clearLayers();
      const geoJSONLayer = L.geoJSON(geoJSONData).addTo(currentFeatureGroup);
      // Assign a unique ID to the layer
      const layerId = L.stamp(geoJSONLayer);
      const bounds = geoJSONLayer.getBounds();
      mapRef.current.fitBounds(bounds);

      // Calculate the are
      const area = computeArea(geoJSONData);

      setPolygons(prevPolygons => {
        const newPolygons = [...prevPolygons, { layer: geoJSONLayer, area, id: layerId }];
        updateTotalArea(newPolygons);
        return newPolygons;
      });

      // Update the total area
      updateTotalArea([{ area }]);
    }
  }, [geoJSONData, updateTotalArea]);

  return (
    <MapContainer ref={mapRef} center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position='topright'
          onCreated={onCreated}
          onDeleted={onDeleted}
          draw={{
            rectangle: true,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: true,
          }}
          edit={{ edit: false }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapComponent;