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
      height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3
      .select(svgRef.current)
      .style('overflow', 'visible')
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
        0,
        d3.max(data, function (d) {
          return d.value;
        }),
      ])
      .range([height, 0]);
    let yAxis = svg.append('g').call(d3.axisLeft(y));

    //use .nest()function to group data so the line can be computed for each group
    const sumstat = d3.group(data, (d) => d.subcarrier); // nest function allows to group the calculation per level of a factor

    // 아.. 라인 조금만 짜르고싶은데 못하겠어 ㅋㅋㅋ 힝 바부얌
    // 일단 나중에 생각하고
    // 올리면 값나오는거 부터 생각해보자
    // 호버하면 값나옴 -> 거기서 시간 받아옴 --> 거기로 동영상 재생
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

    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    let tooltip = d3
      .select('#tooltip')
      .append('div')
      .style('opacity', 1)
      .attr('class', 'tooltip')
      .style('z-index', '10')
      .style('background-color', 'red')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px');

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    let mouseover = function (d) {
      tooltip.style('opacity', 1);
    };

    let mousemove = function (event, d) {
      console.log(d[1]);
      tooltip
        .html('timestamp' + d.timestamp)
        .style('left', d3.pointer(event, this)[0] + 90 + 'px') // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style('top', d3.pointer(event, this)[1] + 'px');
    };

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    let mouseleave = function (d) {
      tooltip.transition().duration(200).style('opacity', 0);
    };

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
            return y(d.value);
          })(d[1]);
      })
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave);
  }, [data]);

  return (
    <>
      <div id='tooltip'>
        <svg ref={svgRef}></svg>
      </div>
    </>
  );
}

export default React.memo(ChartSampleLine);
