//////////////////////////////////////////////////
//
// keyboard.js
//
// Keyboard drawing and interaction functions.
//
// Originally created: 12-4-2021
//

// Default to 18 keys.
let _numKeysToDraw = 18;

//  This will hold all keyboard key data.
let keyboardKeys = [];

// Keys to map to notes.
let letters = ["A","W","S","E","D","F","T","G","Y","H","U","J","K","O","L","P",";","'",
		"Z", "3", "X", "4", "C", "V", "5", "B", "6", "N", "7", "M", ",", "8", "." ];

// Key wize values.
const whiteKeyWidth = 60;
const whiteKeyHeight = 300;
const blackKeyWidth = 36;
const blackKeyHeight = 210;

// Width of the entire keyboard.
let keyBoardWidth = 0;

// This returns the key color for the key type and its state.
function getWhiteKeyColor( state )
{
	if( state == upState )
	{
		return upWhiteKeyColor;
	}
	else if( state == downState || state == mouseDownState )
	{
		return downWhiteKeyColor;
	}
	return hoverWhiteKeyColor;
}

// This returns the key color for the key type and its state.
function getBlackKeyColor( state )
{
	if( state == upState )
	{
		return upBlackKeyColor;
	}
	else if( state == downState || state == mouseDownState )
	{
		return downBlackKeyColor;
	}
	return hoverBlackKeyColor;
}

// Get the maximum height for all keys.
function getMaxY( keyData )
{
	// Start with 0, everything else will be greater.
	let maxy = 0;

	// Loop through each key.
	for( var i=0; i<keyData.length-3; i+=2 )
	{
		// Check to see if we have a larger value.
		if( keyData[i+1] > maxy )
		{
			maxy = keyData[i+1];
		}
	}
	
	// Return the value.
	return maxy;
}

// Get minimum width for all keys.
function getMinX( keyData )
{
	// Start with 10000, everything else will be less.
	let minx = 10000;
	
	// Loop through each key.
	for( var i=0; i<keyData.length-3; i+=2 )
	{
		// Check to see if we have a smaller value.
		if( keyData[i] < minx )
		{
			minx = keyData[i];
		}
	}
	
	// Return the value.
	return minx;
}

// Get maximum width for all keys.
function getMaxX( keyData )
{
	// Start with 0, everything else will be greater.
	let maxx = 0;
	
	// Loop through each key.
	for( var i=0; i<keyData.length-3; i+=2 )
	{
		// Check to see if we have a larger value.
		if( keyData[i] > maxx )
		{
			maxx = keyData[i];
		}
	}
	
	// Return the value.
	return maxx;
}

// This function draws a key.
function drawKey( keyData, type, key, ctx )
{
	// This function begins the draw.
	ctx.beginPath();
	// The starting point.
	ctx.moveTo( keyData[0], keyData[1] );
	
	// Loop through the vertices for this key.
	for( var i=2; i<keyData.length-1; i+=2 )
	{
		ctx.lineTo( keyData[i], keyData[i+1] );
	}

	// In order to draw the text we need minx, maxx, and miny.
	let maxy = getMaxY( keyData );
	let minx = getMinX( keyData );
	let maxx = getMaxX( keyData );
	
	// This is the border color.
	ctx.strokeStyle = "#000000";
	// Width of 1
	ctx.lineWidth = 1;
	// Go ahead and draw the line.
	ctx.stroke();	
	
	// Set the fill color according to the state.
	ctx.fillStyle = getColor(keyData[keyData.length-2],type);
	// Go ahead and fill the hexagon.
	ctx.fill();
	
	// Set the texst size.
	ctx.font = "23px Arial";
	// Center on a point.
	ctx.textAlign = "center";

	// This is x and y for the text.
	let x = minx + ( maxx - minx ) / 2;
	let y = maxy - 15;

	// Text should be opposite, in this case white.
	if( type == blackKey )
	{
		// The text will be white.
		ctx.fillStyle = "white";
	}
	// Text should be opposite, in this case black.
	else
	{
		// The text will be black.
		ctx.fillStyle = "black";
	}
	// Draw the text.
	ctx.fillText( key, x, y );
	
}

// Helper function to get the function for appropriate key type.
function getColor( state, type )
{
	if( type == blackKey )
	{
		return getBlackKeyColor( state );
	}
	return getWhiteKeyColor( state );
}

// Generate the vertex data for this key.
function generateWhiteKeyRightNotch(x,y,state,key)
{

	// Initialize holder array.
	let keyData = [];
	
	// *-----
	// |     |
	// |     |
	// |     |
	// |     |
	// |     |
	// |      --|
	// |        |
	// |        |
	// ----------
	keyData.push( x, y );
	
	// ------*
	// |     |
	// |     |
	// |     |
	// |     |
	// |     |
	// |      --|
	// |        |
	// |        |
	// ----------
	keyData.push( x + whiteKeyWidth - blackKeyWidth / 2, y );
	
	// -------
	// |     |
	// |     |
	// |     |
	// |     |
	// |     |
	// |     *--|
	// |        |
	// |        |
	// ----------
	keyData.push( keyData[r_upperRightX], y + blackKeyHeight );
	
	// -------
	// |     |
	// |     |
	// |     |
	// |     |
	// |     |
	// |      --*
	// |        |
	// |        |
	// ----------
	keyData.push( x + whiteKeyWidth, keyData[r_innerMiddleY] );
	
	// -------
	// |     |
	// |     |
	// |     |
	// |     |
	// |     |
	// |      --|
	// |        |
	// |        |
	// ---------*
	keyData.push( keyData[r_outerMiddleX], y + whiteKeyHeight );
	
	// -------
	// |     |
	// |     |
	// |     |
	// |     |
	// |     |
	// |      --|
	// |        |
	// |        |
	// *---------
	keyData.push( x, keyData[r_lowerRightY] );
	
	// *------
	// |     |
	// |     |
	// |     |
	// |     |
	// |     |
	// |      --|
	// |        |
	// |        |
	// ----------
	keyData.push( x, y );

	// End by saving state and key.
	keyData.push( state );
	keyData.push( key );
	
	return keyData;
}

// Generate the vertex data for this key.
function generateWhiteKeyLeftNotch(x,y,state,key)
{
	
	// Initialize holder array.
	let keyData = [];
	
	//    *------
	//    |     |
	//    |     |
	//    |     |
	//    |     |
	//    |     |
	// |--      |
	// |        |
	// |        |
	// ----------
	keyData.push( x + blackKeyWidth / 2, y );
	
	//    ------*
	//    |     |
	//    |     |
	//    |     |
	//    |     |
	//    |     |
	// |--      |
	// |        |
	// |        |
	// ----------
	keyData.push( x + whiteKeyWidth, y );
	
	//    -------
	//    |     |
	//    |     |
	//    |     |
	//    |     |
	//    |     |
	// |--      |
	// |        |
	// |        |
	// ---------*
	keyData.push( keyData[l_upperRightX], y + whiteKeyHeight );
	
	//    -------
	//    |     |
	//    |     |
	//    |     |
	//    |     |
	//    |     |
	// |--      |
	// |        |
	// |        |
	// *---------
	keyData.push( x, keyData[l_lowerRightY] );
	
	//    -------
	//    |     |
	//    |     |
	//    |     |
	//    |     |
	//    |     |
	// *--      |
	// |        |
	// |        |
	// ----------
	keyData.push( x, y + blackKeyHeight );
	
	//    -------
	//    |     |
	//    |     |
	//    |     |
	//    |     |
	//    |     |
	// |--*     |
	// |        |
	// |        |
	// ----------
	keyData.push( keyData[l_upperLeftX], keyData[l_middleLeftY] );
	
	//    *------
	//    |     |
	//    |     |
	//    |     |
	//    |     |
	//    |     |
	// |--      |
	// |        |
	// |        |
	// ----------
	keyData.push( keyData[l_upperLeftX], y );
	
	// End by saving state and key.
	keyData.push( state );
	keyData.push( key );
	
	return keyData;
}

// Generate the vertex data for this key.
function generateWhiteKeyNoNotches(x,y,state,key)
{
	
	// Initialize holder array.
	let keyData = [];
	
	// *---------
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// ----------
	keyData.push( x, y );
	
	// ---------*
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// ----------
	keyData.push( x + whiteKeyWidth, y );
	
	// ----------
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// ---------*
	keyData.push( keyData[upperRightX], y + whiteKeyHeight );
	
	// ----------
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// *---------
	keyData.push( x, keyData[lowerRightY] );
	
	// *---------
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// ----------
	keyData.push( x, y );
	
	// End by saving state and key.
	keyData.push( state );
	keyData.push( key );
	
	return keyData;
}

// Generate the vertex data for this key.
function generateWhiteKeyBothNotches(x,y,state,key)
{

	// Initialize holder array.
	let keyData = [];
	
	//    *---
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	// |--   ---|
	// |        |
	// |        |
	// ----------
	keyData.push( x + blackKeyWidth / 2, y );
	
	//    ---*
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	// |--   ---|
	// |        |
	// |        |
	// ----------
	keyData.push( x + whiteKeyWidth - blackKeyWidth / 2, y );
	
	//    ----
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	// |--   *--|
	// |        |
	// |        |
	// ----------
	keyData.push( keyData[b_upperRightX], y + blackKeyHeight );

	//    ----
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	// |--   ---*
	// |        |
	// |        |
	// ----------
	keyData.push( x + whiteKeyWidth, keyData[b_middleRightLeftY] );
	
	//    ----
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	// |--   ----
	// |        |
	// |        |
	// ---------*
	keyData.push( keyData[b_middleRightRightX], y + whiteKeyHeight );
	
	//    ----
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	// |--   ----
	// |        |
	// |        |
	// *---------
	keyData.push( x, keyData[b_lowerRightY] );

	//    ----
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	// *--   ----
	// |        |
	// |        |
	// ----------
	keyData.push( x, keyData[b_middleRightRightY] );

	//    ----
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	// ---*  ----
	// |        |
	// |        |
	// ----------
	keyData.push( x + blackKeyWidth / 2, keyData[b_middleRightRightY] );
	
	//    *---
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	//    |  |
	// ----  ----
	// |        |
	// |        |
	// ----------
	keyData.push( keyData[b_upperLeftX], keyData[b_upperLeftY] );
	
	// End by saving state and key.
	keyData.push( state );
	keyData.push( key );
	
	return keyData;
}

// Generate the vertex data for this key.
function generateBlackKey(x,y,state,key)
{
	
	// Initialize holder array.
	let keyData = [];
	
	// *---------
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// ----------
	keyData.push( x - blackKeyWidth / 2, y );
	
	// ---------*
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// ----------
	keyData.push( x + blackKeyWidth / 2, y );
	
	// ----------
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// ---------*
	keyData.push( x + blackKeyWidth / 2, y + blackKeyHeight );
	
	// ----------
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// *---------
	keyData.push( x - blackKeyWidth / 2, y + blackKeyHeight );
	
	// *---------
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// |        |
	// ----------
	keyData.push( x - blackKeyWidth / 2, y );
	
	// End by saving state and key.
	keyData.push( state );
	keyData.push( key );
	
	return keyData;
}

// This does no drawing. It calls each generate function depending on
//	the key type and saves it.
function setKeyboardData( startX, startY )
{
	// We can start at any x.
	let x = startX;
	
	// We will remenber the width and return the value.
	w = 0;
	
	// Empty the array in which the keys will be store.
	keyboardKeys = [];

	// Loop through for each key we want to draw.
	for( let i=0; i<_numKeysToDraw; i++ )
	{
		// Create an array for this key.
		let keyboardKey = [];
		
		// This will let us know what key we are generating.
		let mod = i % 12;

		if( i == _numKeysToDraw - 1 && mod != 4 && mod != 1 && mod != 3 && mod != 6 && mod != 8 && mod != 10  && mod != 2  && mod != 7  && mod != 9 )
		{
			keyboardKey.push( whiteKeyNoNotches );
			keyboardKey.push( generateWhiteKeyNoNotches(x,startY,upState) );
			x += whiteKeyWidth;
			w += whiteKeyWidth;
		}
		else if( mod == 0 || mod == 5 )
		{
			keyboardKey.push( whiteKeyRightNotch );
			keyboardKey.push( generateWhiteKeyRightNotch(x,startY,upState) );
			x += whiteKeyWidth;
			w += whiteKeyWidth;
		}
		else if( mod == 4 || mod == 11 )
		{
			keyboardKey.push( whiteKeyLeftNotch );
			keyboardKey.push( generateWhiteKeyLeftNotch(x,startY,upState) );
			x += whiteKeyWidth;
			w += whiteKeyWidth;
		}
		else if( mod == 2 || mod == 7 || mod == 9 )
		{
			if( i == _numKeysToDraw - 1 )
			{
				keyboardKey.push( whiteKeyLeftNotch );
				keyboardKey.push( generateWhiteKeyLeftNotch(x,startY,upState) );
			}
			else
			{
				keyboardKey.push( whiteKeyBothNotch );
				keyboardKey.push( generateWhiteKeyBothNotches(x,startY,upState) );
			}
			x += whiteKeyWidth;
			w += whiteKeyWidth;
		}
		else
		{
			keyboardKey.push( blackKey );
			keyboardKey.push( generateBlackKey(x,startY,upState) );
		}
		
		// Save the letter and the keyboard vertex array.
		keyboardKey.push( letters[i] );
		keyboardKeys.push( keyboardKey );
	}
	
	if( startX == 0 )
	{
		// Save the keyboard width.
		keyBoardWidth = w;
	}
	
	return x;
}

// Wrapper keyboard draw function that creates a context for drawing.
function drawKeyboard(numKeysToDraw)
{
	// Get a context to the canvas.
	var ctx = document.getElementById('demoCanvas').getContext('2d');
	_drawKeyboard( ctx, numKeysToDraw );
}

// Draw the entire keyboard.
function _drawKeyboard( ctx, numKeysToDraw )
{

	// Make sure we have some data.
	if( keyboardKeys === undefined )
	{
		return;
	}

	// Save the number of keys to draw in the global variable.
	_numKeysToDraw = numKeysToDraw;

	// Walk through the members of the array.
	for( var i=0; i<_numKeysToDraw; i++ )
	{
		// Get the data for this key. It only has the vertext data, the type, and the state.
		let keyboardData = keyboardKeys[i];
		if( keyboardData[keyboardDrawData] != 0 )
		{
			//				Vertex data							Type						State
			drawKey( keyboardData[keyboardDrawData], keyboardData[keyboardDataType], keyboardData[keyboardKey], ctx );
		}
	}
	
}

// This handles a key pressed event.
function keyPressed( key )
{
	// Upper case helps us match.
	key = key.toUpperCase();
	
	// Loop through the keyboard data.
	for( var i=0; i<keyboardKeys.length; i++ )
	{
		// Get the keyboard data.
		let keyboardData = keyboardKeys[i];
		
		// Check the key against the ASCII key for this key.
		if( key == keyboardData[keyboardKey] )
		{
			// Get the vertex and state data.
			let data = keyboardData[keyboardDrawData];
			// Set to down.
			data[data.length-2] = downState;

			// Need a device context.
			let ctx = document.getElementById('demoCanvas').getContext('2d');
			// Call the draw key function.
			drawKey( keyboardData[keyboardDrawData], keyboardData[keyboardDataType], keyboardData[keyboardKey], ctx );			
			// We are done. Return the index.
			return i;
		}			
	}
	
	// No keypress found, return -1.
	return -1;
}

// Look for a key that was pressed and unpress it.
function keyUnpressed( key )
{
	// Upper case helps us match.
	key = key.toUpperCase();
	
	// Loop through the keyboard data.
	for( var i=0; i<keyboardKeys.length; i++ )
	{
		// Get the keyboard data.
		let keyboardData = keyboardKeys[i];
		
		// Check the key against the ASCII key for this key.
		if( key == keyboardData[keyboardKey] )
		{
			// Get the vertex and state data.
			let data = keyboardData[keyboardDrawData];
			// Set to down.
			data[data.length-2] = upState;
			
			// Need a device context.
			let ctx = document.getElementById('demoCanvas').getContext('2d');
			// Call the draw key function.
			drawKey( keyboardData[keyboardDrawData], keyboardData[keyboardDataType], keyboardData[keyboardKey], ctx );			
			// We are done. Return the index.
			return i;
		}			
	}
	
	// No keypress found, return -1.
	return -1;
}

// Check to see if the mouse is over a key.
function checkMouse( x, y, state )
{
	
	// Loop through the keyboard data.
	for( var i=0; i<_numKeysToDraw; i++ )
	{
		
		// Get the keyboard data.
		let keyboardData = keyboardKeys[i];
		
		// Call a function that tests the coordinates.
		if( checkInKey( x, y, keyboardData[keyboardDrawData], keyboardData[keyboardDataType] ) )
		{
			// Get the vertex and state data.
			let data = keyboardData[keyboardDrawData];
			
			// Need a device context.
			let ctx = document.getElementById('demoCanvas').getContext('2d');
			// Call the function that kills all mouse state other than up.
			killAllState(ctx,hoverState);

			// See if this key is not in the mouse down state.
			if( data[data.length-2] != mouseDownState )
			{
				// Set to the new state.
				data[data.length-2] = state;
				// Draw the key.
				drawKey( keyboardData[keyboardDrawData], keyboardData[keyboardDataType], keyboardData[keyboardKey], ctx );			
			}

			// Return the index.
			return i;
		}
	}	
	
	// No key found in the keyboard data, return -1;
	return -1;
}

// This function resets the state for keys that are in whatever state
//	is represented by the state variable.
function killAllState(ctx,state)
{
	
	// Loop through the keyboard data.
	for( var i=0; i<keyboardKeys.length; i++ )
	{
		// Get the keyboard data.
		let keyboardData = keyboardKeys[i];
		
		// Get the vertex and state data.
		let data = keyboardData[keyboardDrawData];
		
		// See if the state of this key matches the state variable.
		if( data[data.length-2] == state )
		{
			// Set to the new up.
			data[data.length-2] = upState;
			// Draw the key.
			drawKey( keyboardData[keyboardDrawData], keyboardData[keyboardDataType], keyboardData[keyboardKey], ctx );
		}
	}
}

// CHeck to see if x/y cooreindates are in a key. Note that for two we check
//	a single rectangle, all others we check two rectangels.
function checkInKey( x, y, keyData, type )
{

	switch( type )
	{
		// Single rectangle.
		case whiteKeyNoNotches:
			if( x >= keyData[0] && 
				x <= keyData[2] && 
				y >= keyData[1] && 
				y <= keyData[5] )
			{
				return true;
			}
			break;
		// One notch, two rectangles.
		case whiteKeyRightNotch:
			if( x >= keyData[r_upperLeftX] && 
				x <= keyData[r_upperRightX] && 
				y >= keyData[r_upperLeftY] && 
				y <= keyData[r_lowerLeftY] )
			{
				return true;
			}
			if( x >= keyData[r_upperRightX] && 
				x <= keyData[r_outerMiddleX] && 
				y >= keyData[r_innerMiddleY] && 
				y <= keyData[r_lowerLeftY] )
			{
				return true;
			}
			break;
		// One notch, two rectangles.
		case whiteKeyLeftNotch:
			if( x >= keyData[l_upperLeftX] && 
				x <= keyData[l_upperRightX] && 
				y >= keyData[l_upperLeftY] && 
				y <= keyData[l_lowerLeftY] )
			{
				return true;
			}
			if( x >= keyData[l_middleLeftX] && 
				x <= keyData[l_middleRightX] && 
				y >= keyData[l_middleLeftY] && 
				y <= keyData[l_lowerLeftY] )
			{
				return true;
			}
			break;
		// Two notches, two rectangles.
		case whiteKeyBothNotch:
			if( x >= keyData[b_upperLeftX] && 
				x <= keyData[b_upperRightX] && 
				y >= keyData[b_upperLeftY] && 
				y <= keyData[b_middleRightLeftY] )
			{
				return true;
			}
			if( x >= keyData[b_lowerLeftX] && 
				x <= keyData[b_lowerRightX] && 
				y >= keyData[b_middleRightLeftY] && 
				y <= keyData[b_lowerRightY] )
			{
				return true;
			}
			break;
		// Single rectangle.
		case blackKey:
			if( x >= keyData[0] && 
				x <= keyData[2] && 
				y >= keyData[1] && 
				y <= keyData[5] )
			{
				return true;
			}
			break;
	}

	// Not in this key.
	return false;
}

// Is the state in any of the keys.
function stateKeys(state)
{
	// Loop through the keyboard data.
	for( var i=0; i<keyboardKeys.length; i++ )
	{
		// Get the keyboard data.
		let keyboardData = keyboardKeys[i];
		// Get the vertex and state data.
		let data = keyboardData[keyboardDrawData];
		// Compare the state.
		if( data[data.length-2] == state )
		{
			return true;
		}
	}
	return false;
}
