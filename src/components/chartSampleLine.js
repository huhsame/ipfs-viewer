import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

function ChartSampleLine({ data }) {
  const svgRef = useRef(null);

  useEffect(() => {
    console.log(data[0]);
    let margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 1000 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // X scale and Axis
    let x = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return new Date(d.timestamp);
        })
      )
      .range([0, width]);

    svg
      .append('g')
      .attr('transform', 'translate(0 ' + height + ')')
      .call(d3.axisBottom(x));

    let y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return Number(d.subcarrier_1);
        }),
      ])
      .range([height, 0]);
    svg.append('g').call(d3.axisLeft(y));

    svg
      .append('path')
      .datum(data.sort((a, b) => d3.ascending(a.timestamp, b.timestamp)))
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(new Date(d.timestamp));
          })
          .y(function (d) {
            return y(Number(d.subcarrier_1));
          })
      );
  }, [data]);

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
}

export default React.memo(ChartSampleLine);
