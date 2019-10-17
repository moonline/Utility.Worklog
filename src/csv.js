"use strict";

module.exports = class CSV {
    static isRowNotEmpty(row) {
        return !row.every(cell => cell == null || cell == '' || cell == undefined);
    }

    static isRowNotCommented(row) {
        return !row.startsWith('#');
    }

    constructor(file) {
        this.table = (file.content || '').split('\n')
            .filter(CSV.isRowNotCommented)
            .map(row => row.split(','))
            .filter(CSV.isRowNotEmpty);
    }

    /**
     * @return [headerCell1, headerCell2, headerCell3, ...][]
     */
    get headers() {
        return this.table[0] || [];
    }

    /**
     * @return [cell1, cell2, cell3, ...][]
     */
    get data() {
        return this.table.slice(1);
    }
    
    /**
     * @return {
     *  headerCell1: cell1,
     *  headerCell2: cell2,
     *  headerCell3: cell3,
     *  ...
     * }[]
     */
    get rows() {
        const headers = this.headers;
        return this.data.reduce((newRows, currentRow) => [
                ...newRows,
                currentRow.reduce((newCells, currentCell, cellIndex) => ({
                        ...newCells,
                        [headers[cellIndex].toLowerCase()]: currentCell
                }), {})
            ]
        ,[]);
    }
}