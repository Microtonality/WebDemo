//////////////////////////////////////////////////
//
// code.js
//
// Higher level functions for application.
//
// Originally created: 11-4-2021
//

// This array contains the calculated scale. The values are for
//		frequencies.
var scale = [];

// Starting reference pitch. This can be changed by the user.
var referencePitch = 440;

// How many divisions (or steps) for the scale.
var divisions = 0;

// Starting color for the scale hexagons.
var startColor = "#1111ff";

// Ending color for the scale hexagons.
var endColor = "#ff11ff";

// These contain integer values for the starting color channels,
//		the ending color channels, and the delta for each color channel.
var sr, sg, sb, er, eg, eb, dr, dg, db;

// This is the hover color that will be calculated when the scale is generated.
var hoverColor = "#111111";

// This is the click color that will be calculated when the scale is generated.
var clickColor = "#222222";

// The list of hexagons for the scale.
var hexagonList = [];

// 0=sine, 1=square, 2=triangle
var soundType = -1;

// The amplitude for the sounds. values are 1, .9, .8. ,7, etc.
var amplitude = 1;

//////////////////////////////////////////////////
//
// Source: code.js
// Function: drawMe
//
// Parameters:
//   None
//
// Description: This draws the set of haxagon objects, each on which
//		represent a note.
//
function drawMe()
{
	
	// A length of 0 means we haven't generated a scale yet and cannot draw.
	if( scale.length <= 0 )
	{
		return;
	}

	// Get the canvas object.
	var canvas = document.getElementById('demoCanvas');
	// Get the context to the canvase with which we will draw.
	var ctx = canvas.getContext('2d');
	// Clear the canvas so that we start with a blank object.
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Here we save the upper left corner of the canvas so that we
	//		can restore it. This is mainly used when we change or erase
	//		the frequency value.
	savedRect = ctx.getImageData(0, 0, 200, 40);
	
	// Empty the hexagon list.
	hexagonList = [];

	// Call the function that calculates the colors for our draw.
	//		This includes sr, sg, sb, er, eg, eb, dr, dg, and db
	calcColors(divisions);
	
	// Now we use local copies of the starting color channel values so that
	//		we can adjust them for each step without affecting the "global" values.
	var r = sr, g = sg, b = sb;

	// Here we calculate how wide we want to draw each hexagon.
	var dw = ( canvas.width / scale.length ) / 2;
	// Here is the height.
	var h = canvas.height;
	// Limit the width to 30. For scales of 12-19 this means the hexagons
	//		don't fully fill the canvas.
	if( dw > 30 )
	{
		dw = 30;
	}
	
	// Calculate the starting x and y coordinates.
	var x = dw + 5;
	var y = h / 2;

	// We need the mid frequency in the list.
	var mid = Math.round( scale.length / 2 );
	
	// Count up through each scale frequency.
	for( var i=0; i<scale.length; i++ )
	{
		// Build the color for the current hexagon. Note that as we
		//		move through the hexagons, this value changes.
		var fillColor = buildColor( r, g, b );
		
		// Add the delta values to the r, g, and b channels.
		r += dr;
		g += dg;
		b += db;

		// Get the frequency so that we can assign it to the hexagon.
		//		This draws the frequency within the hexagon.
		var label = scale[i];
		
		// Draw the hexagon and assign the drawn width to dx.
		var dx = _drawHexagon( x, y, dw, fillColor, label, ctx, true, keyBuffer[i] );
		// Adjust x by adding the width of the hexagon.
		x += dx;

		// If we are at the mid point we want to calculate the hover and
		//		click colors so that we have values that work for the
		//		entire range.
		if( i == mid )
		{
			// Brighten by 80
			hoverColor = addColor( fillColor, 80 );
			// Brighten by 160
			clickColor = addColor( fillColor, 160 );
		}
		
	}
	
}

//////////////////////////////////////////////////
//
// Source: code.js
// Function: doGenerate
//
// Parameters:
//   None
//
// Description: Generate the scale, the note buffers, and draw the hexagons.
//
function doGenerate()
{
	// This array contains the note buffers.
	nodes = [];

	// Here we call the function get get all UI values
	//	before we start. An error shouldn't happen, but might.
	var error = getValuesFromUI()
	if( error.length > 0 )
	{
		return;
	}
	
	// Generate the scale and save the array into scale variable.
	scale = generateScale( referencePitch, divisions );
	
	// Generate the note list. This will populate noteList.
	generateNoteList(scale,amplitude,soundType);

	// Call the code that draws the hexagons.
	drawMe();
}

//////////////////////////////////////////////////
//
// Source: code.js
// Function: setCanvasWidth
//
// Parameters:
//   None
//
// Description: This sets the canvase width, which is important for when the
//		user resizes the window.
//
function setCanvasWidth()
{
	// Get the canvase object.
	var canvas = document.getElementById('demoCanvas');
	// Calculate the adjusted width (25 is for the scrollbar, etc.)
	var w = window.innerWidth - 25;
	// Set the canvas width.
	canvas.width = w;
}

// Keys that will be used for keyboard play.
var keys = ['1','2','3','4','5','6','7,','8','9','0',
	'q','w','e','r','t','y','u','i','o','p','[',']',
	'a','s','d','f','g','h','j','k','l',';',
	'z','x','c','v','b','n','m',',','.'];

//////////////////////////////////////////////////
//
// Source: code.js
// Function: setup
//
// Parameters:
//   None
//
// Description: This function sets up the eidth and events that
//		we need to maintain.
//
function setup()
{
	
	// Set the initial canvase width. FYI: setting the width in CSS
	//		causes the text to be blurry.
	setCanvasWidth();
	// Calls the function that creates event handlers for down, up, and move.
	setCanvasEvents();

	// Resize event.
	window.addEventListener('resize', function(event)
	{
		// Set the canvas width to reflect the new width.
		setCanvasWidth();
		// Redraw.
		drawMe();
	});

	// This is the event to handle a change in the start color selection.
	document.getElementById("startColor").addEventListener("change", function(event)
	{
		// Retrieve the start color value.
		startColor = document.getElementById("startColor").value;
		// Redraw.
		drawMe();
	});
	
	// This is the event to handle a change in the end color selection.
	document.getElementById("endColor").addEventListener("change", function(event)
	{
		// Retrieve the end color value.
		endColor = document.getElementById("endColor").value;
		// Redraw.
		drawMe();
	});
	
	// This is the event to handle a keydown event.
	document.getElementById("myBody").addEventListener("keydown", function(event)
	{
		// getKeyIndex returns the corresponding index
		//	of the polygon (note) associated with the key.
		//	If none are found we get a -1 back.
		var index = getKeyIndex( event.key );
		
		// If we have a valid key index and this note is not already
		//	pressed then...
		if( index >= 0 && !onBuffer[index] )
		{
			// Remember that this key is pressed.
			onBuffer[index] = true;
			
			// Get the hexagon for this index.
			var hex = hexagonList[index];
		
			// Draw the nexagon in the clickColor (that was calculated upon creation).
			drawHexagon(hex[15],hex[16],hex[17],clickColor,hex[18],false,hex[19]);
			
			// Call the playNote() function based on the index.
			playNote(index);
		}
	});
	
	document.getElementById("myBody").addEventListener("keyup", function(event)
	{
		// getKeyIndex returns the corresponding index
		//	of the polygon (note) associated with the key.
		//	If none are found we get a -1 back.
		var index = getKeyIndex( event.key );
		
		// If we have a valid key index and this note is not already
		//	pressed then...
		if( index >= 0 && onBuffer[index] )
		{
			// Remember that this key is no longer pressed.
			onBuffer[index] = false;
			
			// Get the hexagon for this index.
			var hex = hexagonList[index];
		
			// Draw the nexagon in the clickColor (that was calculated upon creation).
			drawHexagon(hex[15],hex[16],hex[17],hex[14],hex[18],false,hex[19]);
			
			// Call the playNote() function based on the index.
			killNote(index);
		}
	});
	
}

//////////////////////////////////////////////////
//
// Source: code.js
// Function: getKeyIndex
//
// Parameters:
//   key
//
// Description: This function takes a key value such as a, b, c, etc
//		and returns the polygon (or note) that is associated with it.
//		If none are found it returns a -1.
//
function getKeyIndex( key )
{
	// Loop through the keyBuffer.
	for( var i=0; i<keyBuffer.length; i++ )
	{
		// See if we found a match.
		if( key == keyBuffer[i] )
		{
			// Return the index.
			return i;
		}
	}
	// None found, return -1.
	return -1;
}

//////////////////////////////////////////////////
//
// Source: code.js
// Function: registerSoundTypeChange
//
// Parameters:
//   None
//
// Description: This gets triggered when the user changes the sound type.
//
function registerSoundTypeChange()
{
	// Set to a wait cursor.
	document.body.style.cursor  = 'wait';
	// Get the sound type value (right now should be 0, 1, or 2). 
	//		Later will add instruments.
	soundType = document.getElementById("soundType").selectedIndex;
	// Regenerate the sound list.
	generateNoteList(scale,amplitude,soundType);
	// Restore the cursor.
	document.body.style.cursor  = 'default';
}

//////////////////////////////////////////////////
//
// Source: code.js
// Function: registerAmplitudeChange
//
// Parameters:
//   None
//
// Description: This gets triggered when the user changes the amplitude.
//
function registerAmplitudeChange()
{
	// Set to a wait cursor.
	document.body.style.cursor  = 'wait';
	// Get the amplitude object.
	var a = document.getElementById("amplitude");
	// Now get the actual value (the values are in the HTML code).
	amplitude = parseFloat( a.options[a.selectedIndex].value );
	// Regenerate the sound list.
	generateNoteList(scale,amplitude,soundType);
	// Restore the cursor.
	document.body.style.cursor  = 'default';
}
