export function areaPUs(height, width) {
    /**
     * Computes the contribution based on a given area (in m2) and a resolution.
     *
     * @param {number} height - Height of the AOI in pixels
     * @param {number} width - Width of the AOI in pixels.
     * @returns {number} Contribution factor for the AOI.
     */
    return width === 0 || height === 0
        ? 0
        : Math.max(((height * width) / 512 ** 2).toFixed(2), 0.01);
}

export function inputBandPUs(numInputBands) {
    /**
     * Computes the contribution based on input bands.
     *
     * @param {number} numInputBands - The number of input bands.
     * @returns {number} Contribution factor based on input bands.
     */
    return numInputBands / 3;
}

export function dataTypeContributor(dataType) {
    /**
     * Computes the contribution based on data type.
     *
     * @param {string} dataType - The data type.
     * @returns {number} Contribution factor based on data type.
     * @throws {Error} If dtype is not "32bit", "16bit", or "8bit".
     */
    if (dataType === "32bit") {
        return 2;
    }
    if (dataType === "16bit" || dataType === "8bit") {
        return 1;
    }
    throw new Error(`Invalid data type. Expected "32bit", "16bit", or "8bit".`);
}

export function samplesContributor(dataSamples) {
    /**
     * Computes the contribution based on data samples.
     *
     * @param {number} dataSamples - The number of data samples.
     * @returns {number} Contribution based on data samples.
     */
    return dataSamples;
}

export function totalPuContribution(
    height,
    width,
    numInputBands,
    dtype,
    dataSamples,
) {
    /**
     * Calculates the total Processing Unit (PU) contribution based on various factors.
     *
     * @param {number} height - Height of the Area of Interest (AOI) in pixels.
     * @param {number} width - Width of the AOI in pixels.
     * @param {number} numInputBands - Number of input bands in the evalscript.
     * @param {string} dtype - Data type of the output ("32bit", "16bit", or "8bit").
     * @param {number} dataSamples - Number of data samples or output rasters.
     * @returns {number} The total PU contribution, with a minimum value of 0.005.
     *
     * @description
     * This function calculates the total PU contribution by considering four main factors:
     * 1. Area contribution (based on height and width)
     * 2. Input band contribution
     * 3. Data type contribution
     * 4. Data samples contribution
     *
     * The final result is the product of all these contributions, with a minimum value of 0.005.
     */

    // Compute the total contribution of PUs
    const areaContrib = areaPUs(height, width);
    const inputBandContrib = inputBandPUs(numInputBands);
    const dtypeContrib = dataTypeContributor(dtype);
    const samplesContrib = samplesContributor(dataSamples);

    const totalContrib =
        areaContrib * inputBandContrib * dtypeContrib * samplesContrib;

    return Math.max(totalContrib, 0.005);
}

// module.exports = {
//     areaPUs,
//     inputBandPUs,
//     dataTypeContributor,
//     samplesContributor,
//     totalPuContribution,
// };
