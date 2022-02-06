/**
* Init function for application
*
* Grabs elements frequently reused throughout program, declares reused variables, defines functions
* and sets initial state and adds event listeners.
*
*/
function typathonApp() {
  const textSelector = document.querySelector('#text-list');
  const startAndStopButton = document.querySelector('#start-stop');
  const displayedTitle = document.querySelector('#displayed-title');
  const displayedAuthor = document.querySelector('#displayed-author');
  const displayedText = document.querySelector('#displayed-text');
  const inputField = document.querySelector('#input-field');
  const ignoreCasingCheckbox = document.querySelector('#ignore-casing');
  const englishRadiobox = document.querySelector('#english');
  const swedishRadiobox = document.querySelector('#swedish');
  const grossWPMElement = document.querySelector('#gross-wpm');
  const accuracyElement = document.querySelector('#accuracy');
  const netWPMElement = document.querySelector('#net-wpm');
  const errorsElement = document.querySelector('#errors');
  const canvas = document.querySelector('#stats-graph');
  const ctx = canvas.getContext('2d');
  const errorSound = new Audio('./audio/click.wav');
  errorSound.preload = 'auto';
  let textsObject;
  let gameRunning;
  let ignoreCasing;
  let chosenLang;
  let highlighterPosition;
  let typedEntries;
  let typedErrors;
  let t0;
  let grossWPM;
  let xAxisPosition = 0;

  // Functions used for stopped game

  /**
  * Function for loading JSON textsfile using fetch API
  *
  * Fetches json file and parses it into JS object.
  *
  */
  async function loadTextsJSON() {
    textsObject = await fetch('texts.json');
    textsObject = await textsObject.json();
  }

  /**
  * Function for loading the texts array from the JSON file
  *
  * @returns textdata from object of same index as selected text in textSelector
  */
  function getTextData() {
    const textData = textsObject.texts[textSelector.selectedIndex];
    return textData;
  }

  /**
  * Function for populating the text selector from the texts array
  *
  * Waits for loadTextsJSON to finish, then creates an option element filled
  * with the title from the textsObject.
  */
  async function populateTextSelector() {
    await loadTextsJSON();
    for (let i = 0; i < textsObject.texts.length; i += 1) {
      const option = document.createElement('option');
      option.text = textsObject.texts[i].title;
      option.value = textsObject.texts[i].title;
      textSelector.add(option);
    }
    textSelector.selectedIndex = -1;
  }

  /**
  * Function for populating the textwindow based on textdata from the texts array
  */
  function populateTextWindow() {
    const textData = getTextData();

    displayedTitle.textContent = textData.title;
    displayedAuthor.textContent = `${textData.author} (${textData.content.split(' ').length} words, ${textData.content.length} characters)`;
    displayedText.textContent = '';
    for (let i = 0; i < textData.content.length; i += 1) {
      displayedText.insertAdjacentHTML('beforeend', `<span class='letter'>${textData.content.charAt(i)}</span>`);
    }
  }

  /**
  * Function for resetting the available options to initial state
  */
  function resetOptions() {
    textSelector.selectedIndex = -1;
    ignoreCasingCheckbox.checked = false;
    englishRadiobox.checked = false;
    swedishRadiobox.checked = false;
    ignoreCasing = false;
    chosenLang = null;
  }

  /**
  * Function for enabling any disabled elements in textSelector
  */
  function resetTextFilter() {
    textSelector.childNodes.forEach((element) => {
      element.removeAttribute('disabled', '');
    });
  }

  /**
  * Function for disabling and setting initial state for inputfield
  */
  function resetInputField() {
    inputField.setAttribute('disabled', '');
    inputField.setAttribute('placeholder', 'Start typing...');
    inputField.value = '';
  }

  /**
  * Function for emptying the displayed text window
  */
  function resetDisplayedText() {
    displayedTitle.textContent = '';
    displayedAuthor.textContent = '';
    displayedText.innerHTML = '';
  }

  /**
  * Function for resetting the text highlighter
  */
  function resetHighlighter() {
    document.querySelectorAll('.letter').forEach((element) => {
      element.classList.remove('highlighted');
    });
  }

  /**
  * Function for resetting the statistics
  */
  function resetStats() {
    grossWPMElement.textContent = 'Gross WPM: ';
    accuracyElement.textContent = 'Accuracy: ';
    netWPMElement.textContent = 'Net WPM: ';
    errorsElement.textContent = 'Errors: ';
  }

  /**
  * Function for resetting the canvas and the xAxisPosition counter
  */
  function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    xAxisPosition = 0;
  }

  /**
  * Function for enabling the game options
  */
  function enableOptions() {
    textSelector.removeAttribute('disabled', '');
    ignoreCasingCheckbox.removeAttribute('disabled', '');
    englishRadiobox.removeAttribute('disabled', '');
    swedishRadiobox.removeAttribute('disabled', '');
  }

  /**
  * Function for filtering out enabled options in textSelector depending on
  * value of chosenLang
  *
  * Enables all options, then disables all options for the wrong language and resets displayed text.
  */
  function filterTexts() {
    textSelector.childNodes.forEach((element, index) => {
      if (textsObject.texts[index].language !== chosenLang) {
        element.setAttribute('disabled', '');
      } else {
        element.removeAttribute('disabled', '');
      }
    });
    textSelector.selectedIndex = -1;
    resetDisplayedText();
  }

  /**
  * Event handler for ignore casing checkbox.
  *
  * Sets ignoreCasing to true when box is checked, and false if unchecked.
  */
  function ignoreCasingCheckboxHandler() {
    if (this.checked) {
      ignoreCasing = true;
    } else {
      ignoreCasing = false;
    }
  }

  /**
  * Event handler for english radiobox.
  *
  * Sets chosenLang to eng when box is checked and calls
  * filterTexts function.
  */
  function englishRadioboxHandler() {
    chosenLang = 'eng';
    filterTexts();
  }

  /**
  * Event handler for swedish radiobox.
  *
  * Sets chosenLang to swe when box is checked and calls
  * filterTexts function.
  */
  function swedishRadioboxHandler() {
    chosenLang = 'swe';
    filterTexts();
  }

  // Functions used for started game

  /**
  * Function for enabling, focusing and removing placeholder for input field
  */
  function textInput() {
    inputField.removeAttribute('disabled', '');
    inputField.setAttribute('placeholder', '');
    inputField.focus();
  }

  /**
  * Function for disabling all options
  */
  function disableOptions() {
    textSelector.setAttribute('disabled', '');
    ignoreCasingCheckbox.setAttribute('disabled', '');
    englishRadiobox.setAttribute('disabled', '');
    swedishRadiobox.setAttribute('disabled', '');
  }

  /**
  * Function for parsing input from the input field and comparing
  * against highlighted character
  *
  * If spacebar is pressed, clears input field.
  *
  * If entered character is not same as the highlighted character:
  *
  * If ignore casing is enabled, tests if the entered character is
  * the case insensitive same character, if true, marks the character as passed,
  * if false, marks it as error, plays error sound and increments error counter.
  *
  * If ignore casing is disabled, marks it as error, plays error sound and increments error counter.
  *
  * If entered character is same as the highlighter character:
  *
  * Marks the character as passed.
  *
  * Increments typedEntries for all cases.
  */
  function parseInput(event) {
    const currentLetter = document.querySelector('.highlighted').textContent;

    if (event.data === ' ') {
      inputField.value = '';
    }
    if (event.data !== currentLetter) {
      if (ignoreCasing === true) {
        if (event.data.localeCompare(currentLetter, undefined, { sensitivity: 'accent' }) === 0) {
          displayedText.children[highlighterPosition - 1].classList.add('passed');
        } else {
          displayedText.children[highlighterPosition - 1].classList.add('error');
          errorSound.play();
          typedErrors += 1;
        }
      } else {
        displayedText.children[highlighterPosition - 1].classList.add('error');
        errorSound.play();
        typedErrors += 1;
      }
    } else {
      displayedText.children[highlighterPosition - 1].classList.add('passed');
    }
    typedEntries += 1;
  }

  /**
  * Function for the text highlighter
  *
  * Stops game without removing statistics if highlighter position moves beyond text length.
  *
  * If highlighter position is not at the first position,
  * removes highlighting form previous character.
  *
  * Highlights character and inrements highlighter position counter.
  */
  function textHighlighter() {
    const textData = getTextData();
    if (highlighterPosition === textData.content.length) {
      stopGame();
      stopGame.leaveStats();
      return;
    }
    if (highlighterPosition > 0) {
      displayedText.children[highlighterPosition - 1].classList.remove('highlighted');
    }
    displayedText.children[highlighterPosition].classList.add('highlighted');
    highlighterPosition += 1;
  }

  /**
  * Function for printing statistics
  *
  * Calculates elapsed minutes, gross wpm, net wpm and accuracy and
  * writes data to corresponding elements in the page.
  */
  function stats() {
    const elapsedMinutes = ((Date.now() - t0) / 1000) / 60;
    grossWPM = (typedEntries / 5) / elapsedMinutes;
    const netWPM = grossWPM - (typedErrors / elapsedMinutes);
    const typedAccuracy = ((typedEntries - typedErrors) / typedEntries);

    grossWPMElement.textContent = `Gross WPM: ${Math.round(grossWPM)}`;
    accuracyElement.textContent = `Accuracy: ${(Math.round(typedAccuracy * 100)).toFixed(0)}%`;
    if (netWPM >= 0) {
      netWPMElement.textContent = `Net WPM: ${Math.round(netWPM)}`;
    } else {
      netWPMElement.textContent = 'Net WPM: < 0';
    }
    errorsElement.textContent = `Errors: ${typedErrors}`;
  }

  /**
  * Function for drawing the canvas background lines
  *
  * Declares a line distance and draws horizontal lines and scale numbers
  * for every multiple of the line distance inside the height of the canvas.
  *
  * Uses one iterator for iteration count, and a reverse iterator for writing scale numbers
  * to account for the fact that the Y axis is flipped.
  */
  function drawCanvasBackground() {
    const yLineDistance = 25;
    ctx.resetTransform();
    ctx.strokeStyle = '#8d8d8d80';
    for (let i = 0, num = canvas.height; canvas.height > i; i += yLineDistance, num -= yLineDistance) {
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
      ctx.font = '9px Arial';
      ctx.textAlign = 'start';
      ctx.fillText(`${num}`, 0, i - 2);
    }
    ctx.beginPath();
  }

  /**
  * Function for drawing the statistics line graph
  *
  * Divides canvas width with text length to get an x axis increment value,
  * then inverts the Y axis of the canvas.
  *
  * Sets startposition to XY(0, half of height) if typed entries is 0
  *
  * Then draws a line to XY(xAxisPosition, grossWPM) and increments xAxisPosition with the
  * calculated xAxisIncrement.
  */
  function drawCanvasLine() {
    const textData = getTextData();
    const textLength = textData.content.length;
    const xAxisIncrement = canvas.width / textLength;
    ctx.setTransform(1, 0, 0, -1, 0, canvas.height);
    ctx.strokeStyle = '#2C2C2C80';

    xAxisPosition += xAxisIncrement;
    if (typedEntries === 1) {
      ctx.moveTo(0, canvas.height / 2);
    }
    ctx.lineTo(xAxisPosition, grossWPM);
    ctx.stroke();
  }

  /**
  * Event handler for the inputfield event.
  */
  function inputFieldEventHandler(event) {
    parseInput(event);
    stats();
    drawCanvasLine();
    textHighlighter();
  }

  // Start and stop game functions

  /**
  * Function for handling starting of the game
  *
  * Returns null if no text is selected.
  *
  * Resets statistical values, and highlighter position,
  * executes funtions for the running state and sets
  * gameRunning to true.
  */
  function startGame() {
    if (textSelector.value === '') {
      return;
    }
    startAndStopButton.src = './img/stop.jpg';
    highlighterPosition = 0;
    typedEntries = 0;
    typedErrors = 0;
    t0 = Date.now();
    textInput();
    textHighlighter();
    resetCanvas();
    drawCanvasBackground();
    disableOptions();
    gameRunning = true;
  }

  /**
  * Function for handling stopping of the game
  *
  * Nested function full() executes all stopping functions, and nested function leavestats()
  * leaves the statistics on screen.
  *
  * Sets gameRunning value to false.
  */
  function stopGame() {
    function full() {
      if (textSelector.children.length === 0) {
        loadTextsJSON();
        populateTextSelector();
      }
      startAndStopButton.src = './img/play-circle.jpg';
      resetOptions();
      resetInputField();
      resetHighlighter();
      resetDisplayedText();
      resetStats();
      resetCanvas();
      resetTextFilter();
      enableOptions();
      gameRunning = false;
    }

    function leaveStats() {
      startAndStopButton.src = './img/play-circle.jpg';
      resetOptions();
      resetInputField();
      resetHighlighter();
      resetTextFilter();
      enableOptions();
      gameRunning = false;
    }
    stopGame.full = full;
    stopGame.leaveStats = leaveStats;
  }

  /**
  * Event handler for the start and stop button
  *
  * Starts or stops the game depending of value of gameRunning variable.
  *
  */
  function startAndStop() {
    switch (gameRunning) {
      case false:
        startGame();
        break;
      case true:
        stopGame();
        stopGame.full();
        break;
      default:
        break;
    }
  }

  // Executes initial state and event listeners for app
  stopGame();
  stopGame.full();
  startAndStopButton.addEventListener('click', startAndStop);
  textSelector.addEventListener('change', populateTextWindow);
  inputField.addEventListener('input', inputFieldEventHandler);
  ignoreCasingCheckbox.addEventListener('change', ignoreCasingCheckboxHandler);
  englishRadiobox.addEventListener('change', englishRadioboxHandler);
  swedishRadiobox.addEventListener('change', swedishRadioboxHandler);
}

window.addEventListener('load', typathonApp);
