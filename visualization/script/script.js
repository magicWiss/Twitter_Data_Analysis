var selectedHashtag = undefined;
var selectedUser = undefined;
var wordCloud;
var hash2date;
var user2hashtag;
var user2date;

// Load the CSV file
var specificID = "4782551"


function print_data_word_cloud(data) {
  var container = d3.select('#wordcloud');
  // Iterate over the JSON data and create elements
  for (i in data) {
    total = data[i]['total']
    id = i
    container.append('p').text(id + " " + total);
  }
}

//ordinamento alle brutte
function sort_data(data){
  const dataArray = Object.entries(data);

  dataArray.sort((a, b) => b[1].total - a[1].total); // Sort in ascending order based on 'total'



  data = dataArray.map(d => d[1]);
  return data
}

function print_data_user_hashtag(data) {

  //ordinamento
  //data=sort_data(data);
  
  
  //console.log(data);
  var container = d3.select('#users');
  container.selectAll('.box').remove();
  // Iterate over the JSON data and create elements
  for (i in data) {
    total = data[i]['total'] || data[i]
    id = i
    console.log(data[i])

    // Create a div element for the box
    var box = container.append('div')
      .attr('class', 'box_user');

    // Add the user image
    box.append('img')
      .attr('src', "./images/utente_twitter.png")
      .attr('alt', 'User Image')
      .style('width', '50px') // Set the desired width
      .style('height', '50px'); // Set the desired height
      
    let url = 'https://twitter.com/intent/user?user_id=' + id;
    if(isNaN(id))
      url = 'https://twitter.com/'+id;
    // Add the username
    box.append('a')
      .attr('href', url)
      .attr('target', '_blank')
      .append('p')
      .text(data[i]['username']);

    // Add the total number
    box.append('p')
      .text('Total: ' + total);
  }
}




function update_user_view(data, found = false)
{
  var container = d3.select('#users');
  container.selectAll('*').remove();

  if (selectedHashtag === undefined){
    set_container_data_user(container, data, found);
  }
  else{
    set_container_data_user(container, data["users"], found);
  }
}

function set_container_data_user(container, data, found = false) {
  for (i in data) {
    total = data[i]['total'] || data[i]
    id = data[i]['id']
    username = data[i]['username']
  
    // Create a div element for the box
    var box = container.append('div')
      .attr('class', 'box_user')
      .attr('id', id)
      .on('click', function (d) {
        d3.selectAll(".box_user").attr('class', 'box_user');
        d3.select(this).attr("class", "box_user active");
        on_user_selected(d3.select(this).attr("id"));
      })
    ;
  
    if(parseInt(id) === parseInt(selectedUser)) {
      found = true;
      box.attr('class', 'box_user active')
    }

    // Add the user image
    box.append('img')
      .attr('src', "./images/utente_twitter.png")
      .attr('alt', 'User Image')
      .style('width', '50px') // Set the desired width
      .style('height', '50px'); // Set the desired height
    
    let url = 'https://twitter.com/intent/user?user_id=' + id;
    if(isNaN(username))
      url = 'https://twitter.com/'+username;

    // Add the username
    box.append('a')
      .attr('href', url)
      .attr('target', '_blank')
      .append('p')
      .text(username);

    // Add the total number
    box.append('p')
      .text('Total: ' + total);
  }
  if(!found)  on_user_selected(undefined);
}


function get_data_wordcloud(data) {

  let word2fullsize = (Object.keys(data).map((i) => {
    return { word: i, size: parseInt(data[i]['total']), color:parseFloat(data[i]['color'])};
  }));

  let scaleSize = d3.scaleLinear()
    .domain([0, d3.max(word2fullsize, (d) => d.size)])
    .range([20, 60]);

  return word2fullsize.map(i => { return { word: i.word, num: i.size, fontsize: scaleSize(i.size), color:i.color } })
}

function filter_users_by_hashtag() {
  if (selectedHashtag !== undefined){
    selectedData_wordCloud=wordCloud[selectedHashtag];
    update_user_view(selectedData_wordCloud);
  }
  else{
    selectedData_wordCloud=user2hashtag
    update_user_view(selectedData_wordCloud)
  }  
}


function filter_users_by_hashtag() {
  if (selectedHashtag !== undefined){
    selectedData_wordCloud=wordCloud[selectedHashtag]
    update_user_view(selectedData_wordCloud);
  }
  else{
    selectedData_wordCloud=user2hashtag
    update_user_view(selectedData_wordCloud)
  }  
}

function filter_sentiment() {
  if (selectedHashtag !== undefined){
    if(selectedUser === undefined)
      updateChart(hash2date.filter(function(d) { return d.Hastag === selectedHashtag}));
    else
      // mancano i dati
      return
  }
  else if(selectedUser !== undefined) {
    updateChart(user2date.filter(function(d) { return d.author_id === selectedUser}));
  }
  else {
    updateChart(hash2date);
  }
}

function on_hashtag_selected(value) {
  if (value == selectedHashtag){
    selectedHashtag = undefined;
    d3.select('.word-active').classed("word-active", false);
  }
  else  selectedHashtag = value;
  filter_users_by_hashtag();
  filter_sentiment();
}

function on_user_selected(value) {
  if (value == selectedUser){
    selectedUser = undefined;
    d3.selectAll(".box_user").attr('class', 'box_user');
  }
  else  selectedUser = value;

  // filter_hashtag_by_user();
  filter_sentiment();
}

function check_hashtag_selected_in_user() {
  if(selectedData_wordCloud[selectedUser].includes(selectedHashtag)) {

  }
}




// ------------------------------------------------------------------
// ---------------------------LETTURA FILE---------------------------
// ------------------------------------------------------------------

Promise.all([
  d3.csv("Sample\\user2date2setimentAGG.csv"),
  d3.json("Sample\\sampleWordCloud.json"),
  d3.csv("Sample\\hastag2date2setiment.csv"),
  d3.json("Sample\\user2hastag.json")
]).then(function (files) {
  
  wordCloud = files[1]
  hash2date = files[2]
  user2hashtag = files[3]
  user2date = files[0]
  // print_data_word_cloud(wordCloud)

    
  var wordcloud_width = d3.select('#wordcloud').node().getBoundingClientRect().width;
  var wordcloud_height = d3.select('#wordcloud').node().getBoundingClientRect().height;
  var sentiment_width = d3.select('#sentiment').node().getBoundingClientRect().width;
  var sentiment_height = d3.select('#sentiment').node().getBoundingClientRect().height;
  
  // Vengono disegnati tutti i grafici all'inizio
  update_user_view(user2hashtag, true);
  data_wordcloud = get_data_wordcloud(wordCloud);
  draw_wordcloud(data_wordcloud, wordcloud_width, wordcloud_height);
  draw_sentiment_line_chart(hash2date, sentiment_width, sentiment_height);
  draw_sentiment_horizon_graph(hash2date, sentiment_width, sentiment_height);
  
  // Nasconde l'horizon graph inizialmente
  var svg_horizon_chart = d3.selectAll(".svg_horizon_chart");
  svg_horizon_chart.style("display", "none");


}).catch(function (err) {
  console.log(err);
})


// --------------------------------------------------------------------------------
// ---------------------------GESTIONE GRAFICI SENTIMENT---------------------------
// --------------------------------------------------------------------------------


document.addEventListener('DOMContentLoaded', function() {
  // Seleziona l'elemento "sentiment_menu"
  var sentimentMenu = d3.select("#sentiment_menu");

  // Seleziona gli elementi all'interno di "sentiment_menu"
  var lineChart = sentimentMenu.select(".line.chart");
  var horizonChart = sentimentMenu.select(".horizon.chart");
  var positive = sentimentMenu.select("#positive");
  var medium = sentimentMenu.select("#medium");
  var negative = sentimentMenu.select("#negative");

  // Gestore eventi per elementi all'interno del menu
  lineChart.on("click", function() {
    // console.log("Hai cliccato su line chart");
    var svg_line_chart = d3.select(".svg_line_chart");
    var svg_horizon_chart = d3.selectAll(".svg_horizon_chart");
    svg_horizon_chart.style("display", "none");
    svg_line_chart.style("display", "block");

  });

  horizonChart.on("click", function() {
    // console.log("Hai cliccato su horizon chart");
    var svg_line_chart = d3.select(".svg_line_chart");
    var svg_horizon_chart = d3.selectAll(".svg_horizon_chart");
    svg_horizon_chart.style("display", "block");
    svg_line_chart.style("display", "none");
  });

  positive.on("click", function() {
    var line_green_element = d3.select(".line.green");
    if(positive.property("checked") == false){
      line_green_element.style("display", "none");
    }
    else{
      line_green_element.style("display", "block");
    }
  });

  medium.on("click", function() {
    var line_orange_element = d3.select(".line.orange");
    if(medium.property("checked") == false){
      line_orange_element.style("display", "none");
    }
    else{
      line_orange_element.style("display", "block");
    }
  });

  negative.on("click", function() {
    var line_red_element = d3.select(".line.red");
    if(negative.property("checked") == false){
      line_red_element.style("display", "none");
    }
    else{
      line_red_element.style("display", "block");
    }
  });
});
