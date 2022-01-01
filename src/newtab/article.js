var i = 0;
var headline = "headline";
var URL = "URL";
var abstract = "abstract";
var imageURL = "imageURL";
var caption = "caption";

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}

function getAPIKey() {
	var keys = [
		"kRouGn3S9bOU4hl4WzqTwAAjCOw3s5rs",
		"bkjgwZ0he2obyPJxNe9bnnwicuVkzWdV",
		"pVCBnRMfbHA7ba3jnvTXoxM29AjdqXBN",
		"IxwVYA312sQKpArgW1MkmmpdKrAhDJBn",
		"w4ogopGZUB6We5dBedOtzaEESOXfuImG",
	];
	var i = getRandomInt(0, keys.length);
	return keys[i];
}

function getCategory() {
	if (currentCategories.length === 0) {
		document.getElementById("home").checked = true;
		currentCategories.push("home");
	}
	var i = getRandomInt(0, currentCategories.length);
	return currentCategories[i];
}

function getNews() {
	fetch("https://api.nytimes.com/svc/topstories/v2/" + getCategory() + ".json?api-key=" + getAPIKey())
		.then((response) => response.json())
		.then((response) => {
			i = getRandomInt(0, response.results.length);
			headline = response.results[i].title;
			URL = response.results[i].url;
			abstract = response.results[i].abstract;
			imageURL = response.results[i].multimedia[0].url;
			caption = response.results[i].multimedia[0].caption;
			document.getElementById("newtab").innerHTML +=
				"<div>" +
				"<a href='" +
				URL +
				"' style='text-decoration: none; display: block; margin-left: auto; margin-right: auto; width: 650px;'>" +
				"<div class='text headline'>" +
				headline +
				"</div>" +
				"</a>" +
				"<div class='text abstract'>" +
				abstract +
				"</div>" +
				"<hr class='hr-article'>" +
				"<img class='image' src='" +
				imageURL +
				"'>" +
				"<div class='image caption'>" +
				caption +
				"</div>" +
				"<div style='padding-bottom: 50px';>" +
				"</div>";
			storeNews(response);
		})
		.catch((err) => {
			console.error(err);
			document.getElementById("output").innerHTML +=
				"<div>" +
				"<div class='text headline'>Error 429: Too Many Requests</div>" +
				"<div class='text abstract'>There have been too many requests to The New York Times. Please try again in a minute.</div>" +
				"<hr class='hr'>" +
				"</div>";
		});
}

function storeNews(response) {
	chrome.storage.local.get(
		{
			history: [],
			readinglist: [],
		},
		function (items) {
			let hist = items.history;
			let list = items.readinglist;

			let newArticle = {
				URL: URL,
				headline: headline,
				abstract: abstract,
				imageURL: imageURL,
			};
			let indexofDuplicate = hist.findIndex((x) => x.headline === newArticle.headline);
			if (indexofDuplicate >= 0) {
				hist.splice(indexofDuplicate, 1);
			}
			let readingListIndex = list.findIndex((x) => x.headline === newArticle.headline);
			if (readingListIndex < 0) {
				newArticle.overlay = "+ Add to Reading List";
			} else {
				newArticle.overlay = "- Remove from Reading List";
			}
			hist.push(newArticle);
			if (hist.length > 20) {
				hist.shift();
			}
			chrome.storage.local.set({
				history: hist,
			});

			setUpMenuArticles(hist, "menu-history");
		}
	);
}

function initializeReadingList() {
	chrome.storage.local.get(
		{
			readinglist: [],
		},
		function (items) {
			setUpMenuArticles(items.readinglist, "menu-readinglist");
		}
	);
}

window.onload = function intitialize() {
	getNews();
	initializeReadingList();
};
