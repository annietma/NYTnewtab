//show menu titles when hovering over menu container
$(document)
	.on("mouseenter", ".menu-container", function () {
		$(".menu-title").fadeTo(100, 1);
	})
	.on("mouseleave", ".menu-container", function () {
		if (!$(".menu-pages").is(":visible")) {
			$(".menu-title").fadeTo(100, 0.1);
		}
	});

//change menu title colors when hovering (when menu is hidden)
$(document)
	.on("mouseenter", ".menu-title", function (event) {
		if (!$(".menu-pages").is(":visible")) {
			$(".menu-title").css("color", "black");
			$("#" + event.target.id).css("color", "#326890");
		}
	})
	.on("mouseleave", ".menu-title", function () {
		if (!$(".menu-pages").is(":visible")) {
			$(".menu-title").css("color", "black");
		}
	});

//show menu when menu options are clicked
$(document).on("click", ".menu-title", function (event) {
	//show containers/menu bar
	$(".menu-container").css("background-color", "white");
	$(".menu-container").css("box-shadow", "0 2px 15px rgba(0, 0, 0, 0.25)");
	$(".hr-menu").fadeTo(150, 1);
	$(".menu-pages").fadeTo(150, 1);
	$(".menu-title").css("color", "black");
	$("#" + event.target.id).css("color", "#326890");
	$(".headline").css("z-index", "0");
	//show menu page
	$(".menu-option").css("display", "none");
	$("#menu-" + event.target.id).css("display", "block");
});

//add/remove from reading list
$(document).on("click", ".addtolist", function (event) {
	chrome.storage.local.get(
		{
			history: [],
			readinglist: [],
		},
		function (items) {
			let hist = items.history;
			let list = items.readinglist;

			let articleIndex = event.target.id;
			let article = "";
			if ($("#menu-history").css("display") == "block") {
				article =
					hist[
						articleIndex.substring(
							articleIndex.lastIndexOf("-") + 1
						)
					];
			} else {
				article =
					list[
						articleIndex.substring(
							articleIndex.lastIndexOf("-") + 1
						)
					];
			}
			let readingListIndex = list.findIndex(
				(x) => x.headline === article.headline
			);
			if (readingListIndex < 0) {
				document.getElementById(articleIndex).innerHTML =
					"- Remove from Reading List";
				addtoReadingList(list, article, hist);
			} else {
				document.getElementById(articleIndex).innerHTML =
					"+ Add to Reading List";
				removeFromReadingList(list, article, readingListIndex, hist);
			}
		}
	);
});

//exit menu
$(document).on("click", ".newtab", function () {
	$(".menu-container").css("background-color", "");
	$(".menu-container").css("box-shadow", "");
	$(".hr-menu").fadeOut(100);
	$(".menu-title").fadeTo(100, 0.1);
	$(".menu-title").css("color", "black");
	$(".menu-pages").fadeOut(100);
	$(".headline").css("z-index", "2");
});

//exit menu helper
$(".menu-pages").click(function (event) {
	event.stopPropagation();
});

function setUpMenuArticles(data, menuoption) {
	if (menuoption === "menu-readinglist" && data.length === 0) {
		document.getElementById(menuoption).innerHTML +=
			"<div class='menu-article' style='pointer-events: none;'>" +
			"<div class='menu-abstract' >" +
			"You currently have no items in your reading list. You can add up to 20 items by hovering and clicking over article images." +
			"</div>" +
			"</div>";
	}
	for (let i = data.length - 1; i >= 0; i--) {
		document.getElementById(menuoption).innerHTML +=
			"<div class='menu-article'>" +
			"<div class='menu-image-container'>" +
			"<img class='menu-image' src='" +
			data[i].imageURL +
			"' id='image-" +
			i +
			"'>" +
			"<div class='addtolist' id='addto-" +
			i +
			"'>" +
			data[i].overlay +
			"</div>" +
			"</div>" +
			"<a href='" +
			data[i].URL +
			"' class='menu-headline'>" +
			data[i].headline +
			"</a>" +
			"<div class='menu-abstract'>" +
			data[i].abstract +
			"</div>" +
			"</div>";
	}
}

function addtoReadingList(readinglist, article, history) {
	let newArticle = {
		URL: article.URL,
		headline: article.headline,
		abstract: article.abstract,
		imageURL: article.imageURL,
		overlay: "- Remove from Reading List",
	};
	readinglist.push(newArticle);
	if (readinglist.length > 20) {
		readinglist.shift();
	}
	let historyIndex = history.findIndex(
		(x) => x.headline === article.headline
	);
	if (historyIndex >= 0) {
		history[historyIndex].overlay = "- Remove from Reading List";
	}
	chrome.storage.local.set({
		readinglist: readinglist,
		history: history,
	});

	document.getElementById("menu-readinglist").innerHTML = "";
	setUpMenuArticles(readinglist, "menu-readinglist");
}

function removeFromReadingList(readinglist, article, index, history) {
	readinglist.splice(index, 1);
	let historyIndex = history.findIndex(
		(x) => x.headline === article.headline
	);
	if (historyIndex >= 0) {
		history[historyIndex].overlay = "+ Add to Reading List";
	}
	chrome.storage.local.set({
		readinglist: readinglist,
		history: history,
	});

	document.getElementById("menu-readinglist").innerHTML = "";
	setUpMenuArticles(readinglist, "menu-readinglist");
	document.getElementById("menu-history").innerHTML = "";
	setUpMenuArticles(history, "menu-history");
}
