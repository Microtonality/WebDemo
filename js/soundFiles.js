//////////////////////////////////////////////////
//
// soundFiles.js
//
// Functions for generating and playing sounds.
//
// Originally created: 11-4-2021
//

// This will contain a single AudioContext for generating and playing sounds.
var ctx;

// This will contain an array of sound buffers. They will all be the same: square,
//		sine, triangle, etc.
var noteBuffer = [];

// Flag indicating that a not is currently playing.
var playing = false;

//////////////////////////////////////////////////
//
// Source: soundFiles.js
// Function: generateNoteList
//
// Parameters:
//   scale
//   amplitude
//   soundType
//
// Description: Generate a list of note buffers. This is
//		based on the UI items such as reference frequency, divisions, 
//		and soundType. The scale has been generated before this point
//		containing a list of frequencies.
//
function generateNoteList(scale,amplitude,soundType)
{
	// Create a new and empty note buffer.
	noteBuffer = [];
	
	// Go through each scale frequency.
	for( var i=0; i<scale.length; i++ )
	{
		// Local buffer variable.
		var buffer;

		// For each supported sound type we call the correct function.
		if( soundType == 0 )
		{
			buffer = sineWave(44100,16834*6,scale[i],amplitude);
		}
		else if ( soundType == 1 )
		{
			buffer = squareWave(44100,16834*6,scale[i],amplitude);
		}
		else if ( soundType == 2 )
		{
			buffer = triangleWave(44100,16834*6,scale[i],amplitude);
		}
		
		// Save the buffer into the array.
		noteBuffer.push( buffer );
	}
}

//////////////////////////////////////////////////
//
// Source: soundFiles.js
// Function: adjustAmplitude
//
// Parameters:
//   i
//   numSamples
//   amplitude
//
// Description: This function adjusts the amplitude at the end
//		of the sound to decrease a click.
//
function adjustAmplitude( i, numSamples, amplitude )
{
	
	// See if we need to taper the amplitude value. We are only
	//		tapering the last 1000 bytes. This prevents a click sound at the end.
	if( i >= numSamples - 1000 )
	{
		// Decrease the amplitude value by 1/1000
		amplitude -= 0.001;
		
		// Don't let it get below zero.
		if( amplitude < 0 )
		{
			amplitude = 0;
		}
	}
	
	// Return the amplitude value to caller to "remember" where we are.
	return amplitude;
}

//////////////////////////////////////////////////
//
// Source: soundFiles.js
// Function: playNote
//
// Parameters:
//   index
//
// Description: This is a helper function that takes an index
//		and then calls _playNote with the actual note buffer.
//
function playNote( index )
{
	// Call the "real" playNote function.
	_playNote( noteBuffer[index] );
}

// This will let us turn the note off once we play it.
var node;

//////////////////////////////////////////////////
//
// Source: soundFiles.js
// Function: _playNote
//
// Parameters:
//   buffer
//
// Description: Play a note. It creates a note and sets the buffer.
//		Then it connects to the context. Finally it starts the note.
//
function _playNote( buffer )
{
	// Create this node value for playing and stopping.
	node = ctx.createBufferSource(0);
	
	// Set the node.buffer to point to the note that was already calculated.
	node.buffer = buffer;
	
	// Connect to the AudioContext.
	node.connect( ctx.destination );
	
	// Set to loop, although there is sill a perceptable break at the end.
	node.loop = true;
	
	// Start the note.
	node.start(0);
	
	// Set our flag so we know a note is playing.
	playing = true;
}

//////////////////////////////////////////////////
//
// Source: soundFiles.js
// Function: killNote
//
// Parameters:
//   None
//
// Description: Kills the note that is currently playing.
//
function killNote()
{
	// Only do this if the playing flag is set.
	if( playing )
	{
		// This will stop the note from playing.
		node.disconnect();
		
		// Reset our flag.
		playing = false;
	}
}

//////////////////////////////////////////////////
//
// Source: soundFiles.js
// Function: sineWave
//
// Parameters:
//   sampleRate
//   numSamples
//   frequency
//   amplitude
//
// Description: Generate a sine wave for correct number of samples.
//
function sineWave(sampleRate,numSamples,frequency,amplitude)
{

	// Precalculate 2PI
	var PI_2 = Math.PI * 2;
	
	// If this is the first time we will create the AudioContext object.
	if( typeof ctx == "undefined" )
	{
		ctx = new AudioContext();
	}

	// Create the buffer for the node.
	var buffer = ctx.createBuffer(1, numSamples, sampleRate);
	
	// Create the buffer into which the audio data will be placed.
	var buf = buffer.getChannelData(0);
	
	// Loop numSamples times -- that's how many samples we will calculate and store.
	for (i = 0; i < numSamples; i++) 
	{
		// This only comes into play at the end of the sample when we
		//		want to make sure it doesn't have an obvious click.
		amplitude = adjustAmplitude( i, numSamples, amplitude );
		
		// Calculate and store the value for this sample.
		buf[i] = Math.sin(frequency * PI_2 * i / sampleRate) * amplitude;
	}

	// Return the channel buffer.
	return buffer;
}

//////////////////////////////////////////////////
//
// Source: soundFiles.js
// Function: squareWave
//
// Parameters:
//   sampleRate
//   numSamples
//   frequency
//   amplitude
//
// Description: Generate a square wave for correct number of samples.
//
function squareWave(sampleRate,numSamples,frequency,amplitude)
{
	
	// If this is the first time we will create the AudioContext object.
	if( typeof ctx == "undefined" )
	{
		ctx = new AudioContext();
	}

	// Here we calculate the number of samples for each wave oscillation.
	var samplesPerOscillation = sampleRate / frequency;
	// Create the value for the first oscillation change.
	var first = samplesPerOscillation / 2;
	// We will count the samples as we go.
	var counter = 0;

	// Create the buffer for the node.
	var buffer = ctx.createBuffer(1, numSamples, sampleRate);
	
	// Create the buffer into which the audio data will be placed.
	var buf = buffer.getChannelData(0);
	
	// Loop numSamples times -- that's how many samples we will calculate and store.
	for (i = 0; i < numSamples; i++) 
	{
		// Increment the counter.
		counter++;
		
		// This only comes into play at the end of the sample when we
		//		want to make sure it doesn't have an obvious click.
		amplitude = adjustAmplitude( i, numSamples, amplitude );
			
		// This is the first half of the oscillation. it should be 1.
		if( counter <= first )
		{
			// Store the value.
			buf[i] = 1 * amplitude;
		}
		// This is the second half of the oscillation. It should be -1.
		else
		{
			// Store the value.
			buf[i] = -1 * amplitude;
			
			// See if we are done with this cycle.
			if( counter >= samplesPerOscillation )
			{
				// Set to zero so we are ready for another cycle.
				counter = 0;
			}
		}
	}

	// Return the channel buffer.
	return buffer;
}

//////////////////////////////////////////////////
//
// Source: soundFiles.js
// Function: triangleWave
//
// Parameters:
//   sampleRate
//   numSamples
//   frequency
//   amplitude
//
// Description: Generate a triangle wave for correct number of samples.
//
function triangleWave(sampleRate,numSamples,frequency,amplitude)
{
	
	// If this is the first time we will create the AudioContext object.
	if( typeof ctx == "undefined" )
	{
		ctx = new AudioContext();
	}
	
	// Here we calculate the number of samples for each wave oscillation.
	var samplesPerOscillation = sampleRate / frequency;
	// This is the first quarter of the oscillation. 0 - 1/4
	var first = samplesPerOscillation / 4;
	// This is the second quarter of the oscillation. 1/4 - 1/2
	var second = samplesPerOscillation / 2;
	// This is the third quarter of the oscillation. 1/2 - 3/4
	var third = ( samplesPerOscillation / 2 ) + ( samplesPerOscillation / 4 );
	// We will count the samples as we go.
	var counter = 0;

	// Step value. This is how much the sample value changes per sample.
	var step = 1 / first;

	// Create the buffer for the node.
	var buffer = ctx.createBuffer(1, numSamples, sampleRate);
	
	// Create the buffer into which the audio data will be placed.
	var buf = buffer.getChannelData(0);
	
	// Loop numSamples times -- that's how many samples we will calculate and store.
	for (i = 0; i < numSamples; i++) 
	{
		// Increment the counter.
		counter++;
		
		// This only comes into play at the end of the sample when we
		//		want to make sure it doesn't have an obvious click.
		amplitude = adjustAmplitude( i, numSamples, amplitude );
			
		// See if this is the first quarter.
		if( counter <= first )
		{
			// Store the value.
			buf[i] = step * counter * amplitude;
		}
		// See if this is the second quarter.
		else if( counter <= second )
		{
			// We want the count relative to this quarter.
			var cnt = counter - first;
			
			// Store the value.
			buf[i] = 1 - step * cnt * amplitude;
		}
		// See if this is the third quarter.
		else if( counter <= third )
		{
			// We want the count relative to this quarter.
			var cnt = counter - second;
			
			// Store the value.
			buf[i] = -( step * cnt ) * amplitude;
		}
		// This is the fourth quarter.
		else
		{
			// We want the count relative to this quarter.
			var cnt = counter - third;
			
			// Store the value.
			buf[i] = -1 + ( step * cnt ) * amplitude;
			
			// See if we are done with this cycle.
			if( counter >= samplesPerOscillation )
			{
				// Set to zero so we are ready for another cycle.
				counter = 0;
			}
		}
	}

	// Return the channel buffer.
	return buffer;
}
