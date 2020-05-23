// API KEYS ==================================================================

NYTtopStoriesAPIKeyJZ = "RWfhB4SgHGOUTaVyo2DRZJlCqM7fb9iW"
microsoftAPIKeyJZ = "35cd207dc1msh4b912cdb51003fdp1d33f2jsnedb92f96eb4c"

//============================================================================

// ONCLICK FUNCTION FOR SEARCH

$("#run-search").on("click", function(event){
    $("#article-section").empty();
    event.preventDefault();
    
    topStoriesQueryURL = "https://api.nytimes.com/svc/topstories/v2/"

    articleCount = $("#article-count").val()
    category = $("#article-category").val() 

    topStoriesQueryURL += category + ".json?api-key=" + NYTtopStoriesAPIKeyJZ
    
    // AJAX call to NYT

    $.ajax({
        url: topStoriesQueryURL,
        method: "GET"
    }).then(function(results) {
    console.log(results)

        var articleResults = results.results
        
        dataString = "{  \"documents\": [{ "
    
        headlines = []
         
        // This for loop does 3 things:

        for (var i=0; i < articleCount; i++) {

            // 1. Puts all the headlines from the NYT JSON into a <div>...

            var newArticle = $("<div>");
            newArticle.html(articleResults[i].title)
            newArticle.appendTo("#article-section") 
            
            // 2. Adds the headline to the headlines array, and gives that headline a value.  
           
            var newObject = {
                title: articleResults[i].title,
                url: articleResults[i].short_url
            }

            headlines.push(newObject)
           
            // 3. Creates a long string of data to be sent off to the Microsoft API using the abstract from each article.
            // The if/else statement is there because the string needs to be closed properly at the end.
            // (notice the slight difference in syntax at the end of the two conditional statements)

            if (i+1 < articleCount) {
                dataString += "\"language\": \"en\", \"id\": \"string" + (i+1) + "\", \"text\": \"" + articleResults[i].abstract + "\" } , { "
            }
            
            else {
                dataString += "\"language\": \"en\", \"id\": \"string" + (i+1) + "\", \"text\": \"" + articleResults[i].abstract + "\" } ]}"
            }           
        }  
    
    // The dataString variable is finished, so let's send it to Microsoft!

    callMicrosoftAPI()

    })
})


// ONCLICK FUNCTION FOR CLEAR BUTTON ===========================================================

$("#clear-all").on("click", function(event) {
    event.preventDefault();
    $("#article-section").empty();
    $("#search-term").val("");
})

// ==============================================================================================

// AJAX CALL TO MICROSOFT =======================================================================

function callMicrosoftAPI(){

    // This is the object containing all of the information for the AJAX call.
    // Notice how all of that annoying data is contained in that tidy little dataString variable :) 

    microsoftObject = {
        "async": true,
        "crossDomain": true,
        "url": "https://microsoft-azure-text-analytics-v1.p.rapidapi.com/sentiment",
        "method": "POST",
        "headers": {
            "x-rapidapi-host": "microsoft-azure-text-analytics-v1.p.rapidapi.com",
            "x-rapidapi-key": microsoftAPIKeyJZ,
            "content-type": "application/json",
            "accept": "application/json"
        },
        "processData": false,
        "data": dataString
    }
    console.log("dataString = " + dataString)
    console.log(microsoftObject)

    $.ajax(microsoftObject).done(function (response) {
        console.log(response);
    
        for (var j=0; j < headlines.length; j++) {
            var sentimentResults = response.documents
            headlines[j].score = sentimentResults[j].score
        }
        
        headlines.sort(function (a, b) {
            return b.score - a.score;
          });
          console.log(headlines)

        
        for (k=0; k < headlines.length; k++){
        
        
          if (headlines[k].score > .5 ) {
              newArticleDiv = $("<div>")
              newArticle = $("<a>")
              newArticle.attr("href", headlines[k].url)
              newArticle.attr("target", "_blank")
              newArticle.html(headlines[k].title)
              newArticle.appendTo(newArticleDiv)
              newArticleDiv.appendTo("#positive-articles")
           
          }

             else if(headlines[k].score === .5) {
              newArticleDiv = $("<div>")
              newArticle = $("<a>")
              newArticle.attr("href", headlines[k].url)
              newArticle.attr("target", "_blank")
              newArticle.html(headlines[k].title)
              newArticle.appendTo(newArticleDiv)
              newArticleDiv.appendTo("#neutral-articles")

          } else if (headlines[k].score < .5) {
              newArticleDiv = $("<div>")
              newArticle = $("<a>")
              newArticle.attr("href", headlines[k].url)
              newArticle.attr("target", "_blank")
              newArticle.html(headlines[k].title)
              newArticle.appendTo(newArticleDiv)
              newArticleDiv.prependTo("#negative-articles")
          }
        }
    });
        
}

$("clicked").on("click", function(){
    console.log(this)
})