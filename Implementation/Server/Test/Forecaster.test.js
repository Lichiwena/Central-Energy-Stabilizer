const assert = require('assert');
const forecaster = require('./../Forecaster.js');
const da = require('./../DatabaseAccessorGraph.js');

if (true) {
    describe('Forecaster', () => {
        it('demand: adding demand to a graph with 60 values', async () => {
            da.dropDatabase();
            let date = new Date(2010, 1, 24, 15, 21);

            let graph = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                            11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                            21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                            31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                            41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
                            51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
            let expectedGraphsLower = { graphId: "demandGraph-Y2010-M1-D24-H15", values: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                            10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                            20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
                            30, 31, 32, 33, 34, 35, 36, 37, 38, 39
            ] };
            let expectedGraphsUpper = { graphId: "demandGraph-Y2010-M1-D24-H16", values: [
                            40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
                            50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
                            60, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ] };
            let res = await forecaster.addDemand(date, graph);

            let lowerGraph = await da.getGraph("demandGraph-Y2010-M1-D24-H15");
            let upperGraph = await da.getGraph("demandGraph-Y2010-M1-D24-H16");

            assert(res === true && 
                JSON.stringify(lowerGraph.values) === JSON.stringify(expectedGraphsLower.values) && 
                JSON.stringify(upperGraph.values) === JSON.stringify(expectedGraphsUpper.values));
        });
        it('demand: adding demand to a graph with 5 values', async () => {
            da.dropDatabase();
            let date = new Date(2010, 1, 24, 15, 21);

            let graph = [1, 2, 3, 4, 5];
            let expectedGraphsLower = { graphId: "demandGraph-Y2010-M1-D24-H15", values: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 1, 2, 3, 4, 5, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ] };
            let expectedGraphsUpper = { graphId: "demandGraph-Y2010-M1-D24-H16", values: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ] };
            let res = await forecaster.addDemand(date, graph);

            let lowerGraph = await da.getGraph("demandGraph-Y2010-M1-D24-H15");
            let upperGraph = await da.getGraph("demandGraph-Y2010-M1-D24-H16");
/*
            console.log(res);
            console.log(lowerGraph.values);
            console.log(upperGraph.values);

            console.log(expectedGraphsLower.values);
            console.log(expectedGraphsUpper.values);
*/
            assert(res === true && 
                JSON.stringify(lowerGraph.values) === JSON.stringify(expectedGraphsLower.values) && 
                JSON.stringify(upperGraph.values) === JSON.stringify(expectedGraphsUpper.values));
        });
        it('demand: adding demand to a graph with no values', async () => {
            da.dropDatabase();
            let date = new Date(2010, 1, 24, 15, 21);

            let graph = [];
            let expectedGraphsLower = { graphId: "demandGraph-Y2010-M1-D24-H15", values: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ] };
            let expectedGraphsUpper = { graphId: "demandGraph-Y2010-M1-D24-H16", values: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ] };
            let res = await forecaster.addDemand(date, graph);

            let lowerGraph = await da.getGraph("demandGraph-Y2010-M1-D24-H15");
            let upperGraph = await da.getGraph("demandGraph-Y2010-M1-D24-H16");

            assert(res === true && 
                JSON.stringify(lowerGraph.values) === JSON.stringify(expectedGraphsLower.values) && 
                JSON.stringify(upperGraph.values) === JSON.stringify(expectedGraphsUpper.values));
        });
   });
}

