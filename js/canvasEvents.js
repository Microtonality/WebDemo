//////////////////////////////////////////////////
//
// canvasEvents.js
//
// Functions to maintain the canvas mouse events.
//
// Originally created: 11-4-2021
//

// This will contain the index of a hexagon that is being hovered over.
var detectedHoverIndex = -1;

// This will contain the index of a hexago that has been clicked on.
var detectedClickIndex = -1;

// This contains values for a hexagon.
var hex = [];

// This is the saved canvas rectangle for the upper left corner sort
//		that it can be restored after the frequency text needs to be removed.
var savedRect;

//////////////////////////////////////////////////
//
// Source: canvasEvents.js
// Function: killHover
//
// Parameters:
//   None
//
// Description: If there is a hexagon drawn in the hover color, redraw it in
//		is non-hover color.
//
function killHover()
{
	
	// If we have do not have a valid hover index (we detected the mouse was over a hexagon)
	if( detectedHoverIndex < 0 )
	{
		return;
	}

	// Draw the original hexagon
	drawHexagon(hex[15],hex[16],hex[17],hex[14],hex[18],false);
		
	// Set so we know we are not in a valid hover area.
	detectedHoverIndex = -1;
		
	// Show a blank frequency in the upper left corner of the canvas.
	showFrequency( "" );
}

//////////////////////////////////////////////////
//
// Source: canvasEvents.js
// Function: killClick
//
// Parameters:
//   x
//   y
//
// Description: If there is a hexagon drawn in the click color, redraw it in
//		is non-hover color.
//
function killClick(x,y)
{
	
	// If we have a valid click index (we detected the mouse was clicked on a hexagon)
	if( detectedClickIndex >= 0 )
	{
		// Draw the original hexagon
		drawHexagon(hex[15],hex[16],hex[17],hex[14],hex[18],false);
		
		// Set so we know we are not in a valid click area.
		detectedClickIndex = -1;
	}
}

//////////////////////////////////////////////////
//
// Source: canvasEvents.js
// Function: showFrequency
//
// Parameters:
//   freq
//
// Description: Show the frequency in the upper left of the canvas. (Possibly
//		clear the color.)
//
function showFrequency( freq )
{
	// Get a context for the canvas with which we will draw.
	var ctx = document.getElementById('demoCanvas').getContext('2d');

	// Put the saved rectangle to overwrite the previously drawn frequency.
	ctx.putImageData(savedRect, 0, 0);
	
	// We will draw in white. Sorry about hard coding.
	ctx.fillStyle = "white";
	// Sorry about the harded font.
	ctx.font = "25px Arial";
	// Draw the text. Sorry about the harded coordinate.
	ctx.fillText(freq, 40,20);
}

//////////////////////////////////////////////////
//
// Source: canvasEvents.js
// Function: handleMouseMove
//
// Parameters:
//   x
//   y
//
// Description: Responds to the mouse movement in the canvas.
//
function handleMouseMove( x, y )
{

	// Go through each scale frequency. Each of these will correspond to a hexagon.
	for( var i=0; i<scale.length; i++ )
	{
		// Get the nexagon at index i.
		hexagon = hexagonList[i];
		
		// See if x and y are in the hexagon.
		if( isInHexagon( x, y, hexagon ) )
		{
			// We have already detected this over index.
			if( i == detectedHoverIndex )
			{
				return;
			}
			
			// Save this hexagon for a restore.
			hex = hexagon;
			
			// If so kill any hover that might exist.
			killHover();
			
			// Draw the nexagon in the hoverColor (that was calculated upon creation).
			drawHexagon(hexagon[15],hexagon[16],hexagon[17],hoverColor,hexagon[18]);
			
			// Set our hover index so we know we are hovering.
			detectedHoverIndex = i;
			
			// Show the frequency for this hexagon.
			showFrequency( hexagon[18] );
			
			return;
		}
	}
	
	// If we didn't find a hover, kill any hover that might exist.
	killHover();
}

//////////////////////////////////////////////////
//
// Source: canvasEvents.js
// Function: handleMouseDown
//
// Parameters:
//   x
//   y
//
// Description: Responds to a mouse down event in the canvas.
//
function handleMouseDown( x, y )
{
	
	// Go through each scale frequency. Each of these will correspond to a hexagon.
	for( var i=0; i<scale.length; i++ )
	{
		// Get the nexagon at index i.
		hex = hexagonList[i];
		
		// See if x and y are in the hexagon.
		if( isInHexagon( x, y, hex ) )
		{
			// If so kill any hover that might exist.
			killHover();

			// Draw the nexagon in the clickColor (that was calculated upon creation).
			drawHexagon(hex[15],hex[16],hex[17],clickColor,hex[18]);
			
			// Set our click index so we know we are clicking.
			detectedClickIndex = i;
			
			// Call the playNote() function based on the index.
			playNote(i);
			
			return;
		}
	}
	
	// If we didn't find a click, kill any hover that might exist.
	killHover();
}

//////////////////////////////////////////////////
//
// Source: canvasEvents.js
// Function: handleMouseUp
//
// Parameters:
//   x
//   y
//
// Description: Responds to a mouse up event in the canvas.
//
function handleMouseUp( x, y )
{
	// Turn any note that is playing off.
	killNote();
	
	// Kill any click that has been recorded.
	killClick(x,y);
}

//////////////////////////////////////////////////
//
// Source: canvasEvents.js
// Function: setCanvasEvents
//
// Parameters:
//   None
//
// Description: Create handlers for all of the canvas events that
//		we want to service.
//
function setCanvasEvents()
{
	// Get the canvas object.
	var canvas = document.getElementById('demoCanvas');
	
	// Register the mousedown event.
	canvas.addEventListener("mousedown", function(event)
	{
		// See if we have any scale frequencies.
		if( scale.length > 0 )
		{
			// Call the handler function.
			handleMouseDown(event.offsetX, event.offsetY);
		}
	});
	
	// Register the mouseup event.
	canvas.addEventListener("mouseup", function(event)
	{
		// See if we have any scale frequencies.
		if( scale.length > 0 )
		{
			// Call the handler function.
			handleMouseUp(event.offsetX, event.offsetY);
		}
	});
	
	// Register the mousemove event.
	canvas.addEventListener("mousemove", function(event)
	{
		// See if we have any scale frequencies.
		if( scale.length > 0 )
		{
			// Call the handler function.
			handleMouseMove(event.offsetX, event.offsetY);
		}
	});
}
