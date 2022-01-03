var i = 0;
var headline = "headline";
var URL = "URL";
var abstract = "abstract";
var imageURL = "imageURL";
var caption = "caption";
var historyMaster = [];
var readinglistMaster = [];

function getRandomInt(min, max) {
	min = Math.ceil(min); //inclusive
	max = Math.floor(max); //exclusive
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
	if (currentFrequency != "default") {
		var percent = parseInt(currentFrequency);
		if (getRandomInt(1, 101) <= percent) {
			return "home";
		}
	}
	return currentCategories[i];
}

function getNews() {
	fetch("https://api.nytimes.com/svc/topstories/v2/" + getCategory() + ".json?api-key=" + getAPIKey())
		.then((response) => response.json())
		.then((response) => {
			i = getRandomInt(0, response.results.length);
			if (response.results[i].title === "") {
				if (i != response.results.length - 1) {
					i++;
				} else {
					i = getRandomInt(0, response.results.length - 1);
				}
			}
			headline = response.results[i].title;
			URL = response.results[i].url;
			abstract = response.results[i].abstract;
			if (response.results[i].multimedia != undefined) {
				imageURL = response.results[i].multimedia[0].url;
				caption = response.results[i].multimedia[0].caption;
			}
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
			console.log(err);
			console.error(err);
			if (!window.navigator.onLine) {
				document.getElementById("newtab").innerHTML +=
					"<div class='text headline'>Failed to fetch article</div>" +
					"<div class='text abstract'>Please check your internet connection.</div>" +
					"<hr class='hr'>";
			} else {
				document.getElementById("newtab").innerHTML +=
					"<div class='text headline'>Error 429: Too Many Requests</div>" +
					"<div class='text abstract'>There have been too many requests to The New York Times. Please try again in a minute.</div>" +
					"<hr class='hr'>";
			}
		});
}

function storeNews(response) {
	chrome.storage.local.get(
		{
			history: [],
			readinglist: [],
		},
		function (items) {
			historyMaster = items.history;
			readinglistMaster = items.readinglist;

			let newArticle = {
				URL: URL,
				headline: headline,
				abstract: abstract,
				imageURL: imageURL,
			};
			let indexofDuplicate = historyMaster.findIndex((x) => x.headline === newArticle.headline);
			if (indexofDuplicate >= 0) {
				historyMaster.splice(indexofDuplicate, 1);
			}
			let readingListIndex = readinglistMaster.findIndex((x) => x.headline === newArticle.headline);
			if (readingListIndex < 0) {
				newArticle.overlay = "+ Add to Reading List";
				document.getElementById("addtolist-tab").innerHTML = "+";
			} else {
				newArticle.overlay = "- Remove from Reading List";
				document.getElementById("addtolist-tab").innerHTML = "-";
			}
			historyMaster.push(newArticle);
			if (historyMaster.length > 50) {
				historyMaster.shift();
			}
			chrome.storage.local.set({
				history: historyMaster,
			});

			setUpMenuArticles(historyMaster, "menu-history", true);
		}
	);
}

window.onload = function intitialize() {
	getNews();
	chrome.storage.local.get(
		{
			readinglist: [],
			history: [],
		},
		function (items) {
			readinglistMaster = items.readinglist;
			setUpMenuArticles(items.readinglist, "menu-readinglist");
			setUpMenuArticles(items.history, "menu-history");
		}
	);
};

/*------jQuery------*/
$(document).on("mouseenter", ".image", function () {
	$(".caption").fadeTo(100, 1);
});
