import * as turf from '@turf/turf';

const getBounds = (geoJSONData) => {
    return turf.bbox(geoJSONData);
}

const calculateHeightWidth = (bounds) => {
    const options = {
        units: 'meters'
    }
    let startPoint = turf.point([bounds[0], bounds[1]]);
    let HeightMax = turf.point([bounds[0], bounds[3]]);
    let WidthMax = turf.point([bounds[2], bounds[1]]);
    
    let height = turf.distance(startPoint, HeightMax, options);
    let width = turf.distance(startPoint, WidthMax, options);
    return { height, width };
}

const bboxHeightWidth = (geoJSONData) => {
    let bounds = getBounds(geoJSONData);
    let dimensions = calculateHeightWidth(bounds);
    return dimensions;
}

const computeArea = (geoJSONData) => {
    return turf.area(geoJSONData);
}

export { bboxHeightWidth, computeArea };
