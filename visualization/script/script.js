var selectedHashtag = undefined;
var selectedUser = undefined;
var wordCloud;
var original_wordcloud;
var hash2date;
var user2hashtag;
var user2date;
var wordcloud_width;
var wordcloud_height;
var sentiment_height;
var sentiment_width;
var isAllWordCloudDataset = true;

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
    //console.log(data[i])

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
  else {
    set_container_data_user(container, data["users"], found);
  }
}

function set_container_data_user(container, data, found = false) {
  for (i in data) {
    total = data[i]['total'] || data[i]
    id = data[i]['id']
    username = data[i]['username']
    hashtags=data[i]['hashtags']
    
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
  
    if(id === selectedUser) {
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
  
}


function get_data_wordcloud_selection(data) {
  let word2fullsize = data.map((i) => {
    return { word: i.id, size: parseInt(i['total']), color:parseFloat(i['color'])};
  });

  let scaleSize = d3.scaleLinear()
    .domain([0, d3.max(word2fullsize, (d) => d.size)])
    .range([20, 60]);

  return word2fullsize.map(i => { return { word: i.word, num: i.size, fontsize: scaleSize(i.size), color:i.color } })
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
    isAllWordCloudDataset = false;
    selectedData_wordCloud=ORIGINAL_wordCloud[selectedHashtag];
    update_user_view(selectedData_wordCloud);
  }
  else {
    isAllWordCloudDataset = true;
    selectedData_wordCloud=ORIGINAL_user2hashtag;
    update_user_view(selectedData_wordCloud)
  }
}


function filter_hashtag_by_user() {
  if (selectedUser !== undefined){
    selectedData_wordCloud = wordCloud[selectedHashtag];
    // update_wordcloud(selectedData_wordCloud);
  }
  else{
    selectedData_wordCloud=user2hashtag
    // update_wordcloud(selectedData_wordCloud)
  }  
}

function filter_sentiment() {
  if (selectedHashtag !== undefined){
    if(selectedUser === undefined)
      updateChart(hash2date.filter(function(d) { return d.Hastag === selectedHashtag}));
    else
      userSentiment = user2date.filter(function(d) { return d.author_id === selectedUser});
      hashSentiment = hash2date.filter(function(d) { return d.Hastag === selectedHashtag});
      let datesToFilter = Array();
      let result = userSentiment.map(function(d) {
        datesToFilter.push(d.timestamp);
        let hashSame = hashSentiment.filter(function(h) { return h.timestamp === d.timestamp} );
        if(hashSame.length > 0) {
          let hash = hashSame[0];
          return {timestamp: d.timestamp, positive: (parseFloat(d.positive) + parseFloat(hash.positive))/2, negative: (parseFloat(d.negative) + parseFloat(hash.negative))/2, medium: (parseFloat(d.medium) + parseFloat(hash.medium))/2,};
        }
        return {timestamp: d.timestamp, positive: parseFloat(d.positive), negative: parseFloat(d.negative), medium: parseFloat(d.medium)};
      });

      result = result.concat(hashSentiment.filter(function(d) { return !datesToFilter.includes(d.timestamp)}));
      result = result.sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });
      // mancano i dati
      updateChart(result);
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
    if (selectedUser===undefined)
    {
      update_user_view(ORIGINAL_user2hashtag);
      if(!isAllWordCloudDataset) {
        isAllWordCloudDataset = true;    
        original_wordcloud=get_data_wordcloud(ORIGINAL_wordCloud);
        draw_wordcloud(original_wordcloud,wordcloud_width,wordcloud_height);
      }
    } else {
      isAllWordCloudDataset = false;
      data=ORIGINAL_user2hashtag[selectedUser];
      parsedObjects = JSON.parse(data['hashtags']);   //parsing degli oggetti hashtag
      word_cloud_filtered=get_data_wordcloud_selection(parsedObjects);
      draw_wordcloud(word_cloud_filtered,wordcloud_width,wordcloud_height);
    }
  }
  else
  {
    selectedHashtag = value;
    if (selectedUser===undefined)
    {
      selectedHashtag = value;
      filter_users_by_hashtag();
    }
  }

  filter_sentiment();
}

function on_user_selected(value) {
  if (value == selectedUser){
    selectedUser = undefined;
    d3.selectAll(".box_user").attr('class', 'box_user');
    if(selectedHashtag === undefined) {
      isAllWordCloudDataset = true;
      original_wordcloud=get_data_wordcloud(ORIGINAL_wordCloud);
      draw_wordcloud(original_wordcloud,wordcloud_width,wordcloud_height);
      filter_users_by_hashtag();
    } else {
      filter_users_by_hashtag();
    }
  }
  else
  {
    selectedUser = value;
    if(selectedHashtag === undefined) {
      isAllWordCloudDataset = false;
      data=ORIGINAL_user2hashtag[selectedUser];
      parsedObjects = JSON.parse(data['hashtags']);   //parsing degli oggetti hashtag
      word_cloud_filtered=get_data_wordcloud_selection(parsedObjects);
      draw_wordcloud(word_cloud_filtered,wordcloud_width,wordcloud_height);
    }
  }
  
  filter_sentiment();
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
  
  ORIGINAL_wordCloud = files[1]
  hash2date = files[2]
  ORIGINAL_user2hashtag = files[3]
  user2date = files[0]
  // print_data_word_cloud(wordCloud)

    
   wordcloud_width = d3.select('#wordcloud').node().getBoundingClientRect().width;
   wordcloud_height = d3.select('#wordcloud').node().getBoundingClientRect().height;
   sentiment_width = d3.select('#sentiment').node().getBoundingClientRect().width;
   sentiment_height = d3.select('#sentiment').node().getBoundingClientRect().height;


  update_user_view(ORIGINAL_user2hashtag, true);
  original_wordcloud_SVG = get_data_wordcloud(ORIGINAL_wordCloud);
  
  draw_wordcloud(original_wordcloud_SVG, wordcloud_width, wordcloud_height);
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
