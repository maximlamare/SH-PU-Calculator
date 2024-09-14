
export const isFeatureCollection = (parsedGeometry) => parsedGeometry.type === 'FeatureCollection';
export const isFeature = (parsedGeometry) => parsedGeometry.type === 'Feature';
export const isPolygon = (geometry) => geometry?.type === 'Polygon' ?? false;


export const appendPolygon = (currentGeometry, newPolygon) => {
    if (isPolygon(currentGeometry)) {
        return {
            type: 'MultiPolygon',
            coordinates: [currentGeometry.coordinates, newPolygon.coordinates],
        };
    }
};

export const getFeatureCollectionMultiPolygon = (featureCollection) => {
    const { features } = featureCollection;
    let currentGeo = features[0].geometry;
    for (let feature of features.slice(1)) {
        currentGeo = appendPolygon(currentGeo, feature.geometry);
    }
    return currentGeo;
};
