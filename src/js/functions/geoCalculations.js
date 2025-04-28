import * as turf from "@turf/turf";

export const getBounds = (geoJSONData) => {
    return turf.bbox(geoJSONData);
};

export const calculateHeightWidth = (bbox) => {
    const xDistance1 = measure(bbox[3], bbox[0], bbox[3], bbox[2]);
    const xDistance2 = measure(bbox[1], bbox[0], bbox[1], bbox[2]);
    const yDistance = measure(bbox[3], bbox[0], bbox[1], bbox[0]);

    return { width: Math.max(xDistance1, xDistance2), height: yDistance };
};

export const calculatePixelSize = (geometry, resolution) => {
    const bboxDimensions = calculateHeightWidth(geometry);
    return [
        Math.floor(bboxDimensions.width / resolution),
        Math.floor(bboxDimensions.height / resolution),
    ];
};

export const calculateAutoDimensions = (geoJSONData, resolution) => {
    const bounds = getBounds(geoJSONData);
    const pixelSize = calculatePixelSize(bounds, resolution);
    return pixelSize;
};

export const computeArea = (geoJSONData) => {
    return turf.area(geoJSONData);
};

// Haversine formula
export function measure(lat1, lon1, lat2, lon2) {
    // generally used geo measurement function
    const R = 6378.137; // Radius of earth in KM
    const dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
    const dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 1000; // meters
}
