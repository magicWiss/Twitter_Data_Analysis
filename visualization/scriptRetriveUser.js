// Load the CSV file
var specificID="4782551"
d3.csv("user2date2setimentAGG.csv").then(function(data) {
    // Specify the specific ID to filter

  
    // Filter rows based on specific ID
    var filteredData = data.filter(function(d) {
      return d.author_id === specificID;
    });
  
    // Display the filtered data
    var outputDiv = d3.select("#output");
    outputDiv.selectAll("p")
      .data(filteredData)
      .enter()
      .append("p")
      .text(function(d) {
        return JSON.stringify(d);
      });
  });

  
  
  
  
  
  