import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';
function ChartSampleLine({ data }) {
  const svgRef = useRef(null);

  useEffect(() => {
    console.log(data);
    data.forEach((d, i) => {
      d.timestamp = new Date(d.timestamp);
      d.value = Number(d.value);
    });
    data.sort((a, b) => a.timestamp - b.timestamp);
    let margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 1500 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;

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
          return d.timestamp;
        })
      )
      .range([0, width]);

    let xAxis = svg
      .append('g')
      .attr('transform', 'translate(0 ' + height + ')')
      .call(d3.axisBottom(x));

    let y = d3
      .scaleLinear()
      .domain([
        -10,
        d3.max(data, function (d) {
          return d.value;
        }),
      ])
      .range([height, 0]);
    let yAxis = svg.append('g').call(d3.axisLeft(y));

    //use .nest()function to group data so the line can be computed for each group
    const sumstat = d3.group(data, (d) => d.subcarrier); // nest function allows to group the calculation per level of a factor

    console.log(sumstat);

    // color palette
    const color = d3
      .scaleOrdinal()
      .range([
        '#e41a1c',
        '#377eb8',
        '#4daf4a',
        '#984ea3',
        '#ff7f00',
        '#ffff33',
        '#a65628',
        '#f781bf',
        '#999999',
      ]);

    // Draw the line
    let lines = svg
      .selectAll('.line')
      .data(sumstat)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', function (d) {
        return color(d[0]);
      })
      .attr('stroke-width', 1)
      .attr('d', function (d) {
        return d3
          .line()
          .x(function (d) {
            return x(d.timestamp);
          })
          .y(function (d) {
            return y(+d.value);
          })(d[1]);
      });
  }, [data]);

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
}

export default React.memo(ChartSampleLine);
