'use strict';

const svgNS = "http://www.w3.org/2000/svg";
const horizontalTextOffset = 4; // how far ahead should the text be taken to be aligned center with line
const graphDrawValueSpeed = 10;


let drawingGraphValues = [];
let activeGraphs = [];

/*
    SECTION: graph definitions
*/

let mainGraph = {
    htmlElement: null,
    svgWidth: "95vw",
    svgHeight: "450px",
    svgId: "mainGraph",
    height: "450", //px
    width: null, //pw
    horizotalTextheight: 22, //px
    verticalTextWidth: 55, //px
    innerHeight: null,
    innerWidth: null,
    horizontalLines: 20,
    horizontalValue: "Kw",
    horizontalOrigin: 10,
    horizontalAmount: 20,
    verticalLines: 48,
    verticalValue: "time interval",
    verticalAmount: 24,
    lowerLimit: 1000,
    verticalTextOffset: 20, // how far back should the text be taken to be aligned center with line
    indexDeviderIntervalHorizontal: 4,
    indexDeviderIntervalVertical: 3
};

let demandGraphStyle = {
    steps: 1440 / 4, // must be of the formula 1440 / x (1440 % x must equal 0)
    style: "graphPathRed"
}

let otherDemandGraphStyle = {
    steps: 1440 / 4, // must be of the formula 1440 / x (1440 % x must equal 0)
    style: "graphPathGreen"
}


/*
    SECTION: testing
*/

function create24HProductionGraph(date) {
    let day = new Array(24);
    let d = date.getDate();
    for (var h = 0; h < 24; h++) {
        let values = new Array(60);
        for (var m = 0; m < 60; m++) {
            values[m] = getProdutionAt(d * 24 + h + m / 60);
        }
        day[h] = values;
    }
    return day;
}

function create24HDemandGraph(date) {
    let day = new Array(24);
    let d = date.getDate();
    for (var h = 0; h < 24; h++) {
        let values = new Array(60);
        for (var m = 0; m < 60; m++) {
            values[m] = getDemandAt(d * 24 + h + m / 60);
        }
        day[h] = values;
    }
    return day;
}

const scale = 1000;
const lift = 100;

function getDemandAt(x) {
    return (Math.sin(0.9 * x - 5) * 2.2 +
        Math.sin(1.4 * x - 0.2) * 1.3 +
        Math.sin(2.1 * x - 2) * 2.8 + lift) * scale;
}

function getProdutionAt(x) {
    return (Math.sin(2.7 * x + 3.3) * 0.8 +
        Math.sin((-0.5) * x + 1) * 2.7 +
        Math.sin(Math.sin(2.1 * x - 2) * 2.8) + lift) * scale;
}

function create24HSurplusGraph() {
    let newGraphProduction = create24HProductionGraph(new Date);
    let newGraphDemand = create24HDemandGraph(new Date);
    let surplusGraph = [];

    for (var h = 0; h < 24; h++) {
        let array = [];
        for (var m = 0; m < 60; m++) {
            array[m] = newGraphProduction[h][m] - newGraphDemand[h][m];
        }
        surplusGraph[h] = array;
    }
    return surplusGraph;
}

function createOther24HSurplusGraph() {
    let newGraphProduction = create24HProductionGraph(new Date);
    let newGraphDemand = create24HDemandGraph(new Date(1000));
    let surplusGraph = [];

    for (var h = 0; h < 24; h++) {
        let array = [];
        for (var m = 0; m < 60; m++) {
            array[m] = newGraphProduction[h][m] - newGraphDemand[h][m];
        }
        surplusGraph[h] = array;
    }
    return surplusGraph;
}

let firstTestGraphValues = [];








create24HSurplusGraph();
let newSurplusGraph = convertArray(create24HSurplusGraph());
let otherSurplusGraphValues = convertArray(createOther24HSurplusGraph());

drawGraph(mainGraph);



function drawGraph(graph) {

    drawSvgContainer(graph);
    getGraphSize(graph);
    drawGraphBackground(graph);
    drawGraphHorizontalLines(graph);
    drawGraphVerticalLines(graph);
    activeGraphs.push(graph.htmlElement);
    drawGraphValues(newSurplusGraph, demandGraphStyle, mainGraph);
    drawGraphValues(otherSurplusGraphValues, otherDemandGraphStyle, mainGraph);

}

function convertArray(graphValues) {

    let newGraph = [];

    for (var h = 0; h < graphValues.length; h++) {

        for (var m = 0; m < graphValues[h].length; m++) {
            newGraph.push(graphValues[h][m]);
        }
    }
    return newGraph;
}







/*
--------------------------------------------------------------------------------
END OF DEFINITIONS
________________________________________________________________________________
*/


function deleteActiveGraphs() {
    for (var i = drawingGraphValues.length - 1; i >= 0; i--) {
        clearInterval(drawingGraphValues[i]);
    }

    for (var i = activeGraphs.length - 1; i >= 0; i--) {
        activeGraphs[i].parentNode.removeChild(activeGraphs[i]);
    }
    activeGraphs = [];
    drawingGraphValues = [];
}

function drawSvgContainer(graph) {

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS(null, "width", graph.svgWidth);
    svg.setAttributeNS(null, "height", graph.svgHeight);
    svg.setAttributeNS(null, "id", graph.svgId);
    svg.setAttributeNS(null, "overflow", "visible");



    if (graph.svgId == "mainGraph") {
        document.getElementById("mainGraphContainer").appendChild(svg);
    }

    graph.htmlElement = svg;

}

/*
    SECTION: draw graphs in SVG
*/




function getGraphSize(graph) {
    graph.width = graph.htmlElement.clientWidth;
    graph.innerWidth = graph.width - graph.verticalTextWidth;
    graph.innerHeight = graph.htmlElement.clientHeight - graph.horizotalTextheight;
}

function drawGraphBackground(graph) {
    let background = document.createElementNS(svgNS, "rect");
    background.setAttributeNS(null, "x", graph.verticalTextWidth + "px");
    background.setAttributeNS(null, "y", 0);
    background.setAttributeNS(null, "width", graph.innerWidth + "px");
    background.setAttributeNS(null, "height", graph.innerHeight + "px");
    background.setAttributeNS(null, "class", "graphBackground");

    graph.htmlElement.appendChild(background);
}

function drawGraphVerticalLines(graph) {
    for (let lineOffset = 1; lineOffset <= graph.verticalLines; lineOffset++) {
        let offsetValue = lineOffset * graph.innerWidth / graph.verticalLines;

        let line = document.createElementNS(svgNS, "line");
        line.setAttributeNS(null, "x1", graph.verticalTextWidth + offsetValue + "px");
        line.setAttributeNS(null, "x2", graph.verticalTextWidth + offsetValue + "px");
        line.setAttributeNS(null, "y1", graph.innerHeight + "px");
        line.setAttributeNS(null, "y2", 0);

        if (lineOffset % (graph.indexDeviderIntervalVertical + 1) === 0) {
            drawGraphVerticalTextPoint(line, graph, lineOffset, offsetValue);

        } else {
            if (lineOffset === 1) {
                drawGraphVerticalTextPoint(line, graph, 0, 0);
            }
            line.setAttributeNS(null, "class", "graphBgLine");
        }
        graph.htmlElement.appendChild(line);
    }
}

function drawGraphVerticalTextPoint(line, graph, lineOffset, offsetValue) {
    line.setAttributeNS(null, "class", "graphBgLineDevider");

    let value = document.createElementNS(svgNS, "text");
    value.setAttributeNS(null, "class", "graphAxisValue");

    value.setAttributeNS(null, "y", graph.height + "px");

    if (graph.verticalValue != "time interval") {
        value.textContent = graph.verticalValue;
    } else {

        let verticalRelation = graph.verticalLines / graph.verticalAmount;

        if (lineOffset / verticalRelation < 10) {
            value.textContent = "0" + lineOffset / verticalRelation;

        } else {
            value.textContent = lineOffset / verticalRelation;
        }

        if (graph.innerWidth > graph.lowerLimit) {
            value.textContent += ":00";
            value.setAttributeNS(null, "x", graph.verticalTextWidth + offsetValue - graph.verticalTextOffset + "px");
        } else {
            value.setAttributeNS(null, "x", graph.verticalTextWidth + offsetValue - (graph.verticalTextOffset / verticalRelation) + "px");
        }
    }
    graph.htmlElement.appendChild(value);
}

function drawGraphHorizontalLines(graph) {
    for (let lineOffset = 1; lineOffset <= graph.horizontalLines; lineOffset++) {
        let line = document.createElementNS(svgNS, "line");
        let offsetValue = lineOffset * graph.innerHeight / graph.horizontalLines;
        line.setAttributeNS(null, "x1", graph.innerWidth + graph.verticalTextWidth + "px");
        line.setAttributeNS(null, "x2", graph.verticalTextWidth + "px");


        line.setAttributeNS(null, "y1", graph.innerHeight - offsetValue + "px");
        line.setAttributeNS(null, "y2", graph.innerHeight - offsetValue + "px");
        line.setAttributeNS(null, "class", "graphBgLine");

        if (lineOffset % (graph.indexDeviderIntervalHorizontal + 1) === 0) {
            drawGraphHorizontalTextPoint(line, graph, lineOffset, offsetValue);

        } else {
            if (lineOffset === 1) {
                drawGraphHorizontalTextPoint(line, graph, 0, 0);
            }
            line.setAttributeNS(null, "class", "graphBgLine");
        }
        graph.htmlElement.appendChild(line);
    }
}

function drawGraphHorizontalTextPoint(line, graph, lineOffset, offsetValue) {
    line.setAttributeNS(null, "class", "graphBgLineDevider");

    let value = document.createElementNS(svgNS, "text");
    value.setAttributeNS(null, "class", "graphAxisValue");
    value.setAttributeNS(null, "x", 0);
    value.setAttributeNS(null, "y", graph.innerHeight - offsetValue + horizontalTextOffset + "px");

    if (graph.horizontalValue != "time interval") {
        let verticalRelation = graph.horizontalLines / graph.horizontalAmount;
        value.textContent = (lineOffset / verticalRelation) - graph.horizontalOrigin + graph.horizontalValue;
    }

    graph.htmlElement.appendChild(value);
}

function drawGraphValues(graphValues, style, graph) {
    let previousHorizontalValue = graph.verticalTextWidth;

    let verticalOrigin = graph.innerHeight / (graph.horizontalAmount / (graph.horizontalAmount - graph.horizontalOrigin));

    let previousVerticalValue = verticalOrigin;
    let pathWidth = graph.innerWidth / style.steps;
    let previousPath = "M" + previousHorizontalValue + " " + previousVerticalValue;

    let path = document.createElementNS(svgNS, "path");
    path.setAttributeNS(null, "class", style.style)

    let valuesToSkip = graphValues.length / style.steps;


    displayNextValue(graphValues, 0, verticalOrigin, path, pathWidth, style, previousPath, previousVerticalValue, previousHorizontalValue, graph, valuesToSkip);



}

function displayNextValue(graphValues, valueIndex, verticalOrigin, path, pathWidth, style, previousPath, previousVerticalValue, previousHorizontalValue, graph, valuesToSkip) {

    let point;
    if(valueIndex === graphValues.length) {
        point = graphValues[valueIndex-1];
    } else {
        point = graphValues[valueIndex];
    }
    let pointValue = point / 1000 * (graph.innerHeight / graph.horizontalAmount);
    let newVerticalValue = verticalOrigin - pointValue;
    let newHorizontalValue;

    if(valueIndex !== 0){
        newHorizontalValue = previousHorizontalValue += pathWidth;
    } else {
        newHorizontalValue = previousHorizontalValue;
    }

    previousPath += " L" + newHorizontalValue + " " + newVerticalValue;

    path.setAttributeNS(null, "d", previousPath);

    previousVerticalValue = newVerticalValue;
    previousHorizontalValue = newHorizontalValue;

    graph.htmlElement.appendChild(path);

    valueIndex += valuesToSkip;

    if (valueIndex <= graphValues.length) {
        let newDrawingGraph = setTimeout(function() {
            displayNextValue(graphValues, valueIndex, verticalOrigin, path, pathWidth, style, previousPath, previousVerticalValue, previousHorizontalValue, graph, valuesToSkip)
        }, graphDrawValueSpeed);

        drawingGraphValues.push(newDrawingGraph);

    } else {
        let newVerticalValue = verticalOrigin;
        let newHorizontalValue = previousHorizontalValue;

        previousPath += " L" + newHorizontalValue + " " + newVerticalValue + " Z";

        path.setAttributeNS(null, "d", previousPath);
        path.setAttributeNS(null, "class", style.style + " graphFill")
        graph.htmlElement.appendChild(path)
    }

}