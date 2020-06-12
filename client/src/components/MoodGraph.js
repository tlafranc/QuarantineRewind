// Import libraries
import React from 'react';
import _ from 'lodash';
import axios from 'axios';
import * as d3 from 'd3';

class MoodGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    async componentDidMount() {
        try {
            const splineInterpolator = d3.interpolateBasis(this.props.songValencesFreq)
            const interpolatedFreq = d3.quantize(splineInterpolator, 80).map(d => +d.toFixed(3))

            // Code for creating bar graph using d3.js
            // URL: https://www.tutorialsteacher.com/d3js/create-bar-chart-using-d3js
            // Accessed on: 2020-06-10
            const svg = d3.select("#MoodGraph"),
                margin = 50,
                width = svg.attr("width") - margin,
                height = svg.attr("height") - margin;

            var xScale = d3.scaleBand().range ([0, width]).padding(0.1),
                yScale = d3.scaleLinear().range ([height, 0]);

            var g = svg.append("g")
               .attr("transform", `translate(${25}, ${12.5})`);

            xScale.domain(interpolatedFreq.map((d, i) => { return i }));
            yScale.domain([0, d3.max(interpolatedFreq, (d) => { return d; })]);
    
            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale));
    
            g.append("g")
                .call(d3.axisLeft(yScale).tickFormat((d) => {
                    return d;
                }).ticks(2));
    
    
            g.selectAll(".bar")
                .data(interpolatedFreq)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", (d, i) => { return xScale(i); })
                .attr("y", (d) => { return yScale(d); })
                .attr("width", xScale.bandwidth())
                .attr("height", (d) => { return height - yScale(d); });
            
        } catch(e) {
            console.error(e);
        }
    }

    render() {
        return (
            <div className="MoodGraphContainer">
                <svg id="MoodGraph" width="250" height="125"></svg>
            </div>
        );
    }
}

export default MoodGraph;