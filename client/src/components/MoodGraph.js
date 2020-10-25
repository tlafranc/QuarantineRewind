// Import libraries
import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

// Import CSS
import './MoodGraph.scss';

class MoodGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        this.drawGraph();
    }

    componentDidUpdate() {
        this.drawGraph();
    }

    drawGraph = _.debounce(() => {
        try {
            const { fontSize, songValencesData, timeRange } = this.props;
            const freqArray = songValencesData.freqArray;
            const medianValence = songValencesData.medianValence;
            const numBins = songValencesData.numBins;

            const splineInterpolator = d3.interpolateBasis(freqArray)
            const interpolatedFreq = d3.quantize(splineInterpolator, numBins).map(d => +d.toFixed(3))

            // Code for creating bar graph using d3.js
            // URL: https://www.tutorialsteacher.com/d3js/create-bar-chart-using-d3js
            // Accessed on: 2020-06-10
            const svg = d3.select(`#MoodGraph-${timeRange}`),
                leftSidePadding = fontSize * 2,
                rightSidePadding = fontSize,
                margin = 3 * fontSize,
                width = svg.attr("width") - leftSidePadding - rightSidePadding,
                height = svg.attr("height") - margin / 4 - (fontSize * 5 / 4);

            // Clear HTML
            svg.selectAll("*").remove();

            var xScale = d3.scaleBand().range([0, width]).padding(0.1),
                yScale = d3.scaleLinear().range ([height, 0]);
            xScale.domain(interpolatedFreq.map((d, i) => { return i }));
            yScale.domain([0, d3.max(interpolatedFreq, (d) => { return d; })]);

            var graphArea = svg.append("g")
               .attr("transform", `translate(${leftSidePadding}, ${fontSize * 3 / 4})`);

            const colors = d3.interpolateRdYlBu;
            const colorInterpHigh = 0.8;
            const colorInterpLow = 0.4;
    
            graphArea.selectAll(".bar")
                .data(interpolatedFreq)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", (d, i) => { return xScale(i); })
                .attr("y", (d) => { return yScale(d); })
                .attr("fill", (d, i) => { return colors(colorInterpHigh - i * (1 - colorInterpLow) / (numBins - 1)); })
                .attr("width", xScale.bandwidth())
                .attr("height", (d) => { return height - yScale(d) + 1; });

            const meanValance = svg.append("g")
                .attr("transform", `translate(${leftSidePadding}, ${fontSize * 3 / 4})`);

            meanValance.append("line")
                .attr("class", "meanValenceLine")
                .attr("x1", xScale(medianValence) + xScale.bandwidth() / 2)
                .attr("x2", xScale(medianValence) + xScale.bandwidth() / 2)
                .attr("y1", -fontSize / 2 + 2)
                .attr("y2", height + fontSize * 5 / 16)
                .style("stroke", colors(colorInterpHigh - medianValence * (1 - colorInterpLow) / (numBins - 1)))
                .style("stroke-width", xScale.bandwidth() * .5);

            meanValance.append("text")
                .attr("class", "meanValenceText")
                .attr("x", xScale(medianValence) + xScale.bandwidth() / 2)
                .attr("y", -fontSize / 2)
                .text("Average Mood")
                .attr("fill", colors(colorInterpHigh - medianValence * (1 - colorInterpLow) / (numBins - 1)))
                .attr("text-anchor", "middle");

            const xAxis = svg.append("g")
                .attr("transform", `translate(${leftSidePadding}, ${fontSize * 3 / 4})`);

            xAxis.append("text")
                .attr("class", "axisText")
                .attr("x", fontSize / 2)
                .attr("y", height)
                .text("Depressed")
                .attr("fill", colors(colorInterpHigh - 0.1))
                .attr("dominant-baseline", "text-before-edge");

            xAxis.append("text")
                .attr("class", "axisText")
                .attr("x", width - fontSize / 2)
                .attr("y", height)
                .text("Euphoric")
                .attr("fill", colors(colorInterpLow + 0.1))
                .attr("dominant-baseline", "text-before-edge")
                .attr("text-anchor", "end");

            const yAxis = svg.append("g")
                .attr("transform", `translate(${fontSize * 3 / 4}, ${fontSize * 3 / 4})`);

            yAxis.append("text")
                .attr("class", "axisText")
                .attr("x", -height / 2)
                .attr("y", 0)
                .text("Prevalence")
                .attr("fill", 'white')
                .attr("transform", "rotate(-90)")
                .attr("dominant-baseline", "text-before-edge")
                .attr("text-anchor", "middle");
        } catch(e) {
            console.error(e);
        }
    }, 50);

    render() {
        const { timeRange, width, height } = this.props;

        return (
            <div className="MoodGraphContainer">
                <svg id={`MoodGraph-${timeRange}`} className="MoodGraph" width={width} height={height}></svg>
            </div>
        );
    }
}

export default MoodGraph;