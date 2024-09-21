const { areaPUs, inputBandPUs, dataTypeContributor, samplesContributor, totalPuContribution } = require('../functions/puContributors');


describe('Test PU area contribution', () => {

    test('Test PU area of 0', () => {
        expect(areaPUs(0, 1)).toBe(0);
    });

    test('Test PU area under minimum', () => {
        expect(areaPUs(Math.pow(512, 2), 100)).toBe(0.01);
    });

    test('Test PU area 512x512', () => {
        expect(areaPUs(Math.pow(512, 2), 1)).toBe(1);
    });

    test('Test PU area 1024', () => {
        expect(areaPUs(Math.pow(1024, 2), 1)).toBe(4);
    });
});

describe('Input output contributions', () => {
    const inputBands = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30];

    inputBands.forEach(item =>
        test(`Test input bands: ${item}`, () => {
            expect(inputBandPUs(item)).toBe(item / 3);
        })
    )
});

describe('Data type contributions', () => {
    test('Test 32bit data type', () => {
        expect(dataTypeContributor('32bit')).toBe(2);
    });

    test('Test 16bit data type', () => {
        expect(dataTypeContributor('16bit')).toBe(1);
    });

    test('Test 8bit data type', () => {
        expect(dataTypeContributor('8bit')).toBe(1);
    });

    test('Test invalid data type', () => {
        expect(() => dataTypeContributor('4bit')).toThrow(Error);
    });
});

describe('Output samples contribution', () => {
    const samples = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));

    samples.forEach(item =>
        test(`Test output number of samples: ${item}`, () => {
            expect(samplesContributor(item)).toBe(item);
        })
    )
});

describe('Total PU contribution', () => {
    test('Test with area', () => {
        expect(totalPuContribution(Math.pow(1024, 2), 1, 3, "8bit", 1)).toBe(4);
    });

    test('Test with resolution', () => {
        expect(totalPuContribution(Math.pow(512, 2), 10, 3, "8bit", 1)).toBe(0.01);
    });

    test('Test with input', () => {
        expect(totalPuContribution(Math.pow(512, 2), 1, 6, "8bit", 1)).toBe(2);
    });

    test('Test with data type', () => {
        expect(totalPuContribution(Math.pow(512, 2), 1, 3, "32bit", 1)).toBe(2);
    });

    test('Test with outputs', () => {
        expect(totalPuContribution(Math.pow(512, 2), 1, 3, "16bit", 12)).toBe(12);
    });

    test('Test with too small', () => {
        expect(totalPuContribution(1, 1, 1, "16bit", 1)).toBe(0.005);
    });

});

