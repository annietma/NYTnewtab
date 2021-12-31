async function reloadNewTab() {
	//chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
	//if (!tabs[0].url) {
	//chrome.tabs.reload(tabs[0].id);
	//}
	//});
}

function saveOptions() {
	//var selections = document.getElementById('options').elements;
	var mode = document.getElementById("mode").checked ? "dark" : "light";
	chrome.storage.sync.set({
		mode: mode,
	});
	reloadNewTab();
}

function restoreOptions() {
	chrome.storage.sync.get(
		{
			mode: "light",
		},
		function (items) {
			if (items.mode === "light") {
				document.getElementById("mode").checked = false;
			} else {
				document.getElementById("mode").checked = true;
			}
		}
	);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("mode").addEventListener("change", saveOptions);
