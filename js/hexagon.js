//////////////////////////////////////////////////
//
// hexagon.js
//
// Functions calculating, detecting, and drawing hexagons.
//
// Originally created: 11-4-2021
//

//////////////////////////////////////////////////
//
// Source: hexagon.js
// Function: getX
//
// Parameters:
//   xCenter
//   i
//   numberOfSides
//   size
//
// Description: Get the x coordimate for this vertex.
//
function getX( xCenter, i, numberOfSides, size )
{
	return xCenter + size * Math.cos(i * 2 * Math.PI / numberOfSides);
}

//////////////////////////////////////////////////
//
// Source: hexagon.js
// Function: getY
//
// Parameters:
//   yCenter
//   i
//   numberOfSides
//   size
//
// Description: Get the y coordinate for this vertex.
//
function getY( yCenter, i, numberOfSides, size )
{
	return yCenter + size * Math.sin(i * 2 * Math.PI / numberOfSides);
}

//////////////////////////////////////////////////
//
// Source: hexagon.js
// Function: calcDX
//
// Parameters:
//   hexagon
//   numberOfSides
//
// Description: Calculate the width of this hexagon.
//
function calcDX( hexagon, numberOfSides )
{
	// Set to low (negative) values so everything else is larger.
	var maxX = -1000, maxY = -1000;
	// Loop through each side.
	for( var i=0; i<numberOfSides; i++ )
	{
		if( maxX < hexagon[i*2] )
		{
			maxX = hexagon[i*2];
		}
		if( maxY < hexagon[i*2+1] )
		{
			maxY = hexagon[i*2+1];
		}
	}
	
	// Set to large values so everything else is smaller.
	var minX = 100000, minY = 100000;
	// Loop through each side.
	for( var i=0; i<numberOfSides; i++ )
	{
		if( minX > hexagon[i*2] )
		{
			minX = hexagon[i*2];
		}
		if( minY > hexagon[i*2+1] )
		{
			minY = hexagon[i*2+1];
		}
	}

	// Calculate the width and height. (We never use the height--dx.)
	var dx = maxX - minX;
	var dy = maxY - minY;

	// Return the width.
	return dx;
}

//////////////////////////////////////////////////
//
// Source: hexagon.js
// Function: drawHexagon
//
// Parameters:
//   xCenter
//   yCenter
//   size
//   fillColor
//   label
//   appendHex
//
// Description: Helper function that calls the local draw function. 
//		Note that the last parameter determines whether the hexagon 
//		gets added to the list or just gets drawn.
//
function drawHexagon(xCenter,yCenter,size,fillColor,label,appendHex,key)
{
	// Get a context to the canvas.
	var ctx = document.getElementById('demoCanvas').getContext('2d');

	// Call the local _drawHexagon function. This will return the width.
	return _drawHexagon( xCenter,yCenter,size,fillColor,label, ctx, appendHex, key );
}

//////////////////////////////////////////////////
//
// Source: hexagon.js
// Function: _drawHexagon
//
// Parameters:
//   xCenter
//   yCenter
//   size
//   fillColor
//   label
//   ctx
//   appendHex
//
// Description: This functino actually draws the hexagon to the canvas.
//		Once again note the appendHex parameters determines if this
//		hexagon is added to the list.
//
function _drawHexagon(xCenter,yCenter,size,fillColor,label,ctx,appendHex,key)
{
	// Duh. But this is to be somewhat extensible.
	var numberOfSides = 6;

	// This is a local array that will contain the hexagon data.
	var hexagon = [];

	// This function begins the draw.
	ctx.beginPath();
	// Push calculated first vertex.
	hexagon.push( getX( xCenter, 0, numberOfSides, size ), getY(yCenter, 0, numberOfSides, size ) );
	// Move to the first vertex.
	ctx.moveTo (hexagon[0],hexagon[1]);

	// Walk to each vertex of the hexagon.
	for (var i=1; i<=numberOfSides; i++ )
	{
		// Calculate and save the next coordinate.
		hexagon.push( getX( xCenter, i, numberOfSides, size ), getY(yCenter, i, numberOfSides, size ) );
		// Move to the next coordinate.
		ctx.lineTo (hexagon[i*2], hexagon[i*2+1]);
	}

	// So that we can use this hexagon to redraw later we need to 
	//		save the color, center coordinates, size, and label.
	hexagon.push( fillColor );
	hexagon.push( xCenter );
	hexagon.push( yCenter );
	hexagon.push(size);
	hexagon.push(label);
	// This was recently added. We record the
	//	key value associated with this polygone (note).
	hexagon.push( key );

	// This is the border color.
	ctx.strokeStyle = "#000000";
	// Width of 1
	ctx.lineWidth = 1;
	// Go ahead and draw the line.
	ctx.stroke();	
	
	// Set the fill color according to what we 
	//		got from the UI.
	ctx.fillStyle = fillColor;
	// Go ahead and fill the hexagon.
	ctx.fill();

	// Now we're going to draw the inner text with
	//		the frequency.
	ctx.fillStyle = "white";
	ctx.textAlign = "center";	
	ctx.font = "14px Arial";
	
	// The following conditionals are the result of a bunch of testing.
	if( size < 30 && size >= 24.5 )
	{
		ctx.font = "10px Arial";
	}
	else if( size < 30 && size >= 21 )
	{
		ctx.font = "7px Arial";
	}
	else if( size < 30 && size >= 20 )
	{
		ctx.font = "6px Arial";
	}
	else if( size < 30 && size >= 18 )
	{
		ctx.font = "5px Arial";
	}
	else if( size < 30 && size >= 16 )
	{
		ctx.font = "4px Arial";
	}
	else if( size < 30 && size >= 14 )
	{
		ctx.font = "3px Arial";
	}
	else if( size < 30 && size >= 10 )
	{
		ctx.font = "2px Arial";
	}
	else if( size < 30 && size >= 6 )
	{
		ctx.font = "2px Arial";
	}
	// Draw the text.
	ctx.fillText(label, xCenter, yCenter+2);
	
	// Draw key mapping.
	if( key != ' ' )
	{
		// The line will be white.
		ctx.strokeStyle = "white";
		// Start the draw path.
		ctx.beginPath();
		// First point.
		ctx.moveTo(xCenter,hexagon[3]);
		// Second point.
		ctx.lineTo(xCenter,hexagon[3]+10);
		// Now draw the line.
		ctx.stroke();		
		// Set the texst size.
		ctx.font = "23px Arial";
		// Set the text color.
		ctx.fillStyle = "red";
		// Center on a point.
		ctx.textAlign = "center";	
		// Draw the text.
		ctx.fillText(key, xCenter, hexagon[3]+25);
	}

	// Calculate the hexagon width.
	var dx = calcDX( hexagon, numberOfSides );

	// Only add to the list if appendHex is true.
	if( appendHex )
	{
		hexagonList.push(hexagon);
	}
	
	// Return the width.
	return dx;
}

//////////////////////////////////////////////////
//
// Source: hexagon.js
// Function: linePoints
//
// Parameters:
//   x1
//   y1
//   x2
//   y2
//
// Description: This calculates the points on a line and returns them
//		in an array. This will be used to detect whether we are in the hexagon.
//
function linePoints( x1, y1, x2, y2 )
{
	// Calculate the slope.
	var slope = (y2-y1) / (x2-x1);
	
	// Create an empty array.
	var points = [];

	// Walk the y values.
	for( var y=y1; y<=y2; y++ )
	{
		// Calculate the x value that corresponds to y.
		var x = ( y - y1 + slope * x1 ) / slope;
		
		// Save x and y in the array.
		points.push( x );
		points.push( y );
	}
	return points;
}

//////////////////////////////////////////////////
//
// Source: hexagon.js
// Function: isInHexagon
//
// Parameters:
//   x
//   y
//   hexagon
//
// Description: This function determines if x and y are inside of hexagon.
//
function isInHexagon( x, y, hexagon )
{

	// This is a simple sanity check to see if were are outside
	//		of the hexagon's bounding rectangle.
	if( x < hexagon[6] ||
		x > hexagon[0] ||
		y < hexagon[9] ||
		y > hexagon[3] )
	{
		return false;
	}

	// Now we check the inner rectangle of the hexagon.
	//   /----\
	//  / |**| \
	//	\ |**| /
	//   \----/
	if( x >= hexagon[4] &&
		x <= hexagon[2] &&
		y >= hexagon[9] &&
		y <= hexagon[3] )
	{
		return true;
	}

	// Calculate the mid values so we know how
	//		to check the remaining hexagon sections.
	var midx = hexagon[0] - hexagon[6];
	var midy = hexagon[3] - hexagon[9];

	// Here we are left of center.
	//   /----\
	//  /*|  | \
	//	\*|  | /
	//   \----/
	if( x < midx )
	{
		// This is where we assign the coordinates in the hexagon
		//		array that we will need to test. We do this so that
		//		we can reduce the code and only have one test.
		var i1 = 6;
		var i2 = 7;
		var i3 = 8;
		var i4 = 9;
		// Here is greater than midy -- change hexagon indices.
		if( y > midy )
		{
			i3 = 4;
			i4 = 5;
		}

		// Get the points for this line.
		points = linePoints( i1, i2, i3, i4 );
		
		// Go through each point. (Divided by two since there are two values
		//		for each coordinate.)
		for( var i=0; i<points.length/2; i++ )
		{
			// See if x is outside (to the left). If so we are not in the hexagon.
			if( x < points[i*2] )
			{
				return false;
			}
		}
		
		// No tests failed so we are in the hexagon.
		return true;
	}
	
	// Here we are right of center.
	//   /----\
	//  / |  |*\
	//	\ |  |*/
	//   \----/
	else
	{
		// This is where we assign the coordinates in the hexagon
		//		array that we will need to test. We do this so that
		//		we can reduce the code and only have one test.
		var i1 = 0;
		var i2 = 1;
		var i3 = 8;
		var i4 = 9;
		// Here is greater than midy -- change hexagon indices.
		if( y > midy )
		{
			var i3 = 2;
			var i4 = 3;
		}

		// Get the points for this line.
		points = linePoints( i1, i2, i3, i4 );
		
		// Go through each point. (Divided by two since there are two values
		//		for each coordinate.)
		for( var i=0; i<points.length/2; i++ )
		{
			// See if x is outside (to the right). If so we are not in the hexagon.
			if( x > points[i*2] )
			{
				return false;
			}
		}

		// No tests failed so we are in the hexagon.
		return true;
	}

	// Something went wrong. It should never get here.
	return false;
}
