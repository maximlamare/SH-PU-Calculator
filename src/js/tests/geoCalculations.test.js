const {
    calculateHeightWidth,
    calculatePixelSize,
    getBounds,
    computeArea,
    calculateAutoDimensions,
} = require("../functions/geoCalculations");
const turf = require("@turf/turf");

// BBox of 10x10m
const bbox10 = [0, 0, 0.00009, 0.00009];
const bbox20 = [-0.00009, -0.00009, 0.00009, 0.00009];

// Triangle with 10m side
const triang = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {},
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [0, 0],
                        [0.00009, 0],
                        [0.000045, 0.00009],
                        [0, 0],
                    ],
                ],
            },
        },
    ],
};

describe("Height and width calculations", () => {
    test("Test Height and Width of 10x10m", () => {
        const heightWidth = calculateHeightWidth(bbox10);
        expect(Number(heightWidth.height.toFixed(0))).toBe(10);
        expect(Number(heightWidth.width.toFixed(0))).toBe(10);
    });

    test("Test Height and Width of 20x20m", () => {
        const heightWidth = calculateHeightWidth(bbox20);
        expect(Number(heightWidth.height.toFixed(0))).toBe(20);
        expect(Number(heightWidth.width.toFixed(0))).toBe(20);
    });
});

describe("Pixel size calculations", () => {
    test("10x10m pixel size of 1m", () => {
        const pixels = calculatePixelSize(bbox10, 1);
        expect(pixels).toStrictEqual([10, 10]);
    });
    test("10x10m pixel size of 5m", () => {
        const pixels = calculatePixelSize(bbox10, 5);
        expect(pixels).toStrictEqual([2, 2]);
    });
    test("20x20m pixel size of 5m", () => {
        const pixels = calculatePixelSize(bbox20, 5);
        expect(pixels).toStrictEqual([4, 4]);
    });
    test("20x20m pixel size of 10m", () => {
        const pixels = calculatePixelSize(bbox20, 10);
        expect(pixels).toStrictEqual([2, 2]);
    });
});

describe("Bbox around a triangle", () => {
    const triangleBounds = getBounds(triang);

    test("Triangle bbox", () => {
        expect(triangleBounds).toStrictEqual([0, 0, 0.00009, 0.00009]);
    });
    test("Triangle bbox pixels", () => {
        const pixels = calculatePixelSize(triangleBounds, 1);
        expect(pixels).toStrictEqual([10, 10]);
    });
});

describe("Area calculations", () => {
    test("10x10m box", () => {
        const poly = turf.bboxPolygon(bbox10);
        expect([
            Math.floor(computeArea(poly)),
            Math.ceil(computeArea(poly)),
        ]).toContain(100);
    });
    test("20x20m box", () => {
        const poly = turf.bboxPolygon(bbox20);
        expect([
            Math.floor(computeArea(poly)),
            Math.ceil(computeArea(poly)),
        ]).toContain(400);
    });
    test("Triangle bounds ", () => {
        const triangleBounds = getBounds(triang);
        const poly = turf.bboxPolygon(triangleBounds);
        expect([
            Math.floor(computeArea(poly)),
            Math.ceil(computeArea(poly)),
        ]).toContain(100);
    });
});

describe("Auto dimensions", () => {
    test("Triangle autodimensions", () => {
        expect(calculateAutoDimensions(triang, 1)).toStrictEqual([10, 10]);
    });
    test("Bbox10 autodimensions", () => {
        const poly = turf.bboxPolygon(bbox10);
        expect(calculateAutoDimensions(poly, 1)).toStrictEqual([10, 10]);
    });
    test("Bbox20 autodimensions", () => {
        const poly = turf.bboxPolygon(bbox20);
        expect(calculateAutoDimensions(poly, 1)).toStrictEqual([20, 20]);
    });
});
