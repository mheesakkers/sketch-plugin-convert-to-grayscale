function onRun(context) {
	var sketch = require('sketch')
	var UI = require('sketch/ui')
	var doc = sketch.getSelectedDocument();
	var selection = doc.selectedLayers;

	 if (!selection.isEmpty) {
	 	var shapeLayers = [];
	 	var imageLayers = [];
	 	var textLayers = [];

	 	selection.forEach( function iterate(layer) {
	 		layer.type === 'ShapePath' && shapeLayers.push(layer);
	 		layer.type === 'Image' && imageLayers.push(layer);
	 		layer.type === 'Text'  && textLayers.push(layer);
	 		(layer.layers || []).forEach(iterate);
	 	});

	 	// Grayscale "Shape" layers
		shapeLayers.forEach(layer => {

			log(layer.style);
	 		// *** ALL THE FILL / GRADIENT COLORS  *** //
	 		if (layer.style.fills) {
	 			layer.style.fills.forEach(fill => {
	 				if (fill.fill === "Gradient") {
	 					fill.gradient.stops.forEach(stop => {
		 					stop.color = convertHexToGrayscaleRGBAString(stop.color);

	 					})
	 				} else {
		 				fill.color = convertHexToGrayscaleRGBAString(fill.color);
	 				}
	 			})
	 		}		

		 	// *** 1st STROKE COLOR *** //
		 	if (layer.style.borders) {
		 		layer.style.borders.forEach(border => {
		 			if (border.fillType === "Gradient") {
		 				border.gradient.stops.forEach(stop => {
		 					stop.color = convertHexToGrayscaleRGBAString(stop.color);
		 				})
		 			} else {
				 		border.color = convertHexToGrayscaleRGBAString(border.color);
		 			}
		 		})	 		
		 	}

		 });

		// Grayscale "Image" layers
		imageLayers.forEach(layer => {
			UI.message('This plugin works only for shape layers.');
		});

		// Grayscale "Type" layers
		textLayers.forEach(layer => {
			UI.message('This plugin works only for shape layers.');
		})

	 } else {
	 	UI.message('Try selecting some shapes');
	 }
}

// HELPERS
function convertHexToGrayscaleRGBAString(hex) {
	// Calculate the opacity
	var opacity = parseInt(hex.substring(hex.length - 2, hex.length), 16) / 255;

	// Chop off the opacity and convert to RGB
	hex = hex.substring(0, hex.length - 2);
	var rgb = hexToRGB(hex);
	
	// Calculate & set gray value based on "Luma"
	// Source: http://www.tannerhelland.com/3643/grayscale-image-algorithm-vb6/
	var gray = (rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722);
	return 'rgba(' + gray+ ',' + gray + ',' + gray + ',' + opacity + ')';
}

function hexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
