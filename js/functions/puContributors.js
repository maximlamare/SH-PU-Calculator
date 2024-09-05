function areaPUs(area, resolution) {
    /**
     * Computes the contribution based on a given area (in m2) and a resolution.
     *
     * @param {number} area - Area of the AOI in m2.
     * @param {number} resolution - Resolution of the request in m.
     * @returns {number} Contribution factor for the AOI.
     */
    return area === 0 ? 0 : Math.max(area / Math.pow(resolution, 2) / Math.pow(512, 2), 0.01);
}

function inputBandPUs(numInputBands) {
    /**
     * Computes the contribution based on input bands.
     *
     * @param {number} numInputBands - The number of input bands.
     * @returns {number} Contribution factor based on input bands.
     */
    return numInputBands / 3;
}

function dataTypeContributor(dtype) {
    /**
     * Computes the contribution based on data type.
     *
     * @param {string} dtype - The data type.
     * @returns {number} Contribution factor based on data type.
     * @throws {Error} If dtype is not "32bit", "16bit", or "8bit".
     */
    if (dtype === "32bit") {
        return 2;
    } else if (dtype === "16bit" || dtype === "8bit") {
        return 1;
    } else {
        throw new Error('Invalid data type. Expected "32bit", "16bit", or "8bit".');
    }
}

function samplesContributor(dataSamples) {
    /**
     * Computes the contribution based on data samples.
     *
     * @param {number} dataSamples - The number of data samples.
     * @returns {number} Contribution based on data samples.
     */
    return dataSamples;
}

function totalPuContribution(area, resolution, numInputBands, dtype, dataSamples) {

    // Compute the total contribution of PUs
    let areaContrib = areaPUs(area, resolution);
    let inputBandContrib = inputBandPUs(numInputBands);
    let dtypeContrib = dataTypeContributor(dtype);
    let samplesContrib = samplesContributor(dataSamples);

    let totalContrib = areaContrib * inputBandContrib * dtypeContrib * samplesContrib;

    return Math.max(totalContrib, 0.005);
}

module.exports = { areaPUs, inputBandPUs, dataTypeContributor, samplesContributor, totalPuContribution };
