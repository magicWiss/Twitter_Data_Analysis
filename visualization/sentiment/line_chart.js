// line_chart.js

function draw_sentiment_line_chart(data, width, height) {
    // Define your chart data (sample data)
    const currentData = data || [
      { date: "2023-07-01", value1: 5, value2: 3, value3: 6 },
      { date: "2023-07-02", value1: 8, value2: 6, value3: 2 },
      { date: "2023-07-03", value1: 3, value2: 1, value3: 4 },
      { date: "2023-07-04", value1: 6, value2: 4, value3: 9 },
      { date: "2023-07-05", value1: 2, value2: 7, value3: 5 },
      { date: "2023-07-06", value1: 9, value2: 9, value3: 1 },
      { date: "2023-07-07", value1: 4, value2: 2, value3: 7 },
      { date: "2023-07-08", value1: 7, value2: 5, value3: 3 },
      { date: "2023-07-09", value1: 2, value2: 8, value3: 6 },
      { date: "2023-07-10", value1: 5, value2: 3, value3: 2 }
      // Add more data points as needed
    ];
  
    // Set up the chart dimensions
    const current_width = width || window.innerWidth;
    const current_height = height || window.innerHeight;
    const margin = { top: 20, right: 10, bottom: 30, left: 50 };
    const chartWidth = current_width - margin.left - margin.right;
    const chartHeight = current_height - margin.top - margin.bottom;
  
    // Parse the date format (if necessary)
    const parseDate = d3.timeParse("%Y-%m-%d");
  
    // Convert the data to the appropriate format
    currentData.forEach(d => {
      d.date = parseDate(d.date);
      d.value1 = +d.value1;
      d.value2 = +d.value2;
      d.value3 = +d.value3;
    });
  
    // Create the SVG element
    const svg = d3
      .select("#sentiment")
      .append("svg")
      .attr("width", current_width - margin.left - margin.right)
      .attr("height", current_height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Set the scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(currentData, d => d.date))
      .range([0, chartWidth]);
  
    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(currentData, d => Math.max(d.value1, d.value2, d.value3))
      ])
      .range([chartHeight, 0]);
  
    // Define the line generators
    const line1 = d3
      .line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value1))
      .curve(d3.curveMonotoneX);
  
    const line2 = d3
      .line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value2))
      .curve(d3.curveMonotoneX);
  
    const line3 = d3
      .line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value3))
      .curve(d3.curveMonotoneX);
  
    // Draw the line charts
    svg.append("path")
      .datum(currentData)
      .attr("class", "line")
      .attr("d", line1)
      .style("fill", "none")
      .style("stroke", "steelblue");
  
    svg.append("path")
      .datum(currentData)
      .attr("class", "line")
      .attr("d", line2)
      .style("fill", "none")
      .style("stroke", "green");
  
    svg.append("path")
      .datum(currentData)
      .attr("class", "line")
      .attr("d", line3)
      .style("fill", "none")
      .style("stroke", "red");
  
    // Add the x-axis
    svg.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));
  
    // Add the y-axis
    svg.append("g").call(d3.axisLeft(yScale));

}
  