import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from 'leaflet';

import { computeArea } from '../../js/functions/geoCalculations';


const MapComponent = ({ onAreaUpdate, geoJSONData, clearGeoJSONRef, onGeoJSONUpdate }) => {
  const position = [47.06, 15.44]; // Graz coordinates
  const [polygons, setPolygons] = useState([]);  // eslint-disable-line no-unused-vars
  const featureGroupRef = useRef();
  const mapRef = useRef();


  const updateTotalArea = useCallback((newPolygons) => {
    const newTotalArea = newPolygons.reduce((sum, polygon) => sum + computeArea(polygon), 0);
    onAreaUpdate(newTotalArea);
  }, [onAreaUpdate]);

  const updateGeoJSON = useCallback((newPolygons) => {
    const mergedGeoJSON = {
      type: "FeatureCollection",
      features: newPolygons
    };
    onGeoJSONUpdate(mergedGeoJSON);

  }, [onGeoJSONUpdate]);

  const clearAllPolygons = useCallback(() => {
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }
    setPolygons([]);
    updateTotalArea([]);
    updateGeoJSON([]);
  }, [updateTotalArea, updateGeoJSON]);

  const onCreated = useCallback((e) => {
    const { layer } = e;

    const geoJSON = layer.toGeoJSON();

    setPolygons(prevPolygons => {
      const newPolygons = [...prevPolygons, geoJSON];
      updateTotalArea(newPolygons);
      updateGeoJSON(newPolygons);
      return newPolygons;
    });
  }, [updateTotalArea, updateGeoJSON]);

  const onDeleted = useCallback((e) => {

    // // Assuming 'featureGroupRef' is your Leaflet FeatureGroup
    const allPolygons = featureGroupRef.current.getLayers()
    const geoPolys = allPolygons.map(polygon => polygon.toGeoJSON())
    let allFeatures = [];

    geoPolys.forEach(geoPoly => {
      if (geoPoly.type === "FeatureCollection") {
        allFeatures = allFeatures.concat(geoPoly.features);
        console.log(allFeatures)
      } else if (geoPoly.type === "Feature") {
        allFeatures.push(geoPoly);
      }
    });

    setPolygons(allFeatures);
    updateTotalArea(allFeatures);
    updateGeoJSON(allFeatures);

  }, [setPolygons, updateTotalArea, updateGeoJSON]);


  useEffect(() => {
    if (geoJSONData) {
      const currentFeatureGroup = featureGroupRef.current;
      currentFeatureGroup.clearLayers();

      const geoJSONLayer = L.geoJSON(geoJSONData).addTo(currentFeatureGroup);

      const bounds = geoJSONLayer.getBounds();
      mapRef.current.fitBounds(bounds);

      const geoJSONpolygons = geoJSONData.features.filter(feature => {
        return feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon';
      });

      setPolygons(geoJSONpolygons)
      updateTotalArea(geoJSONpolygons);
      updateGeoJSON(geoJSONpolygons);

    }
  }, [geoJSONData, setPolygons, updateTotalArea, updateGeoJSON]);

  useEffect(() => {
    clearGeoJSONRef.current = clearAllPolygons;
  }, [clearAllPolygons, clearGeoJSONRef]);

  return (
    <MapContainer ref={mapRef} center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
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