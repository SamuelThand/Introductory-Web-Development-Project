# Projektuppgift

## Environment & Tools

Ubuntu 20.04 LTS, Visual Studio Code 1.61.2, Git 2.25.1

## Purpose

### Perspective

The student needs to understand how to create a proper HTML/CSS/JS project directory structure. The student needs to understand how to create a touch typing application which behaves as stated in the project description with all necessary technology. A basic understanding of Javascript and all the common tools regularly used needs to be showcased.

### Concrete goals

The student needs to create a one page application that has a header, with a logo, a footer with copyright info and an email link, a text selector with settings, a window that displays text details and the text content, an input field and start/stop controls, and statistics. There also needs to be text statistics displayed in the text window, two custom fonts, a repeating animation, color variation based on type errors/typed letters, options to ignore casing, error sounds, text file loading from JSON or XML, and a canvas that displays statistics as a graph.  

## Procedures

### HTML

#### index.html

Set doctype to html, create a html element with lang "en" for English.

Create a head element with 3 meta tags, charset set to UTF8, and http-equiv attribute set to "X-UA-Compatible", content attribute set to "IE=edge" this is to declare that the page should be rendered using the Edge on internet explorer browsers. This is to ensure backwards compatibility for old browsers.

Use the third meta tag to set the viewport to width=device-width, initial-scale=1.0. This makes the website render better on mobile devices or other small screens, instead of the user having to zoom around and look at the page in a desktop format.

Set a page title.

Create a link element for the CSS stylesheet css/style.css

Create a link element for the favicon icon, and a script element linking to the main.js file.

Create a body element for page content.

Create a header element for the header section.

Use an img element with src attribute to the logo, and a describing alt attribute.

Create a main section for the main page content with class text-list-container.

Create a section for the text list container, class text-list-container with an h2, label and a select element with id text-list.

Create a section for the options with class options, with label and checkbox input for ignore-casing, with class ignore-casing and a paragraph for select language.

Create a div for containing the two language checkboxes in the same grid cell with class language-radioboxes, and two label/input type radio checkboxes for the checkboxes. Checkbox ids english, swedish.

Create a section for input and controls with class input-and-controls, with an h2, input type text field, and an img element for the start and stop button with id start-stop.

Create a section for the graph-container with class graph-container, containing an h2, a canvas element with id stats-graph and a paragraph.

Create a section for the statistics with class stats, containing an h2 and four paragraphs with ids gross-wpm, accuracy, net-wpm and errors.

Create a footer with copyright information and an email link.

### CSS

Create two @font-face selectors for the custom fonts, and state font family, a src rule with the url and font format. Declare font-weight bold in the second selector.

Designate a section for general / desktop styles.

Use an universal CSS selector to apply a CSS reset which removes the default 8px margin and padding for all downstream elements and sets box sizing to border-box. Border box is important to make specified height and width values include padding and margin. This simplifies resizing containers.

Use an html selector to set the default font size to 16px and font family to custom font, monospace for the entire site. Set a background for the html element and a text color.

Use a body selector and set margin to 0 auto for 0 margin top/bottom and auto margin left/right. This ensures the content container is centered. Set minimum height to 100% of viewport height to ensure height of the body container is at least the entire screen, with room to grow more. Set display to flex and flex-direction to column to stack the website vertically, and put max-width 600px to comply with the instructions.

Declare selector for header, with display flex, justify-content center to center it.

Declare selector for main, with display flex, flex-direction column to stack the main content vertically.

Declare a selector for footer with display flex, flex-direction column and align-items center to center the contained items horizontally and put border-top 1px solid to make a clear distinction between footer and main content.

Give the email link in the footer some bottom padding.

Declare a section for Logo animation.

Declare selector for the header logo, and put rules
  animation-name: logo-transform;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-direction: alternate;

This defines a name for the animation, a duration of 2s, amount of iterations to infinite and the direction to alternate for each iteration.

Declare a selector @keyframes logo-transform, and put the rules

from {
    opacity: 1;
  }

  to {
    opacity: 0.1;
  }

This states that the animation will consist of gradually changing opacity from 1 to 0.1, and then back again and alternating in this fashion since the animation-direction is set to alternate.

Declare a section for the main section

Declare selectors for .text-list.container, .options, .text-window, .input-and-controls, .stats, .graph-container and set display to flex/grid and assign proper margins, paddings and borders. Rules used are:
 
 flex-direction - Define the main axis to stack the contained content
 align-items - align items vertically inside rows/columns
 justify-items - align items horizontally inside rows/columns
 grid-template-columns - Specifies how many columns the grid should have and their width
 grid-template-rows - Specifies how many rows the grid should have and their height
 
Declare selectors for #input-field, #start-stop and assign margins, paddings and other layout rules.

Declare selectors for typography and write fitting rules.

Declare a selector for #start-stop:hover with rules opacity 0.5, and cursor:pointer to make the button have a clickable feel.

Declare selectors for the classes .highlighted, .error and .passed and give .highlighted a gray background, .error a red text color, and .passed a light gray text color.

### Javascript

Add an event listener in the global scope to the window object with the load event type parameter. This ensures the event handler is run only when the DOM is fully loaded. Associate the handler typathonApp to this event listener.

Nested inside this app function do the following:

Use document.queryselector to access all relevant elements from the page and declare them as constants. This includes IDs #text-list, #start-stop, #displayed-title, #displayed-author, #displayed-text, #input-field, #ignore-casing, #english, #swedish, #gross-wpm, #accuracy, #net-wpm, #errors.

Declare constant errorSound using new Audio(audiofile), and use errorSound.preload = 'auto' to preload the audio at initialisation.

Declare variables that are reused in multiple functions. This includes textsObject, gameRunning, letignoreCasing, chosenLang, highlighterPosition, typedEntries, typedErrors, t0, grossWPM, xAxisPosition = 0

After function declarations, execute stopGame.full(); to set the initial stopped game state, and add event listeners.

Event listeners, types and handlers:

startAndStopButton.addEventListener('click', startAndStop);
textSelector.addEventListener('change', populateTextWindow);
inputField.addEventListener('input', inputFieldEventHandler);
ignoreCasingCheckbox.addEventListener('change', ignoreCasingCheckboxHandler);
englishRadiobox.addEventListener('change', englishRadioboxHandler);
swedishRadiobox.addEventListener('change', swedishRadioboxHandler);

#### loadTextsJSON()

Set the function to async so that you can await the promise to resolve for the fetching of the json file.

Fetch the json file using fetch(), and parse it to json using json(), assign to variable textsObject.

#### getTextData()

Index into the textsObject.texts array using the .selectedIndex on the select element and assign to a variable textData, and return the variable.

#### populateTextSelector()

Set the function to async so that you can await the loadTextsJSON function to resolve. Set await loadTextsJSON(); to do this.

Create an option element and use a for loop to iterate through all textsObject.texts[iterator].title and set the options .text and .value properties to equal this, and add the option to the textSelector.

Set textSelector.selectedIndex to -1 to unselect all options.

#### populateTextWindow()

Assign return value of getTextData() to variable textData.

Write the textData.title to displayedTitle.textContent and textData.Author to displayAuthor.textContent in a formatted string with calculated words and character length. Empty displayedText.textContent to prepare for writing of the textcontent.
Loop over each letter in textData.content and insert the letter encapsulated within a span element with class .letter using insertAdjacenthtml.

#### resetOptions()

Empty the text selector by setting selectedindex to -1, put .checked parameter for each button to false to uncheck them, and put ignoreCasing = false and chosenLang - null. This resets options and their values to initial state.

#### resetTextFilter()

Loop over each textSelector option using childNodes.forEach and remove the disabled attribute for each element. This enables any disabled option

#### resetInputField()

Set attribute disabled, and placeholder with the 'Start typing text', and its value to an empty string. This resets the input field to the initial state.

#### resetDisplayedText()

Set displayedTitle, Author textContent to an empty string, and displayedText innerHTML to an empty string. This empties the text window.

#### resetHighlighter()

Use querySelectorAll to select all elements with class letter, and iterate over them using forEach. Remove the .highlighted class from all letters.

#### resetStats()

Set textContent of all statistics elements to their title followed by a colon and a space.

#### resetCanvas()

Use context.clearRect with the canvas starting corner and width and height specified as parameters to erase the drawn canvas pixels. Then use context.beginPath to empty all paths and create a new one. Set xAxisPosition to = 0 to reset the counter used when drawing.

#### enableOptions()

Remove the disabled attribute from all radio/checkboxes and the text selector.

#### filterTexts()

Iterate over all text selector options elements and test if the textsObject.texts[same index as option].language is not equal to the chosenLang variable, if true, set the attribute disabled, else remove the disabled attribute.

#### ignoreCasingCheckboxHandler()

Test if the button was checked, if true set ignoreCasing to true, else to false.

#### englishRadioboxHandler()

Set chosenLang to eng and execute filterTexts()

#### swedishRadioboxHandler()

Set chosenLang to swe and execute filterTexts()

#### textInput()

Remove disabled attribute, set an empty placeholder text and .focus() on the inputField.

#### disableOptions()

Set disabled attribute to text selector, and all check/radio boxes

#### parseInput()

Assign the element with class .highlighted to constant currentLetter.

Use event.data to access entered characters.

If event.data is a blank space, set inputfield.value to an empty string. This empties the input field for each space character.

If event.data is not equal to currentLetter, check if ignoreCasing is enabled, if true, check if  event.data.localeCompare with currentLetter, undefined, and accent sensitivity equals 0. This checks if the character is the same character but cased differently. If true, add the highlighted character - 1 to the passed class. If false, add highlighted character - 1 to error class and play the error sound and increment typedErrors counter by 1.

If ignoreCasing is not True,  add highlighted character - 1 to error class and play the error sound and increment typedErrors counter by 1.

If event.data is equal to currentLetter, add the highlighted character - 1 to passed class and increment typedEntries by 1.

#### textHighlighter()

Get text data from getTextData, check if highlighterPosition equals the textData.content length, if so, stop the game using stopGame.leaveStats() function and return.

if highlighterPosition is larger than 0, remove the highlighted class from the highlighted character - 1.

Add the character of the current highlighterPosition index to class highlighted, and increment highlighter position with 1.

#### stats()

Declare constant elapsedMinutes and assign the difference between current time and t0 converted from ms to minutes.

Calculate grossWPM, netWPM and typedAccuracy according to specified formulas and assign to variables.

Write values rounded off to whole integers and percentage to the statistics elements on page.

#### drawCanvasBackground()

Declare a constant yLineDistance and assign the desired value.

Use context.resettransform(); to restore the y axis to original, and .strokeStyle to designate a color to the lines to be drawn.

Make a for loop with two counters, one i for counting iterations, and one num for defining the y axis value. It starts at 0 and increments by yLinedistance for each iteration, num starts at canvas.height and deincrements with yLineDistance. This is used because the y axis is flipped and y axis values need to be drawn in 'reverse'.

For each iteration, define starting position at (x, i), draw a line to (canvas,width, i), declare font and textalign, and the text value of num at position (0, i - 2) this is to at the beginning of each line and 2 pixels above the line in Y axis.

Empty all stored paths and start a new path.

#### drawCanvasLine()

Get text data using getTextData, and declare constant textLength with textData.content.length assigned.

Declare constant xAxisIncrement and assign canvas.width / textLength.

This is the incremental value that will be used when drawing across the x axis, since it divides the canvas evenly depending on the text length.

Use context.setTransform with the values of (1, 0, 0, -1, 0, canvas.height). The parameters changed are for horizontal scaling, which is to be kept the same, therefore a 1 is used, and vertical scaling, which is inverted by a -1. This will invert the y axis of the canvas and simplify drawing of lines like a mathematical graph.

Increment xAxisposition with xAxisIncrement.
Set a strokestyle for the line, and test if typed entries are equal to 1. If true, set a start position for the line by using context.moveto(0, canvas.height / 2). This sets the start position at x = 0 and y = half of canvas height.

Then use context.lineTo(xAxisposition, grossWPM) and context.stroke(). This will draw a line to x = xAxisPosition and y = grossWPM every time a key is stroked, since the function is executed when the inputField input event triggers.

#### inputFieldEventHandler()

Execute functions parseInput(event), stats(), drawCanvasLine() and textHighlighter().

#### startGame()

If textSelector.value is empty, return. This will ensure a game cannot be started without text selection.

Set src to startAndStopButton to the stop image, set highlighterposition, typedentries, typedErrors to 0 and t0 to Date.now(). This will record the time of game start into variable t0.

Execute functions textInput(), textHighlighter(), resetCanvas(), drawCanvasBackground(), disableOptions() and set gameRunning to true.

#### stopGame()

##### full()

If the text selector is empty, execute functions loadTextsJSON and populateTextSelector. Set src to startAndStopButton to the start image, and execute functions resetOptions(), resetInputField(), resetHighlighter(), resetDisplayedText(), resetStats(), resetCanvas(), resetTextFilter() and enableOptions(). Set gameRunning to false.

##### leaveStats()

Set src to startAndStopButton to the start image, and execute functions resetOptions(), resetInputField(), resetHighlighter(), resetTextFilter() and enableOptions(). Set gameRunning to false.

#### startAndStop()

Use a switch statement on the gameRunning variable.

If the variable returns false, execute startgame().

If variable returns true, execute stopGame.full()

## Discussion

### Perspective

I think the purpose has been fulfilled. I have learned much from the areas mentioned under perspective, and I believe the implementation fulfills the concrete goals stated under Concrete Goals, as well as the requirements. For the assignment level I think the implementation is suitable. What could be considered is restructuring of reused variables into properties of objects with related functionality. This would improve the modularity of the solution and create distinct segments for related functionality. Further structuring of related functionality into inner functions or objects can also be considered. I believe the solution certainly can be scoped into a more logical and appropriate structure, that would increase the cohesion of the game components. What could also be a major improvement is further study of application development best practices, on how to structure code and functionality according to industry best practices.

### Personal reflections

I got to consolidate/improve much of my previously gained Javascript knowledge, as well as learn many new technologies such as canvas, asynchronous functions, and JSON fetching. It was also a fun project to do, since I like speed typing.

I found the structuring of functionality with events and coordinating functionality without the use of many 'global' variables to be tricky.

Learning to use the chrome devtools for debugging and testing has been an incredibly important part in my solution, and I think it would be a good idea to include a basic tutorial for this in the curriculum for the next round of this course. Google has a good short tutorial that walks through everything you need to get started. 


