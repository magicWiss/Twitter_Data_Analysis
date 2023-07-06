
// List of words
var myWords = [
  { word: "Running", size: "10" },
  { word: "Surfing", size: "20" },
  { word: "Climbing", size: "50" },
  { word: "Kiting", size: "30" },
  { word: "Sailing", size: "20" },
  { word: "Snowboarding", size: "60" },
  // Aggiungi altre parole con le rispettive dimensioni qui
];

// Genera 100 elementi di dati sintetici
for (var i = 0; i < 1000; i++) {
  var word = "Word" + i;
  var size = Math.floor(Math.random() * 100) + 1; // Genera una dimensione casuale da 1 a 100
  myWords.push({ word: word, size: size.toString() });
}


// Imposta le dimensioni del contenitore SVG sulla dimensione dello schermo disponibile
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

// set the dimensions and margins of the graph
var margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = screenWidth - margin.left - margin.right,
  height = screenHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", screenWidth)
  .attr("height", screenHeight)
  .call(
    d3
      .zoom()
      .scaleExtent([1 / 2, 8])
      .on("zoom", zoomed)
  )
  .append("g");

// Create a separate container for the word cloud
var wordCloud = svg
  .append("g")
  .attr("transform", "translate(" + screenWidth / 2 + "," + screenHeight / 2 + ")");

// Constructs a new cloud layout instance. It runs an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here
var layout = d3.layout
  .cloud()
  .size([width, height])
  .words(
    myWords.map(function (d) {
      return { text: d.word, size: d.size };
    })
  )
  .padding(5) // space between words
  .rotate(function () {
    return ~~(Math.random() * 2) * 90;
  })
  .fontSize(function (d) {
    return d.size;
  }) // font size of words
  .on("end", draw);
layout.start();

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
function draw(words) {
  wordCloud
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style("font-size", function (d) {
      return d.size;
    })
    .style("fill", "#69b3a2")
    .attr("text-anchor", "middle")
    .style("font-family", "Impact")
    .attr("transform", function (d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function (d) {
      return d.text;
    });
}

// Function to handle zooming and panning
function zoomed() {
  wordCloud.attr("transform", d3.event.transform);
}
