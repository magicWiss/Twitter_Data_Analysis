// line_chart.js

let currentData = null;
let xScale, yScale, line1, line2, line3;
let svg, chart, xAxis, yAxis, line1Path, line2Path, line3Path;

function draw_sentiment_line_chart(data, width, height) {
  
  // Set up the chart dimensions
  const current_width = width || window.innerWidth;
  const current_height = height || window.innerHeight;
  const margin = { top: 20, right: 10, bottom: 30, left: 50 };
  const chartWidth = current_width - margin.left - margin.right;
  const chartHeight = current_height - margin.top - margin.bottom;

  // Parse the timestamp format (if necessary)
  const parseDate = d3.timeParse("%Y-%m-%d");

  // Convert the data to the appropriate format
  currentData = data.map((d) => ({
    timestamp: parseDate(d.timestamp),
    positive: +d.positive,
    negative: +d.negative,
    medium: +d.medium,
  }));

  // Create the SVG element
  svg = d3
    .select("#sentiment")
    .append("svg")
    .attr("width", current_width - margin.left - margin.right)
    .attr("height", current_height)
    .attr("class", "svg_line_chart");

  // Create the chart group
  chart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Set the scales
  xScale = d3
    .scaleTime()
    .domain(d3.extent(currentData, (d) => d.timestamp))
    .range([0, chartWidth]);

  yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(currentData, (d) => Math.max(d.positive, d.negative, d.medium)),
    ])
    .range([chartHeight, 0]);

  // Define the line generators
  line1 = d3
    .line()
    .x((d) => xScale(d.timestamp))
    .y((d) => yScale(d.positive))
    .curve(d3.curveMonotoneX);

  line2 = d3
    .line()
    .x((d) => xScale(d.timestamp))
    .y((d) => yScale(d.negative))
    .curve(d3.curveMonotoneX);

  line3 = d3
    .line()
    .x((d) => xScale(d.timestamp))
    .y((d) => yScale(d.medium))
    .curve(d3.curveMonotoneX);

  // Draw the line charts
  line1Path = chart
    .append("path")
    .datum(currentData)
    .attr("class", "line green")
    .attr("d", line1)
    .style("fill", "none")
    .style("stroke", "green");

  line2Path = chart
    .append("path")
    .datum(currentData)
    .attr("class", "line red")
    .attr("d", line2)
    .style("fill", "none")
    .style("stroke", "red");

  line3Path = chart
    .append("path")
    .datum(currentData)
    .attr("class", "line orange")
    .attr("d", line3)
    .style("fill", "none")
    .style("stroke", "orange");

  // Add the x-axis
  xAxis = chart
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(xScale));

  // Add the y-axis
  yAxis = chart.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

  // Add the legend
  const legendData = [
    { label: "Positive", color: "green" },
    { label: "Medium", color: "orange" },
    { label: "Negative", color: "red" },
  ];

  const legendWidth = 150;
  const legendHeight = 80;

  const legend = chart
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(10, 10)`);

  const legendItems = legend
    .selectAll(".legend-item")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legendItems
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", (d) => d.color);

  legendItems
    .append("text")
    .attr("x", 15)
    .attr("y", 8)
    .text((d) => d.label);
}

function updateChart(data) {
  // Parse the timestamp format (if necessary)
  const parseDate = d3.timeParse("%Y-%m-%d");

  // Convert the data to the appropriate format
  currentData = data.map((d) => ({
    timestamp: parseDate(d.timestamp),
    positive: +d.positive,
    negative: +d.negative,
    medium: +d.medium,
  }));

  // Update the scales with the new data
  xScale.domain(d3.extent(currentData, (d) => d.timestamp));
  yScale.domain([
    0,
    d3.max(currentData, (d) => Math.max(d.positive, d.negative, d.medium)),
  ]);

  // Update the line paths with new data
  line1Path
    .datum(currentData)
    .transition()
    .duration(2000)
    .attrTween("d", (newData) => (t) => line1(t < 1 ? newData.slice(0, Math.floor(t * newData.length)) : newData));

  line2Path
    .datum(currentData)
    .transition()
    .duration(2000)
    .attrTween("d", (newData) => (t) => line2(t < 1 ? newData.slice(0, Math.floor(t * newData.length)) : newData));

  line3Path
    .datum(currentData)
    .transition()
    .duration(2000)
    .attrTween("d", (newData) => (t) => line3(t < 1 ? newData.slice(0, Math.floor(t * newData.length)) : newData));

  // Update the x-axis
  xAxis.transition().duration(500).call(d3.axisBottom(xScale));

  // Update the y-axis
  yAxis.transition().duration(500).call(d3.axisLeft(yScale));
}
