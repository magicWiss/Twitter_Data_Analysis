

// Load the CSV file
var specificID="4782551"
function print_data_user_hastag(data)
{
  var container = d3.select('#users');
                
                // Iterate over the JSON data and create elements
                for (i in data) 
                {
                  total=data[i]['total']
                  id=i
                  container.append('p').text(id +" " + total);
                }

}
function  print_data_word_cloud(data)
{  
  var container = d3.select('#wordcloud');                
  // Iterate over the JSON data and create elements
  for (i in data) {
    total=data[i]['total']
    id=i
    container.append('p').text(id +" " + total);
  }                 
}

function  get_data_wordcloud(data) {
  
  let word2fullsize = (Object.keys(data).map((i) => {
    return {word: i, size: parseInt(data[i]['total'])};
  }));     
      
  let scaleSize = d3.scaleLinear()
        .domain([0, d3.max(word2fullsize, (d) => d.size)])
        .range([20, 60]);

  return word2fullsize.map(i => {return {word: i.word, size: scaleSize(i.size)}})
}

Promise.all([
  d3.csv("Sample\\user2date2setimentAGG.csv"),
  d3.json("Sample\\sampleWordCloud.json"),
  d3.csv("Sample\\hastag2date2setiment.csv"),
  d3.json("Sample\\user2hastag.json")

]).then(function(files) {
  wordCloud=files[1]
  hash2date=files[2]
  user2hashtag=files[3]
  user2date=files[0]
  // print_data_word_cloud(wordCloud)
  print_data_user_hastag(user2hashtag)
  data_wordcloud = get_data_wordcloud(wordCloud)
  
  console.log(data_wordcloud);
  draw_wordcloud(data_wordcloud, d3.select('#wordcloud').node().getBoundingClientRect().width, d3.select('#wordcloud').node().getBoundingClientRect().height);
}).catch(function(err) {
 
})
  
  
  
  
  
  