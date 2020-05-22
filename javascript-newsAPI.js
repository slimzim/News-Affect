// VARIABLES FOR AJAX CALL TO NEWSAPI

newsAPIKey = "3e268adc63c94f69b85535d5674e0dc3"

var category = ""
var articleCount = 10
var searchTerm = ""
var newsAPIqueryURL = "https://newsapi.org/v2/top-headlines?country=us"

$("#run-search").on("click", function(event){
    $("#article-section").empty();
    event.preventDefault();
    searchTerm = $("#search-term").val().trim();

    if(searchTerm) {newsAPIqueryURL += "&q=" + searchTerm}
    
    articleCount = $("#article-count").val()
    category = $("#article-category").val()

    newsAPIqueryURL += "&category=" + category + "&pageSize=" + articleCount + "&apiKey=" + newsAPIKey
    console.log(newsAPIqueryURL)

    

    $.ajax({
        url: "https://newsapi.org/v2/top-headlines?country=us&category=general&pageSize=10&apiKey=22ae550d4a4c48ed9964089eeb83fee0",
        method: "GET"
    }).then(function(result) {
    console.log(result)
        var articleResults = result.articles
    
        for (var i=0; i < articleResults.length; i++) {
            var newArticle = $("<div>");
            newArticle.html(articleResults[i].title)
            newArticle.appendTo("#article-section")
        }   
    })
})

$("#clear-all").on("click", function(event) {
    event.preventDefault();
    $("#article-section").empty();
    $("#search-term").val("");
})


var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://microsoft-azure-text-analytics-v1.p.rapidapi.com/sentiment",
	"method": "POST",
	"headers": {
		"x-rapidapi-host": "microsoft-azure-text-analytics-v1.p.rapidapi.com",
		"x-rapidapi-key": "35cd207dc1msh4b912cdb51003fdp1d33f2jsnedb92f96eb4c",
		"content-type": "application/json",
		"accept": "application/json"
	},
	"processData": false,
	"data": "{  \"documents\": [    {      \"language\": \"en\",      \"id\": \"string1\",      \"text\": \"Jennifer Lopez's workout selfie with 'masked' man in background sent fans into frenzy — explanation revealed\"    }    ,    {      \"language\": \"en\",      \"id\": \"string2\",      \"text\": \"Scottie Pippen is 'beyond livid' about how Michael Jordan portrayed him in 'The Last Dance'\"    }                  ]}"
}

// $.ajax(settings).done(function (response) {
// 	console.log(response);
// });

