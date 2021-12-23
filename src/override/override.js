function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
window.onload = function getNews() {
	fetch("https://api.nytimes.com/svc/topstories/v2/home.json?api-key=kRouGn3S9bOU4hl4WzqTwAAjCOw3s5rs")
	.then(response => response.json())
	.then(response => {
		var i = getRandomInt(0, response.results.length);
		var headline = response.results[i].title
		var URL = response.results[i].url
		var abstract = response.results[i].abstract
		var imageURL = response.results[i].multimedia[0].url
		var caption = response.results[i].multimedia[0].caption
		document.getElementById("output").innerHTML += 
		"<div>"+
			"<a href='"+URL+"' style='text-decoration: none; display: block; margin-left: auto; margin-right: auto; width: 650px;'>"+
				"<div class='text headline'>"+headline+"</div>"+
			"</a>"+
			"<div class='text abstract'>"+abstract+"</div>"+
			"<hr class='hr'>"+
			"<img class='image' src='"+imageURL+"'>"+
			"<div class='image caption'>"+caption+"</div>"+
			"<div style='padding-bottom: 50px';>"
		"</div>";
	})
	.catch(err => {
		console.error(err);
		document.getElementById("output").innerHTML += 
		"<div>"+
			"<div class='text headline'>Error 429: Too Many Requests</div>"+
			"<div class='text abstract'>You have made too many requests to The New York Times. Please try again in a minute.</div>"+
			"<hr class='hr'>"+
		"</div>";
	});
}