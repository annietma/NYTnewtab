//hover over new tab add to list button
$(document)
	.on("mouseenter", ".addtolist-tab", function () {
		$(".addtolist-tab").css("color", "var(--link-color)");
		if (document.getElementById("addtolist-tab").innerHTML === "+") {
			document.getElementById("addtolist-tab").innerHTML = "+ Add to Reading List";
		} else if (document.getElementById("addtolist-tab").innerHTML === "-") {
			document.getElementById("addtolist-tab").innerHTML = "- Remove from Reading List";
		}
	})
	.on("mouseleave", ".addtolist-tab", function () {
		$(".addtolist-tab").css("color", "var(--headline-color)");
	});

//show menu titles when hovering over menu container 2
$(document)
	.on("mouseenter", ".menu-container2", function () {
		if (!$(".menu-pages").is(":visible")) {
			$(".menu-title, .addtolist-tab").fadeTo(100, 1);
		}
	})
	.on("mouseleave", ".menu-container2", function () {
		if (!$(".menu-pages").is(":visible")) {
			$(".menu-title, .addtolist-tab").fadeTo(100, 0.1);
		}
	});

//change menu title colors when hovering (when menu is hidden)
$(document)
	.on("mouseenter", ".menu-title", function (event) {
		if (!$(".menu-pages").is(":visible")) {
			$(".menu-title").css("color", "var(--headline-color)");
			$("#" + event.target.id).css("color", "var(--link-color)");
		}
	})
	.on("mouseleave", ".menu-title", function () {
		if (!$(".menu-pages").is(":visible")) {
			$(".menu-title").css("color", "var(--headline-color)");
			$("#" + event.target.id).css("color", "var(--headline-color)");
		}
	});

//show appropriate menu page when menu options are clicked,
//or exit menu if clicking title of active menu page
$(document).on("click", ".menu-title", function (event) {
	if ($("#menu-" + event.target.id).is(":visible")) {
		exitMenu();
		$(".menu-title, .addtolist-tab").fadeTo(100, 1);
		$("#" + event.target.id).css("color", "var(--link-color)");
	} else {
		//show containers/menu bar
		$(".menu-container").css("background-color", "var(--background-color)");
		$(".menu-container").css("box-shadow", "0 2px 15px rgba(0, 0, 0, 0.25)");
		$(".addtolist-tab").css("display", "none");
		$(".menu-bar").css("background-color", "var(--background-color)");
		$(".hr-menu").fadeTo(200, 1);
		$(".menu-pages").fadeTo(200, 1);
		$(".menu-title").css("color", "var(--headline-color)");
		$("#" + event.target.id).css("color", "var(--link-color)");
		$(".headline").css("z-index", "0");
		//show menu page
		$(".menu-option").css("display", "none");
		$("#menu-" + event.target.id).css("display", "block");
	}
});

//add/remove from reading list
$(document).on("click", ".addtolist, .addtolist-tab", function (event) {
	chrome.storage.local.get(
		{
			history: [],
			readinglist: [],
		},
		function (items) {
			let historyMaster = items.history;
			let readinglistMaster = items.readinglist;

			let articleIndex = event.target.id;

			let article = "";
			if (event.target.className === "addtolist-tab") {
				article = historyMaster[historyMaster.length - 1];
			} else {
				if ($("#menu-history").css("display") == "block") {
					article = historyMaster[articleIndex.substring(articleIndex.lastIndexOf("-") + 1)];
				} else {
					article = readinglistMaster[articleIndex.substring(articleIndex.lastIndexOf("-") + 1)];
				}
			}

			let elementID = articleIndex;
			if (event.target.className === "addtolist-tab") {
				elementID = "addtolist-tab";
			}

			let readingListIndex = readinglistMaster.findIndex((x) => x.headline === article.headline);
			if (readingListIndex < 0) {
				document.getElementById(elementID).innerHTML = "- Remove from Reading List";
				addtoReadingList(readinglistMaster, article, historyMaster);
			} else {
				document.getElementById(elementID).innerHTML = "+ Add to Reading List";
				removeFromReadingList(readinglistMaster, article, readingListIndex, historyMaster);
			}

			if (event.target.className === "addtolist-tab") {
				setUpMenuArticles(historyMaster, "menu-history", true);
			}
		}
	);
});

//exit menu
function exitMenu() {
	$(".menu-container").css("background-color", "");
	$(".menu-container").css("box-shadow", "");
	$(".menu-bar").css("background-color", "transparent");
	$(".hr-menu").fadeOut(100);
	$(".menu-title, .addtolist-tab").fadeTo(100, 0.1);
	$(".menu-title").css("color", "var(--headline-color)");
	$(".menu-pages").fadeOut(100);
	$(".headline").css("z-index", "2");
}
$(document).on("click", ".newtab", function () {
	exitMenu();
});
$(".menu-pages").click(function (event) {
	event.stopPropagation();
});

function setUpMenuArticles(data, menuoption, refreshHistory = false) {
	if (refreshHistory) {
		document.getElementById("menu-history").innerHTML = "";
	}

	if (menuoption === "menu-readinglist" && data.length === 0) {
		document.getElementById(menuoption).innerHTML +=
			"<div class='menu-article' style='pointer-events: none;'>" +
			"<div class='menu-abstract' >" +
			"You currently have no items in your reading list. You can add up to 50 items by hovering and clicking over article images." +
			"</div>" +
			"</div>";
	}

	let start = data.length - 1;
	let end = -1;
	let num = 0;
	if (menuoption == "menu-readinglist") {
		start = 0;
		end = data.length;
		num = 1;
	}

	let i = start;
	while (i != end) {
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
			(num ? num + ". " : "") +
			data[i].headline +
			"</a>" +
			"<div class='menu-abstract'>" +
			data[i].abstract +
			"</div>" +
			"</div>";
		if (menuoption === "menu-history") {
			i--;
		} else {
			i++;
			num++;
		}
	}
	document.getElementById(menuoption).innerHTML +=
		"<div class='info-container'><div class='info'>This list is capped at " +
		(menuoption === "menu-history" ? 100 : 50) +
		"articles, after which the oldest articles will be removed.</div></div>";
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
	if (readinglist.length > 100) {
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
var currentFrequency = "default";

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

	if (shouldShowFrequencies()) {
		$("#showfrequencies").css("display", "flex");
		$("#showfrequencies label").css("display", "");
	} else {
		$("#showfrequencies").css("display", "none");
		$("#showfrequencies label").css("display", "none");
	}
	frequency = Array.prototype.slice
		.call(selections["frequencies"])
		.filter(function (x) {
			return x.checked;
		})
		.map(function (x) {
			return x.value;
		});
	currentFrequency = frequency[0];

	chrome.storage.sync.set({
		mode: currentMode,
		categories: currentCategories,
		headlinefrequency: currentFrequency,
		showcaption: selections["showcaption"].checked,
	});
}

function restoreSettings() {
	chrome.storage.sync.get(
		{
			mode: "light",
			categories: [],
			headlinefrequency: "default",
			showcaption: false,
		},
		function (items) {
			//light/dark mode
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
			//categories
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
			//headline frequencies
			currentFrequency = items.headlinefrequency;
			if (shouldShowFrequencies()) {
				$("#showfrequencies").css("display", "flex");
				$("#showfrequencies label").css("display", "");
			} else {
				$("#showfrequencies").css("display", "none");
				$("#showfrequencies label").css("display", "none");
			}
			document.getElementById(items.headlinefrequency).checked = true;

			//always show caption
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
	$(document).on("click", "[name='categories']", function () {
		document.getElementById("selectall").checked = false;
	});
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
	$(document).on("click", "[name='categories']", function () {
		document.getElementById("selectnone").checked = false;
	});
});

//determine whether to show headline frequencies
function shouldShowFrequencies() {
	let categories = document.getElementsByName("categories");
	if (categories[0].checked === false) {
		return false;
	}
	for (let i = 1; i < categories.length; i++) {
		if (categories[i].checked === true) {
			return true;
		}
	}
	return false;
}

//click headline frequency
$(document).on("click", ".frequencies", function (event) {
	let checkboxes = document.getElementsByName("frequencies");
	for (let i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].id === event.target.id) {
			console.log("hi");
			checkboxes[i].checked = true;
		} else {
			checkboxes[i].checked = false;
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
