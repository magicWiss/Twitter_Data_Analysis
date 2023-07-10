var selectedHashtag;
var wordCloud;
var hash2date;
var user2hashtag;
var user2date;

var IS_hashtagSelected;    //var booleana: true se è stato selezionato un hashtag nel wordcloud, false altrimenti
// Load the CSV file
var specificID = "4782551"

//ordinamento alle brutte
function sort_data(data){
  const dataArray = Object.entries(data);

  dataArray.sort((a, b) => b[1].total - a[1].total); // Sort in ascending order based on 'total'



  data = dataArray.map(d => d[1]);
  return data
}
function print_data_user_hashtag(data,IS_hashtagSelected) {

  //ordinamento
  //data=sort_data(data);
  
  
  //console.log(data);
  var container = d3.select('#users');
  container.selectAll('.box').remove();
  // Iterate over the JSON data and create elements
  for (i in data) {
    total = data[i]['total'] || data[i]
    id = i

    // Create a div element for the box
    var box = container.append('div')
      .attr('class', 'box_user');

    // Add the user image
    box.append('img')
      .attr('src', "./images/utente_twitter.png")
      .attr('alt', 'User Image')
      .style('width', '50px') // Set the desired width
      .style('height', '50px'); // Set the desired height

    // Add the username
    box.append('p')
      .text(id);

    // Add the total number
    box.append('p')
      .text('Total: ' + total);
  }
}


function print_data_word_cloud(data) {
  var container = d3.select('#wordcloud');
  // Iterate over the JSON data and create elements
  for (i in data) {
    total = data[i]['total']
    id = i
    container.append('p').text(id + " " + total);
  }
}

function update_user_view(data,IS_hashtagSelected)
{
  var container = d3.select('#users');
  container.selectAll('*').remove();
  // Iterate over the JSON data and create elements
  for (i in data['users']) {
    //total = data[i]['total'] || data[i]
    //id = i
    total=data['users'][i]['total']
    id=data['users'][i]['id']

    // Create a div element for the box
    var box = container.append('div')
      .attr('class', 'box_user');

    // Add the user image
    box.append('img')
      .attr('src', "./images/utente_twitter.png")
      .attr('alt', 'User Image')
      .style('width', '50px') // Set the desired width
      .style('height', '50px'); // Set the desired height

    // Add the username
    box.append('p')
      .text(id);

    // Add the total number
    box.append('p')
      .text('Total: ' + total);
  }
}
function get_data_wordcloud(data) {

  let word2fullsize = (Object.keys(data).map((i) => {
    return { word: i, size: parseInt(data[i]['total']) };
  }));

  let scaleSize = d3.scaleLinear()
    .domain([0, d3.max(word2fullsize, (d) => d.size)])
    .range([20, 60]);

  return word2fullsize.map(i => { return { word: i.word, size: scaleSize(i.size) } })
}

function filter_users(selectedHashtag,IS_hashtagSelected) {
  console.log("i dati relativi all'hashtag selezionato\n",wordCloud[selectedHashtag])
  data=wordCloud[selectedHashtag]
  

  update_user_view(data,IS_hashtagSelected);
}

function on_hashtag_selected(value) {
  console.log("Script1:UEEEEE")
  selectedHashtag = value;
  IS_hashtagSelected=true;
  filter_users(selectedHashtag,IS_hashtagSelected);
}

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
  IS_hashtagSelected=false;
  // print_data_word_cloud(wordCloud)
  
  print_data_user_hashtag(user2hashtag,IS_hashtagSelected)
  data_wordcloud = get_data_wordcloud(wordCloud)
  draw_wordcloud(data_wordcloud, d3.select('#wordcloud').node().getBoundingClientRect().width, d3.select('#wordcloud').node().getBoundingClientRect().height);
  draw_sentiment_line_chart(null, d3.select('#sentiment').node().getBoundingClientRect().width, d3.select('#sentiment').node().getBoundingClientRect().height);
}).catch(function (err) {
  console.log(err);
})