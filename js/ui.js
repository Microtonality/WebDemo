//////////////////////////////////////////////////
//
// ui.js
//
// Function for extracting ui values.
//
// Originally created: 11-4-2021
//

//////////////////////////////////////////////////
//
// Source: ui.js
// Function: getValuesFromUI
//
// Parameters:
//   None
//
// Description: This function gets the reference frequency, sound type,
//		divisions, amplitude, starting color, and ending color from the user interface objects.
//
function getValuesFromUI()
{
	try
	{
		// Get the reference pitch as text from the UI and convert it to an integer.
		referencePitch = parseFloat( document.getElementById("referencePitch").value.trim() );
	}
	catch(e)
	{
		// Upon error return the error message.
		return e.message();
	}
	
	try
	{
		// Get the divisions number as text from the UI and convert it to an integer.
		divisions = parseInt( document.getElementById("divisions").value.trim() );
	}
	catch(e)
	{
		// Upon error return the error message.
		return e.message();
	}

	// Get the start color. This will be a value in hexadecimal format: :#rrggbb
	startColor = document.getElementById("startColor").value;
	// Get the end color. This will be a value in hexadecimal format: :#rrggbb
	endColor = document.getElementById("endColor").value;
	// Sound type: sine=0, square=1, triangle=2
	soundType = document.getElementById("soundType").selectedIndex;
	// This gets the amplitude object.
	var a = document.getElementById("amplitude");
	// The values will be 1, .9, .8, .7, etc.
	amplitude = parseFloat( a.options[a.selectedIndex].value );
	return "";
}

