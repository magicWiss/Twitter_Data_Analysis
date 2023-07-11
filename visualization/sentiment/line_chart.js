// line_chart.js

function draw_sentiment_line_chart(data, width, height) {
    // Define your chart data (sample data)
  const currentData = data || [
    { timestamp: "2023-07-01", positive: 5, negative: 3, medium: 6 },
    { timestamp: "2023-07-02", positive: 8, negative: 6, medium: 2 },
    { timestamp: "2023-07-03", positive: 3, negative: 1, medium: 4 },
    { timestamp: "2023-07-04", positive: 6, negative: 4, medium: 9 },
    { timestamp: "2023-07-05", positive: 2, negative: 7, medium: 5 },
    { timestamp: "2023-07-06", positive: 9, negative: 9, medium: 1 },
    { timestamp: "2023-07-07", positive: 4, negative: 2, medium: 7 },
    { timestamp: "2023-07-08", positive: 7, negative: 5, medium: 3 },
    { timestamp: "2023-07-09", positive: 2, negative: 8, medium: 6 },
    { timestamp: "2023-07-10", positive: 5, negative: 3, medium: 2 }
    // Add more data points as needed
  ];

  // Set up the chart dimensions
  const current_width = width || window.innerWidth;
  const current_height = height || window.innerHeight;
  const margin = { top: 20, right: 10, bottom: 30, left: 50 };
  const chartWidth = current_width - margin.left - margin.right;
  const chartHeight = current_height - margin.top - margin.bottom;

  // Parse the timestamp format (if necessary)
  const parseDate = d3.timeParse("%Y-%m-%d");

  // Convert the data to the appropriate format
  currentData.forEach((d) => {
    d.timestamp = parseDate(d.timestamp);
    d.positive = +d.positive;
    d.negative = +d.negative;
    d.medium = +d.medium;
  });

  // Create the SVG element
  const svg = d3
    .select("#sentiment")
    .append("svg")
    .attr("width", current_width - margin.left - margin.right)
    .attr("height", current_height);

  // Create the chart group
  const chart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Set the scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(currentData, (d) => d.timestamp))
    .range([0, chartWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(currentData, (d) => Math.max(d.positive, d.negative, d.medium)),
    ])
    .range([chartHeight, 0]);

  // Define the line generators
  const line1 = d3
    .line()
    .x((d) => xScale(d.timestamp))
    .y((d) => yScale(d.positive))
    .curve(d3.curveMonotoneX);

  const line2 = d3
    .line()
    .x((d) => xScale(d.timestamp))
    .y((d) => yScale(d.negative))
    .curve(d3.curveMonotoneX);

  const line3 = d3
    .line()
    .x((d) => xScale(d.timestamp))
    .y((d) => yScale(d.medium))
    .curve(d3.curveMonotoneX);

  // Draw the line charts
  chart
    .append("path")
    .datum(currentData)
    .attr("class", "line")
    .attr("d", line1)
    .style("fill", "none")
    .style("stroke", "steelblue");

  chart
    .append("path")
    .datum(currentData)
    .attr("class", "line")
    .attr("d", line2)
    .style("fill", "none")
    .style("stroke", "green");

  chart
    .append("path")
    .datum(currentData)
    .attr("class", "line")
    .attr("d", line3)
    .style("fill", "none")
    .style("stroke", "red");

  // Add the x-axis
  chart
    .append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(xScale));

  // Add the y-axis
  chart.append("g").call(d3.axisLeft(yScale));

  // Add the legend
  const legendData = [
    { label: "Positive", color: "steelblue" },
    { label: "Negative", color: "green" },
    { label: "Medium", color: "red" },
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
  console.log("Aggiornamento sentiment")
  // Convert the data to the appropriate format
  const parsedData = data.map((d) => ({
    timestamp: parseDate(d.timestamp),
    positive: +d.positive,
    negative: +d.negative,
    medium: +d.medium,
  }));

  // Update the scales with the new data
  xScale.domain(d3.extent(parsedData, (d) => d.timestamp));
  yScale.domain([
    0,
    d3.max(parsedData, (d) => Math.max(d.positive, d.negative, d.medium)),
  ]);

  // Update the x-axis
  xAxis.transition().duration(500).call(d3.axisBottom(xScale));

  // Update the y-axis
  yAxis.transition().duration(500).call(d3.axisLeft(yScale));

  // Update the line paths with new data
  chart
    .select(".line1")
    .datum(parsedData)
    .transition()
    .duration(500)
    .attr("d", line1);

  chart
    .select(".line2")
    .datum(parsedData)
    .transition()
    .duration(500)
    .attr("d", line2);

  chart
    .select(".line3")
    .datum(parsedData)
    .transition()
    .duration(500)
    .attr("d", line3);
}