"use strict";


/**
 * Entry
 * @typedef {[string, any]} Entry - Dict entry
 */

module.exports = {
    /**
     * @param {number} num
     * @param {number} decimalPlaces
     * @returns {number}
     */
    round: (num, decimalPlaces = 2) => parseFloat(num.toFixed(decimalPlaces)),

    /**
     * @param {Object} dict - Example: { a: 'car', b: 'bus' }
     * @param {(Entry[]) => Entry[]} transformation
     * @returns {Object} - A dictionary
     */
    iteratableObject: (dict = {}, transformation = (entries) => entries) => {
        const entries = Object.entries(dict);
        const transformedEntries = transformation(entries);
        return transformedEntries.reduce((newDict, [key, entry]) => ({
                ...newDict,
                [key]: entry
            }),
            {}
        );
    }
};