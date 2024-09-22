import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from 'leaflet';

import { computeArea } from '../../js/functions/geoCalculations';


const MapComponent = ({ onAreaUpdate, geoJSONData }) => {
  const position = [47.06, 15.44]; // Graz coordinates
  const [polygons, setPolygons] = useState([]);
  const featureGroupRef = useRef();
  const mapRef = useRef();
  const updateTotalArea = useCallback((newPolygons) => {
    const newTotalArea = newPolygons.reduce((sum, polygon) => sum + polygon.area, 0);
    console.log('Updating total area to:', newTotalArea);
    onAreaUpdate(newTotalArea);
  }, [onAreaUpdate]);

  const onCreated = useCallback((e) => {
    const { layer } = e;
    const geoJSON = layer.toGeoJSON();
    const area = computeArea(geoJSON);
    console.log('Area of created polygon:', area);

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

  const onEdited = useCallback((e) => {
    const { layers } = e;
    setPolygons(prevPolygons => {
      const newPolygons = prevPolygons.map(polygon => {
        if (layers.hasLayer(polygon.layer)) {
          const newArea = computeArea(polygon.layer.toGeoJSON());
          return { ...polygon, area: newArea };
        }
        return polygon;
      });
      updateTotalArea(newPolygons);
      return newPolygons;
    });
  }, [updateTotalArea]);

  const clearAllPolygons = useCallback(() => {
    if (featureGroupRef.current) {
      console.log('Clearing all polygons');
      console.log(featureGroupRef.current);
      featureGroupRef.current.clearLayers();
    }
    updateTotalArea([]);

  }, [updateTotalArea]);

  useEffect(() => {
    if (geoJSONData === null) {
      clearAllPolygons();
    } else {
      // Add to map after clearing
      const currentFeatureGroup = featureGroupRef.current;
      currentFeatureGroup.clearLayers();
      const geoJSONLayer = L.geoJSON(geoJSONData).addTo(currentFeatureGroup);
      const bounds = geoJSONLayer.getBounds();
      mapRef.current.fitBounds(bounds);

      setPolygons(prevPolygons => {
        const newPolygons = [...prevPolygons, { geoJSONLayer, area }];
        updateTotalArea(newPolygons);
        return newPolygons;
      });

      // Calculate and update the area
      const area = computeArea(geoJSONData);
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
          onEdited={onEdited}
          draw={{
            rectangle: true,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: true,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapComponent;