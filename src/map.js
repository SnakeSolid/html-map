var houses = {
  "house1": { name: "#1", "area": 20, price: 1500000, description: "This is totally big area." },
	"house2": { name: "#2", "area": 25, price: 1600000, description: "This area 2." },
	"house3": { name: "#3", "area": 30, price: 1700000, description: "Some description." },
	"house4": { name: "#4", "area": 35, price: 1800000, description: "Empty." },
	"house5": { name: "#5", "area": 40, price: 1900000, description: "Text, tons of text." },
	"house6": { name: "#6", "area": 45, price: 1100000, description: "I'm description too..." },
	"house6": { name: "#6", "area": 45, price: 1100000, description: "I'm description too..." },
	"house6": { name: "#6", "area": 45, price: 1100000, description: "I'm description too..." }
};

var init = function() {
	var embed = document.getElementById("mapRoot");
	var root = embed.getSVGDocument();

	if (root === null) {
		setTimeout(init, 300);

		return;
	}

	var svg = root.documentElement;

	var zoomIn = svg.getElementById("btnZoomIn");
	var zoomOut = svg.getElementById("btnZoomOut");
	var cngView = svg.getElementById("btnView");

	if (zoomIn === null || zoomOut === null || cngView === null) {
		setTimeout(init, 100);

		return;
	}

	var mapGroup = svg.getElementById("mapGroup");
	var mapImage = svg.getElementById("mapImage");
	var mapVector = svg.getElementById("mapVector");

	if (mapGroup === null || mapImage === null || mapVector === null) {
		setTimeout(init, 100);

		return;
	}

	var dialogBox = svg.getElementById("dialogBox");
	var txtName = svg.getElementById("txtName");
	var textArea = svg.getElementById("textArea");
	var textPrice = svg.getElementById("textPrice");
	var textDescription = svg.getElementById("textDescription");

	if (dialogBox === null) {
		setTimeout(init, 100);

		return;
	}

	if (txtName === null || textArea === null || textPrice === null || textDescription === null) {
		setTimeout(init, 100);

		return;
	}

	dialogBox.setAttributeNS(null, "visibility", "hidden");

	var mapHouses = [];

	for (var i = 0; i < mapGroup.children.length; i++) {
		var child = mapGroup.children[i];

		if (child.hasAttribute("id")) {
			var id = child.id;

			if (id.substring(0, 5) === "house") {
				child.addEventListener("mouseenter", function(event) {
					event.target.style.fill = "#236";
				});

				child.addEventListener("mouseleave", function(event) {
					event.target.style.fill = "#def";
				});

				child.addEventListener("click", function(event) {
					var id = event.target.id;

					if (id in houses) {
						house = houses[id];

						dialogBox.setAttributeNS(null, "visibility", "visible");

						txtName.textContent = house.name;
						textArea.textContent = house.area;
						textPrice.textContent = house.price;
						textDescription.textContent = house.description;
					}
				});
			}
		}
	}

	zoomIn.style.cursor = "pointer";
	zoomOut.style.cursor = "pointer";
	cngView.style.cursor = "pointer";

	var map = {
		WIDTH: 1024.0,
		HEIGHT: 768.0,

		MIN_ZOOM: 1.0,
		MAX_ZOOM: 5.0,

		drag: null,
		zoom: 1.0,
		offsetX: 0.0,
		offsetY: 0.0
	};

	var setZoom = function(zoom) {
		map.zoom = zoom;

		if (map.zoom < map.MIN_ZOOM) {
			map.zoom = map.MIN_ZOOM;
		}

		if (map.zoom > map.MAX_ZOOM) {
			map.zoom = map.MAX_ZOOM;
		}
	};

	var updateMap = function() {
		if (map.offsetX > 0.0) {
			map.offsetX = 0.0;
		}

		if (map.offsetY > 0.0) {
			map.offsetY = 0.0;
		}

		if (map.offsetX < -map.WIDTH / map.zoom * (map.zoom - 1.0)) {
			map.offsetX = -map.WIDTH / map.zoom * (map.zoom - 1.0);
		}

		if (map.offsetY < -map.HEIGHT / map.zoom * (map.zoom - 1.0)) {
			map.offsetY = -map.HEIGHT / map.zoom * (map.zoom - 1.0);
		}

		var s = svg.createSVGTransform();
		var t = svg.createSVGTransform();

		s.setScale(map.zoom, map.zoom);
		t.setTranslate(map.offsetX, map.offsetY);

		mapGroup.transform.baseVal.clear();
		mapGroup.transform.baseVal.appendItem(s);
		mapGroup.transform.baseVal.appendItem(t);
	};

	zoomIn.addEventListener("click", function(event) {
		map.offsetX -= 0.5 * map.WIDTH / map.zoom;
		map.offsetY -= 0.5 * map.HEIGHT / map.zoom;

		setZoom(map.zoom * 1.2);

		map.offsetX += 0.5 * map.WIDTH / map.zoom;
		map.offsetY += 0.5 * map.HEIGHT / map.zoom;

		updateMap();

		event.preventDefault();
	}, false);

	zoomOut.addEventListener("click", function(event) {
		map.offsetX -= 0.5 * map.WIDTH / map.zoom;
		map.offsetY -= 0.5 * map.HEIGHT / map.zoom;

		setZoom(map.zoom * 0.8);

		map.offsetX += 0.5 * map.WIDTH / map.zoom;
		map.offsetY += 0.5 * map.HEIGHT / map.zoom;

		updateMap();

		event.preventDefault();
	}, false);

	cngView.addEventListener("click", function(event) {
		var val = mapVector.getAttributeNS(null, "visibility");

		if (val === "hidden") {
			mapImage.setAttributeNS(null, "visibility", "hidden");
			mapVector.setAttributeNS(null, "visibility", "visible");
		} else {
			mapImage.setAttributeNS(null, "visibility", "visible");
			mapVector.setAttributeNS(null, "visibility", "hidden");
		}

		event.preventDefault();
	}, false);

	mapGroup.addEventListener("mousedown", function(event) {
		map.drag = {
			offsetX: event.clientX / map.zoom - map.offsetX,
			offsetY: event.clientY / map.zoom - map.offsetY
		};

		event.preventDefault();
	}, false);

	mapGroup.addEventListener("mousemove", function(event) {
		if (map.drag) {
			map.offsetX = event.clientX / map.zoom - map.drag.offsetX;
			map.offsetY = event.clientY / map.zoom - map.drag.offsetY;

			updateMap();
		}

		event.preventDefault();
	}, false);

	mapGroup.addEventListener("mouseup", function(event) {
		map.drag = null;

		event.preventDefault();
	}, false);

	mapGroup.addEventListener("mouseout", function(event) {
		event.preventDefault();
	}, false);

	var zoomFunc = function(event) {
		var event = window.event || event;
		var delta = Math.max(-1.0, Math.min(1.0, event.wheelDelta || -event.detail));

		map.offsetX -= event.clientX / map.zoom;
		map.offsetY -= event.clientY / map.zoom;

		setZoom(map.zoom * (1.0 + delta * 0.1));

		map.offsetX += event.clientX / map.zoom;
		map.offsetY += event.clientY / map.zoom;

		updateMap();

		event.preventDefault();
	};

	mapGroup.addEventListener("mousewheel", zoomFunc, false);
	mapGroup.addEventListener("DOMMouseScroll", zoomFunc, false);

	dialogBox.addEventListener("click", function(event) {
		dialogBox.setAttributeNS(null, "visibility", "hidden");

		event.preventDefault();
	}, false);
};

function contentLoaded(win, fn) {
	var done = false;
	var top = true;
	var doc = win.document;
	var root = doc.documentElement;
	var add = doc.addEventListener ? "addEventListener" : "attachEvent";
	var rem = doc.addEventListener ? "removeEventListener" : "detachEvent";
	var pre = doc.addEventListener ? "" : "on";

	var init = function(e) {
		if (e.type == "readystatechange" && doc.readyState != "complete") {
			if (e.type == "load") {
				return win[rem](pre + e.type, init, false);
			} else {
				return doc[rem](pre + e.type, init, false);
			}
		}
		
		if (!done && (done = true)) {
			fn.call(win, e.type || e);
		}
	};

	var poll = function() {
		try {
			root.doScroll("left");
		} catch(e) {
			setTimeout(poll, 50); return;
		}

		init("poll");
	};

	if (doc.readyState == "complete") {
		fn.call(win, "lazy");
	} else {
		if (doc.createEventObject && root.doScroll) {
			try {
				top = !win.frameElement;
			} catch(e) {
			}

			if (top) {
				poll();
			}
		}

		doc[add](pre + "DOMContentLoaded", init, false);
		doc[add](pre + "readystatechange", init, false);
		win[add](pre + "load", init, false);
	}
}

contentLoaded(window, init);
