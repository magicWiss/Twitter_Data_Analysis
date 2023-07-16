//Tooltip
var Tooltip = d3.select("body")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .style("position","absolute");

//scaler per il colore
var linearScale = d3.scaleLinear()
  .domain([-0.9, 0, 0.9])
  .range(['red', '#ddd', 'green']);

function draw_wordcloud(data, width, height) {
  // List of words
  var myWords = data || [
    { word: "Running", size: "10" },
    { word: "Surfing", size: "20" },
    { word: "Climbing", size: "50" },
    { word: "Kiting", size: "30" },
    { word: "Sailing", size: "20" },
    { word: "Snowboarding", size: "60" },
    // Aggiungi altre parole con le rispettive dimensioni qui
  ];

  // Imposta le dimensioni del contenitore SVG sulla dimensione dello schermo disponibile
  var screenWidth = width || window.innerWidth;
  var screenHeight = height || window.innerHeight;

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = screenWidth - margin.left - margin.right,
    height = screenHeight - margin.top - margin.bottom;

  // append the svg object to the body of the page

  var wordcloud_svg=d3.select("#wordcloud")
  wordcloud_svg.selectAll("svg").remove()


  var svg = d3
    .select("#wordcloud")
    .append("svg")
    .attr("width", screenWidth)
    .attr("height", screenHeight)
    .append("g");

  // var zoom = d3.zoom()
  //   .scaleExtent([1 / 2, 8])
  //   .on("zoom", zoomed);

  // svg.call(zoom);

  // Create a separate container for the word cloud
   wordCloud = svg
    .append("g")
    .attr("transform", "translate(" + screenWidth / 2 + "," + screenHeight / 2 + ")");

  // Constructs a new cloud layout instance. It runs an algorithm to find the position of words that suits your requirements
  // Wordcloud features that are different from one word to the other must be here
  var layout = d3.layout
    .cloud()
    .size([width, height])
    .words(
      myWords.map(function (d) {
        
        return { text: d.word, num: d.num, fontsize: d.fontsize , color: d.color};
      })
    )
    .padding(5) // space between words
    .rotate(function () {
      return ~~(Math.random() * 2) * 90;
    })
    .fontSize(function (d) {
      return d.fontsize;
    }) // font size of words
    .on("end", draw);
  layout.start();

  // This function takes the output of 'layout' above and draw the words
  // Wordcloud features that are THE SAME from one word to the other can be here
  function draw(words) {
    var current_color;
    var tipBox = d3.select("body")
            .append("div")
            .attr("class", "tip-box");
    wordCloud
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", function (d) {
        return d.fontsize + "px";
      })
      .style("fill", function(d)
      {
        value = linearScale(parseFloat(d.color));
        return value;
      })
      .attr("text-anchor", "middle")    
      .style("font-family", "Impact")
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .on("click", function (d) {
        d3.selectAll("text").attr("class", null);
        d3.select(this).attr("class", "word-active").attr("fill","#699FB3");
        tipBox.style("left", "-9999px")
              .style("top", "-9999px");
        d3.select(this).style("fill", current_color);
        on_hashtag_selected(d.target.textContent);
      })
      .on("mouseover", function (d) {
        current_color = d.srcElement["style"]["cssText"].split(";")[1].split(":")[1];
        d3.select(this).style("fill", "#699FB3");
        var xPos = d.pageX + 10; // Offset to avoid mouse overlap
        var yPos = d.pageY + 10; // Offset to avoid mouse overlap
        tipBox.style("left", xPos + "px")
              .style("top", yPos + "px")
              .text("#tweets: " + d.target.__data__.num);        
      })
      .on("mouseout", function () {
        tipBox.style("left", "-9999px")
              .style("top", "-9999px");
        d3.select(this).style("fill", current_color)
      })
      .text(function (d) {
        return d.text;
      });
      if(selectedHashtag !== undefined) {
        selected = d3.selectAll("text").filter(function () {
          return d3.select(this).attr("id") == selectedHashtag; // filter by single attribute
        });
        if(selected.length > 0) {
          console.log(selected[0]);
        }
      }
  }

  // Function to handle zooming and panning
  function zoomed(event) {
    wordCloud.attr("transform", event.transform);
  }
}
