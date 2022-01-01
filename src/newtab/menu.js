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
			$(".menu-title").css("color", "var(--headline-color)");
			$("#" + event.target.id).css("color", "#326890");
		}
	})
	.on("mouseleave", ".menu-title", function () {
		if (!$(".menu-pages").is(":visible")) {
			$(".menu-title").css("color", "var(--headline-color)");
		}
	});

//show menu when menu options are clicked
$(document).on("click", ".menu-title", function (event) {
	//show containers/menu bar
	$(".menu-container").css("background-color", "var(--background-color)");
	$(".menu-container").css("box-shadow", "0 2px 15px rgba(0, 0, 0, 0.25)");
	$(".hr-menu").fadeTo(200, 1);
	$(".menu-pages").fadeTo(200, 1);
	$(".menu-title").css("color", "var(--headline-color)");
	$("#" + event.target.id).css("color", "var(--link-color)");
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
				article = hist[articleIndex.substring(articleIndex.lastIndexOf("-") + 1)];
			} else {
				article = list[articleIndex.substring(articleIndex.lastIndexOf("-") + 1)];
			}
			let readingListIndex = list.findIndex((x) => x.headline === article.headline);
			if (readingListIndex < 0) {
				document.getElementById(articleIndex).innerHTML = "- Remove from Reading List";
				addtoReadingList(list, article, hist);
			} else {
				document.getElementById(articleIndex).innerHTML = "+ Add to Reading List";
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
	let historyIndex = history.findIndex((x) => x.headline === article.headline);
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
	let historyIndex = history.findIndex((x) => x.headline === article.headline);
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

/*------Settings Functions------*/
var currentMode = "light";
var currentCategories = [];

function saveSettings(event) {
	let selections = document.getElementById("menu-settings").elements;
	currentMode = selections["mode"].value;

	currentCategories = Array.prototype.slice
		.call(selections["categories"])
		.filter(function (x) {
			return x.checked;
		})
		.map(function (x) {
			return x.value;
		});

	chrome.storage.sync.set({
		mode: currentMode,
		categories: currentCategories,
		showcaption: selections["showcaption"].checked,
	});
}

function restoreSettings() {
	chrome.storage.sync.get(
		{
			mode: "light",
			categories: [],
			showcaption: false,
		},
		function (items) {
			currentMode = items.mode;
			document.getElementById(items.mode.toString()).checked = true;
			if (items.mode === "dark") {
				document.documentElement.style.setProperty("--background-color", "#1C2026");
				document.documentElement.style.setProperty("--headline-color", "white");
				document.documentElement.style.setProperty("--abstract-color", "#cccccc");
				document.documentElement.style.setProperty("--hr-color", "#24292F");
				document.documentElement.style.setProperty("--caption-color", "#999999");
				setMenuDarkMode();
			}

			currentCategories = items.categories;
			if (currentCategories.length === 0) {
				document.getElementById("home").checked = true;
				currentCategories.push("home");
			} else if (currentCategories.length === 24) {
				document.getElementById("selectall").checked = true;
			}
			for (let i = 0; i < items.categories.length; i++) {
				document.getElementById(items.categories[i]).checked = true;
			}

			if (items.showcaption === true) {
				document.documentElement.style.setProperty("--caption-display", "block");
				document.getElementById("showcaption").checked = true;
			}
		}
	);
}

//click mode toggle
$(document).on("click", "#dark, #light", function () {
	if (currentMode === "light") {
		document.getElementById("dark").checked = true;
		saveSettings();
		setMenuDarkMode();
	} else {
		document.getElementById("light").checked = true;
		saveSettings();
		setMenuLightMode();
	}
});

function setMenuDarkMode() {
	$(".toggle-switch").css("left", "50%");
	$(".toggle-switch").css("background-color", "#56585c");
	$(".dark").css("opacity", "1");
	$(".dark, .light").css("color", "white");
	$(".light").css("opacity", "0.5");
	$(".mode-container").css("background-color", "#1C2026");
}

function setMenuLightMode() {
	$(".toggle-switch").css("left", "0");
	$(".toggle-switch").css("background-color", "white");
	$(".dark").css("opacity", "0.5");
	$(".dark, .light").css("color", "black");
	$(".light").css("opacity", "1");
	$(".mode-container").css("background-color", "white");
}

//click select all
$(document).on("click", "#selectall", function () {
	if (this.checked) {
		document.getElementById("selectnone").checked = false;
		let toCheck = document.getElementsByName("categories");
		for (let i = 0; i < toCheck.length; i++) {
			toCheck[i].checked = true;
		}
	}
});

//click select none
$(document).on("click", "#selectnone", function () {
	if (this.checked) {
		document.getElementById("selectall").checked = false;
		let toCheck = document.getElementsByName("categories");
		for (let i = 0; i < toCheck.length; i++) {
			toCheck[i].checked = false;
		}
	}
});

//click reload
$(document).on("click", ".reload", function () {
	location.reload();
});

window.addEventListener("DOMContentLoaded", () => {
	restoreSettings();
	document.getElementById("menu-settings").addEventListener("change", () => this.saveSettings());
});
