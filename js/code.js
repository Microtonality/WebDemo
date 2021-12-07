//////////////////////////////////////////////////
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

// 0=sine, 1=square, 2=triangle
var soundType = -1;

// The amplitude for the sounds. values are 1, .9, .8. ,7, etc.
var amplitude = 1;

let octave = -1;

var background = new Image();

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
	// Get the canvas object.
	let canvas = document.getElementById('demoCanvas');
	// Get the context to the canvase with which we will draw.
	let ctx = canvas.getContext('2d');
	// Clear the canvas so that we start with a blank object.
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	drawKeyboard(divisions+1);

}

function setMiniKeyboard( number )
{
	// VERY TEMP
	return;
	
	let obj = document.getElementById("miniKeyboardImage");
	obj.src = "images/img" + number + ".png";
}

function newScale()
{
	var lowestOctave = ( referencePitch / 4 );
	var rp = lowestOctave * Math.pow( 2, octave - 1 );
	
	// Generate the scale and save the array into scale variable.
	scale = generateScale( rp, divisions );
	
	// Generate the note list. This will populate noteList.
	generateNoteList(scale,amplitude,soundType);
}

function doPlus()
{
	if( octave != -1 && octave < 5 )
	{
		octave++;
		drawMini();
		newScale();
	}
}

function doMinus()
{
	if( octave > 1 )
	{
		octave--;
		drawMini();
		newScale();
	}
}

function getDivisionWidth()
{
	let w = 5;
	
	for( var i=0; i<_numKeysToDraw; i++ )
	{
		var mod = i % 12;
		if( mod == 1 || mod == 3 || mod == 6 || mod == 8 || mod == 10 )
		{
			if( i == _numKeysToDraw - 1 )
			{
				w += 4;
			}
		}
		else
		{
			w += 8;
		}
	}
	return w;
}

function drawMini()
{
	var w = getDivisionWidth();
	
	let ctx = document.getElementById('mini').getContext('2d');
	ctx.drawImage(background,0,0,419,150);
	
	// The line will be white.
	ctx.strokeStyle = "green";
	ctx.lineWidth = 5;
	
	// Start the draw path.
	ctx.beginPath();
	ctx.moveTo(16 + (octave - 1 ) * 56, 75);
	ctx.lineTo(16 + (octave - 1 ) * 56, 5);
	ctx.lineTo(16 + (octave - 1 ) * 56 + w, 5);
	ctx.lineTo(16 + (octave - 1 ) * 56 + w, 75);

	// Now draw the line.
	ctx.stroke();		

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

	octave = 3;
	setMiniKeyboard( 3 );
	
	_numKeysToDraw = divisions + 1;
	
	let canvas = document.getElementById('demoCanvas');
	let w = setKeyboardData( 0, 10 );
	setKeyboardData( ( canvas.width - w ) / 2, 10 );

	background.src = "images/img0.png";
	background.onload = function()
	{
		drawMini();
	}

	let obj = document.getElementById("minus");
	obj.src = "images/minus.png";
	
	obj = document.getElementById("plus");
	obj.src = "images/plus.png";
	
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
// Description: This sets the canvas width, which is important for when the
//		user resizes the window.
//
function setCanvasWidth()
{
	// Get the canvase object.
	let canvas = document.getElementById('demoCanvas');
	// Calculate the adjusted width (25 is for the scrollbar, etc.)
	let w = window.innerWidth - 25;
	let h = whiteKeyHeight + 20//w * .25;
	// Set the canvas width.
	canvas.width = w;
	canvas.height = h;
	
	w = setKeyboardData( 0, 10 );
	setKeyboardData( ( canvas.width - w ) / 2, 10 );
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
		let index = keyPressed( event.key );
		if( index >= 0 && !playing[index] )
		{
			playNote( index );
		}
	});
	
	document.getElementById("myBody").addEventListener("keyup", function(event)
	{
		let index = keyUnpressed( event.key );
		if( index >= 0  && playing[index] )
		{
			killNote( index );
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
