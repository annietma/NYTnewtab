//show menu titles when hovering over menu container
$(document)
	.on("mouseenter", ".menu-container", function () {
		$(".menu-title").fadeTo(100, 1);
	})
	.on("mouseleave", ".menu-container", function () {
		if (!$(".menu").is(":visible")) {
			$(".menu-title").fadeTo(100, 0);
		}
	});

//change menu title colors when hovering (when menu is hidden)
$(document)
	.on("mouseenter", ".menu-title", function (event) {
		if (!$(".menu").is(":visible")) {
			$(".menu-title").css("color", "black");
			$("#" + event.target.id).css("color", "#326890");
		}
	})
	.on("mouseleave", ".menu-title", function () {
		if (!$(".menu").is(":visible")) {
			$(".menu-title").css("color", "black");
		}
	});

//show menu when title is clicked
$(document).on("click", ".menu-title", function (event) {
	$(".menu-container").css("background-color", "white");
	$(".menu-container").css("box-shadow", "0 2px 15px rgba(0, 0, 0, 0.25)");
	$(".menu").fadeTo(100, 1);
	$(".menu-title").css("color", "black");
	$("#" + event.target.id).css("color", "#326890");
});

//exit menu
$(document).on("click", ".newtab", function () {
	$(".menu-container").css("background-color", "");
	$(".menu-container").css("box-shadow", "");
	$(".menu-title").hide();
	$(".menu-title").css("color", "black");
	$(".menu").hide();
});

//exit menu helper
$(".menu").click(function (event) {
	event.stopPropagation();
});
