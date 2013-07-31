var houses = {
	"house1": { name: "africa", "area": 20, price: 1500000, description: "This is totally big area." },
	"house2": { name: "scand.", "area": 25, price: 1600000, description: "This area 2." },
	"house3": { name: "japan", "area": 30, price: 1700000, description: "Some description." },
	"house4": { name: "indon.", "area": 35, price: 1800000, description: "Empty." },
	"house5": { name: "aust.", "area": 40, price: 1900000, description: "Text, tons of text." },
	"house6": { name: "madag.", "area": 45, price: 1100000, description: "I'm description too..." },
};

var mapHouses = [];

var svg = document.rootElement;

var zoomIn = document.getElementById("btnZoomIn");
var zoomOut = document.getElementById("btnZoomOut");
var cngView = document.getElementById("btnView");

var mapGroup = document.getElementById("mapGroup");
var mapImage = document.getElementById("mapImage");
var mapVector = document.getElementById("mapVector");

var dialogBox = document.getElementById("dialogBox");

var txtName = document.getElementById("txtName");
var txtArea = document.getElementById("txtArea");
var txtPrice = document.getElementById("txtPrice");
var txtDescription = document.getElementById("txtDescription");

var dialogRect = dialogBox.getBBox();

dialogBox.setAttributeNS(null, "visibility", "hidden");

var adjustDialog = function() {
	var val = dialogBox.getAttributeNS(null, "visibility");

	if (val === null || val === "visible") {
		var posX = 0.5 * (window.innerWidth - dialogRect.width);
		var posY = 0.5 * (window.innerHeight - dialogRect.height);

		var t = svg.createSVGTransform();

		t.setTranslate(posX - dialogRect.x, posY - dialogRect.y);

		dialogBox.transform.baseVal.clear();
		dialogBox.transform.baseVal.appendItem(t);
	}
};

for (var id in houses) {
	var child = mapGroup.children[id];

	child.addEventListener("mouseenter", function(event) {
		event.target.style.fill = "#fef";
	});

	child.addEventListener("mouseleave", function(event) {
		event.target.style.fill = "#def";
	});

	child.addEventListener("click", function(event) {
		var id = event.target.id;

		if (id in houses) {
			house = houses[id];

			dialogBox.setAttributeNS(null, "visibility", "visible");

			adjustDialog();

			txtName.textContent = house.name;
			txtArea.textContent = house.area;
			txtPrice.textContent = house.price;
			txtDescription.textContent = house.description;
		}
	});
}

zoomIn.style.cursor = "pointer";
zoomOut.style.cursor = "pointer";
cngView.style.cursor = "pointer";

var map = {
	WIDTH: 1024.0,
	HEIGHT: 768.0,

	minZoom: 1.0,
	maxZoom: 5.0,

	drag: null,
	zoom: 1.0,
	offsetX: 0.0,
	offsetY: 0.0
};

var setZoom = function(zoom) {
	map.zoom = zoom;

	if (map.zoom < map.minZoom) {
		map.zoom = map.minZoom;
	}

	if (map.zoom > map.maxZoom) {
		map.zoom = map.maxZoom;
	}
};

var updateMap = function() {
	var clientWidth = window.innerWidth;
	var clientHeight = window.innerHeight;

	if (map.offsetX > 0.0) {
		map.offsetX = 0.0;
	}

	if (map.offsetY > 0.0) {
		map.offsetY = 0.0;
	}

	if (map.offsetX < -map.WIDTH * map.zoom + clientWidth) {
		map.offsetX = -map.WIDTH * map.zoom + clientWidth;
	}

	if (map.offsetY < -map.HEIGHT * map.zoom + clientHeight) {
		map.offsetY = -map.HEIGHT * map.zoom + clientHeight;
	}

	var t = svg.createSVGTransform();
	var s = svg.createSVGTransform();

	t.setTranslate(map.offsetX, map.offsetY);
	s.setScale(map.zoom, map.zoom);

	mapGroup.transform.baseVal.clear();
	mapGroup.transform.baseVal.appendItem(t);
	mapGroup.transform.baseVal.appendItem(s);
};

var setZoomBounds = function(event) {
	var factorX = window.innerWidth / map.WIDTH;
	var factorY = window.innerHeight / map.HEIGHT;

	map.minZoom = 1.0;

	if (map.minZoom < factorX) {
		map.minZoom = factorX;
	}

	if (map.minZoom < factorY) {
		map.minZoom = factorY;
	}

	map.maxZoom = 5.0;

	if (map.maxZoom < map.minZoom) {
		map.maxZoom < map.minZoom
	}

	adjustDialog();
	setZoom(map.zoom);
	updateMap();
};

window.addEventListener("resize", setZoomBounds);

setZoomBounds();

zoomIn.addEventListener("click", function(event) {
	dialogBox.setAttributeNS(null, "visibility", "hidden");

	var dX = (map.offsetX - 0.5 * map.WIDTH) / map.zoom;
	var dY = (map.offsetY - 0.5 * map.HEIGHT) / map.zoom;

	setZoom(map.zoom * 1.2);

	map.offsetX = dX * map.zoom + 0.5 * map.WIDTH;
	map.offsetY = dY * map.zoom + 0.5 * map.HEIGHT;

	updateMap();

	event.preventDefault();
}, false);

zoomOut.addEventListener("click", function(event) {
	dialogBox.setAttributeNS(null, "visibility", "hidden");
	
	var dX = (map.offsetX - 0.5 * map.WIDTH) / map.zoom;
	var dY = (map.offsetY - 0.5 * map.HEIGHT) / map.zoom;

	setZoom(map.zoom * 0.8);

	map.offsetX = dX * map.zoom + 0.5 * map.WIDTH;
	map.offsetY = dY * map.zoom + 0.5 * map.HEIGHT;

	updateMap();

	event.preventDefault();
}, false);

cngView.addEventListener("click", function(event) {
	dialogBox.setAttributeNS(null, "visibility", "hidden");
	
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
	dialogBox.setAttributeNS(null, "visibility", "hidden");
	
	map.drag = {
		offsetX: event.clientX - map.offsetX,
		offsetY: event.clientY - map.offsetY
	};

	event.preventDefault();
}, false);

mapGroup.addEventListener("mousemove", function(event) {
	if (map.drag) {
		map.offsetX = event.clientX - map.drag.offsetX;
		map.offsetY = event.clientY - map.drag.offsetY;

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

	var dX = (map.offsetX - event.clientX) / map.zoom;
	var dY = (map.offsetY - event.clientY) / map.zoom;

	setZoom(map.zoom * (1.0 + delta * 0.1));

	map.offsetX = dX * map.zoom + event.clientX;
	map.offsetY = dY * map.zoom + event.clientY;

	updateMap();

	event.preventDefault();
};

mapGroup.addEventListener("mousewheel", zoomFunc, false);
mapGroup.addEventListener("DOMMouseScroll", zoomFunc, false);
