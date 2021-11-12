//////////////////////////////////////////////////
//
// color.js
//
// Functions for doing color conversions.
//
// Originally created: 11-4-2021
//

//////////////////////////////////////////////////
//
// Source: color.js
// Function: parseColorChannel
//
// Parameters:
//   colorValue
//   start
//
// Description: incoming color value in the form #rrggbb and a start number such
//		as 1, 3, or 5 returns a base 10 number for the color channel value.
//
function parseColorChannel( colorValue, start )
{
	// Create a string from one of the color channels (which is indicated by the start value).
	// For instance colorValue=#ffcc44 with a start value of 3 gives 0xcc
	var col = "0x" + colorValue.substring( start, start + 2 );
	
	// Convert the hex value of the channel into a base 10 number and return.
	return parseInt(Number(col), 10);
}

//////////////////////////////////////////////////
//
// Source: color.js
// Function: parseRGBColors
//
// Parameters:
//   colorValue
//
// Description: 
//
function parseRGBColors( colorValue )
{
	// Create the return array. This will contain three integers for
	//		the color channels r g b
	var values = [0,0,0];
	
	// Convert the text hexadcecimal color channels into integers and 
	//		assign to the array.
	values[0] = parseColorChannel( colorValue, 1 );
	values[1] = parseColorChannel( colorValue, 3 );
	values[2] = parseColorChannel( colorValue, 5 );

	// Return the array.
	return values;
}

//////////////////////////////////////////////////
//
// Source: color.js
// Function: calcColors
//
// Parameters:
//   divisions
//
// Description: Calculate the color values based on the number 
//		of divisions (number of steps). dr, dg, and db will have the
//		the deltas for each color channel as integers.
//
function calcColors(divisions)
{
	
	// First parse the starting color and assign to sr, sg, and sb.
	var values = parseRGBColors( startColor );
	sr = values[0];
	sg = values[1];
	sb = values[2];
	
	// Second parse the ending color and assign to er, eg, and eb.
	values = parseRGBColors( endColor );
	er = values[0];
	eg = values[1];
	eb = values[2];

	// Calculate the channel deltas that will make a smooth set of colors
	//		for a gradient effect.
	dr = (er - sr) / divisions;
	dg = (eg - sg) / divisions;
	db = (eb - sb) / divisions;
}

//////////////////////////////////////////////////
//
// Source: color.js
// Function: hexValue
//
// Parameters:
//   inValue
//
// Description: Convert an integer which represents a color 
//		channel into a hex string value.
//
function hexValue( inValue )
{
	// Convert to hexadecimal string.
	var v = inValue.toString(16);
	
	// Make sure the string has a length of two.
	while( v.length < 2 )
	{
		// Prepend a zero.
		v = "0" + v;
	}
	
	// Return the value, example: ff, c5, 5a
	return v;
}

//////////////////////////////////////////////////
//
// Source: color.js
// Function: limitTo255
//
// Parameters:
//   inValue
//
// Description: Convert a text value into an integer and limit to no more thank 255.
//
function limitTo255( inValue )
{
	// Parse the text to an integer.
	var v = parseInt( inValue );
	
	// Limit to 255.
	if( v > 255 )
	{
		v = 255;
	}
	
	// Return the integer value.
	return v;
}

//////////////////////////////////////////////////
//
// Source: color.js
// Function: buildColor
//
// Parameters:
//   r
//   g
//   b
//
// Description: Build an HTML color string (such as #aaffcc) 
//		from r, g, and b color values.
//
function buildColor( r, g, b )
{
	return "#" + hexValue( limitTo255( r ) ) + hexValue( limitTo255( g ) ) + hexValue( limitTo255( b ) );
}

//////////////////////////////////////////////////
//
// Source: color.js
// Function: addColor
//
// Parameters:
//   color
//   add
//
// Description: Add value to the three color channels. This is
//		used to create hover and click colors.
//
function addColor( color, add )
{
	// Parse each color channel to an integer, add a value, and limit to 255.
	r = limitTo255( parseColorChannel( color, 1 ) + add );
	g = limitTo255( parseColorChannel( color, 3 ) + add );
	b = limitTo255( parseColorChannel( color, 5 ) + add );
	
	// Now return a built color.
	return buildColor( r, g, b );
}
