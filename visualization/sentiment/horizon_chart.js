function draw_sentiment_horizon_graph(data, width, height) {
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
    const chartHeight = (current_height - margin.top - margin.bottom)/3;
  
    // Parse the timestamp format (if necessary)
    const parseDate = d3.timeParse("%Y-%m-%d");
  
    // Convert the data to the appropriate format
    const parsedData = currentData.map((d) => ({
      timestamp: parseDate(d.timestamp),
      positive: +d.positive,
      negative: +d.negative,
      medium: +d.medium,
    }));
  
    // Calculate the average values
    const averagePositive = d3.mean(parsedData, (d) => d.positive);
    const averageNegative = d3.mean(parsedData, (d) => d.negative);
    const averageMedium = d3.mean(parsedData, (d) => d.medium);
  
    // Create the SVG elements
    const svg1 = d3
      .select("#chart1")
      .append("svg")
      .attr("width", current_width - margin.left - margin.right)
      .attr("height", current_height/3)
      .attr("class", "svg_horizon_chart");
  
    const svg2 = d3
      .select("#chart2")
      .append("svg")
      .attr("width", current_width - margin.left - margin.right)
      .attr("height", current_height/3)
      .attr("class", "svg_horizon_chart");
  
    const svg3 = d3
      .select("#chart3")
      .append("svg")
      .attr("width", current_width - margin.left - margin.right)
      .attr("height", current_height/3)
      .attr("class", "svg_horizon_chart");
  
    // Create the chart groups
    const chart1 = svg1
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    const chart2 = svg2
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    const chart3 = svg3
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Set the scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.timestamp))
      .range([0, chartWidth]);
  
    const yScale1 = d3
      .scaleLinear()
      .domain([
        d3.min(parsedData, (d) => Math.min(d.positive, averagePositive)),
        d3.max(parsedData, (d) => Math.max(d.positive, averagePositive)),
      ])
      .range([chartHeight, 0]);
  
    const yScale2 = d3
      .scaleLinear()
      .domain([
        d3.min(parsedData, (d) => Math.min(d.negative, averageNegative)),
        d3.max(parsedData, (d) => Math.max(d.negative, averageNegative)),
      ])
      .range([chartHeight, 0]);
  
    const yScale3 = d3
      .scaleLinear()
      .domain([
        d3.min(parsedData, (d) => Math.min(d.medium, averageMedium)),
        d3.max(parsedData, (d) => Math.max(d.medium, averageMedium)),
      ])
      .range([chartHeight, 0]);
  
    // Define the area generators
    const area1 = d3
      .area()
      .x((d) => xScale(d.timestamp))
      .y0((d) => yScale1(averagePositive))
      .y1((d) => yScale1(d.positive))
      .curve(d3.curveMonotoneX);
  
    const area2 = d3
      .area()
      .x((d) => xScale(d.timestamp))
      .y0((d) => yScale2(averageNegative))
      .y1((d) => yScale2(d.negative))
      .curve(d3.curveMonotoneX);
  
    const area3 = d3
      .area()
      .x((d) => xScale(d.timestamp))
      .y0((d) => yScale3(averageMedium))
      .y1((d) => yScale3(d.medium))
      .curve(d3.curveMonotoneX);
  
    // Draw the areas
    chart1
      .append("path")
      .datum(parsedData)
      .attr("class", "area positive")
      .attr("d", area1)
      .style("fill", "steelblue");
  
    chart2
      .append("path")
      .datum(parsedData)
      .attr("class", "area negative")
      .attr("d", area2)
      .style("fill", "red");
  
    chart3
      .append("path")
      .datum(parsedData)
      .attr("class", "area medium")
      .attr("d", area3)
      .style("fill", "green");
  
    // Add the x-axis
    chart1
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));
  
    chart2
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));
  
    chart3
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));
  
    // Add the y-axes
    chart1.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale1));
    chart2.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale2));
    chart3.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale3));
  
  }
  
// function draw_sentiment_horizon_graph(data, width, height) {

//     var currentData_horizon = data.map(function(d) {
//         return {
//             positive: d.positive,
//         }
//       });

//     var horizonChart = d3.horizonChart()
//         .height(80)
//         .title('Horizon, 4-band')
//         .colors(['#313695', '#4575b4', '#74add1', '#abd9e9', '#fee090', '#fdae61', '#f46d43', '#d73027']);

//     var horizons = d3.select('#sentiment').selectAll('.horizon')
//         .data([currentData_horizon])
//         .enter().append('div')
//         .attr('class', 'horizon')
//         .each(horizonChart);

// }