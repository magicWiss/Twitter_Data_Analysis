

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
                for (i in data) 
                {
                  total=data[i]['total']
                  id=i
                  container.append('p').text(id +" " + total);
                }
                  
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
  print_data_word_cloud(wordCloud)
  print_data_user_hastag(user2hashtag)

}).catch(function(err) {
 
})
  
  
  
  
  
  