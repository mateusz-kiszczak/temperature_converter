// GET VALUES

// Get current values from HTML form.
const getInputValue = () => {
    let inputValue = document.getElementById('form-input').value;
    
    if (inputValue) {
        return inputValue;
    }
};

const getSelectValue = () => {
    let selectValue = document.getElementById('form-select').value;

    return selectValue;
};


// CALCULATE TEMPERATURES

// Convert to Celsius degrees.
const convertToC = (num, unit) => {
    switch(unit) {
        case 'fahrenheit':
            return (num - 32) * (5/9);
            break;
        case 'kelvin':
            return num - 273.15;
            break;
        case 'newton':
            return num * (303/100);
            break;
        case 'rankine':
            return (num - 491.67) * (5/9);
            break;
        case 'reaumur':
            return num * (5/4);
            break;
        default:
            return num;
            break;
    }
};

// Convert Celsius to other units.
const convertCToAll = num => {
    let celsiusToCelsius = (num * 1);
    let celsiusToFahrenheit = (num * 9/5) + 32;
    let celsiusToKelvin = (num * 1 + 273.15);
    let celsiusToNewton = num * (100/303);
    let celsiusToRankine = (num * 9/5) + 491.67;
    let celsiusToReaumur = num * (4/5);
    
    return [celsiusToCelsius, celsiusToFahrenheit, celsiusToKelvin, celsiusToNewton, celsiusToRankine, celsiusToReaumur];
};


// CREATE OUTPUT

// Order of all items counts.
// Items in the first array are qual to the values from "option" elements in HTML.
const unitsValues = ['celsius', 'fahrenheit', 'kelvin', 'newton', 'rankine', 'reaumur'];
const unitsInWords = ['Celsius', 'Fahrenheit', 'Kelvin', 'Newton', 'Rankine', 'Réaumur'];
const unitsSigns = ['&#176;C', '&#176;F', '&#176;K', '&#176;N', '&#176;Ra', '&#176;Ré'];

// Check if value is between 0 and 1|-1. Return word in singular|plural where aplicable.
const checkWordMultiplicity = (num, singular, plural) => num > 1 || num < -1 ? plural : singular;

// Round the number to two decimals (where applicable).
const roundToTwo = num => +(Math.round(num + 'e+2') + 'e-2');

// Output description.
const setOutputDescribtion = () => {
    let formOutput = document.getElementById('form-output');
    formOutput.removeChild(formOutput.firstElementChild); // Remove "p" element.

    let newDescription = document.createElement('p'); // Create new "p" element.
    let indexOfSelectedUnit = unitsValues.findIndex(element => element === getSelectValue());

    // Function takes number value and string value as a parameters. The arguments are values from "input" element and "select" element respectively.
    let convertToCFunction = convertToC(getInputValue(), getSelectValue());
    let convertedValues = convertCToAll(convertToCFunction); // Use above function as a parameter (array).

    // Add new content to the new "p" element.
    newDescription.innerHTML = `<b>${getInputValue() ? getInputValue() : '-'}${unitsSigns[indexOfSelectedUnit]}</b> 
    (${unitsInWords[indexOfSelectedUnit]} ${checkWordMultiplicity(convertedValues[indexOfSelectedUnit], 'degree', 'degrees')}) 
    ${checkWordMultiplicity(convertedValues[indexOfSelectedUnit], 'is', 'are')} equal to:`;
    // Output samples: 
    // "<b>5°C</b> (Celsius degrees) are qual to:"
    // "<b>1°N</b> (Newton degree) is qual to:"

    // Add the completed "p" element as a first child.
    formOutput.prepend(newDescription);
};

// Create multiply list items with updated content.
const setOutputList = () => {
    let outputList = document.getElementById('output-list');
    outputList.innerHTML = ''; // Clear current list items.

    // Function takes number value and string value as a parameters. The arguments are values from "input" element and "select" element respectively.
    let convertToCFunction = convertToC(getInputValue(), getSelectValue());
    let convertedValues = convertCToAll(convertToCFunction); // Use above function as a parameter (array).

    // Create new array with values of items rounded to max two decimals.
    let convertedValuesRounded = convertedValues.map(element => roundToTwo(element));
    
    // Create and add list items for each element different from selected "option" element's value (<option value="" selected> in HTML).
    unitsValues.forEach((element, index) => {
        if (element !== getSelectValue()) {
            let newListItem = document.createElement('li'); // Create new list item.

            newListItem.innerHTML = `<b><span class="left-part">${convertedValuesRounded[index] || convertedValuesRounded[index] === 0 ? convertedValuesRounded[index] : '-'}${unitsSigns[index]}</span></b><span>(${unitsInWords[index]} ${checkWordMultiplicity(convertedValues[index], 'degree', 'degrees')})</span>`;

            outputList.append(newListItem);
        }
    });
};


// FINAL FUNCTION

const convertTemps = () => {
    setOutputDescribtion();
    setOutputList();
}


// ALERTS

const showInputAlert = () => {
    if (inputElement.classList.contains('valid-input')) {
        inputElement.classList.replace('valid-input', 'invalid-input');
    }
};

const hideInputAlert = () => {
    if (inputElement.classList.contains('invalid-input')) {
        inputElement.classList.replace('invalid-input', 'valid-input');
    }
};

const showAlertBox = str => {
    let alertContainer = document.getElementById('warning'); // Get alert box "div".
    let newPhrase = document.createElement('p'); // Create new "p" element.

    // If no other alert currently exist... ("noscript" element is constant child).
    if (alertContainer.childElementCount === 1) {
        newPhrase.innerHTML = str; // Add content to new "p" element (content === function argument).
        alertContainer.classList.replace('inactive-alert', 'active-alert'); // Replace container styles to "active".
        alertContainer.prepend(newPhrase); // Add string message.
    }
};

const hideAlertBox = () => {
    let alertContainer = document.getElementById('warning'); // Get alert box "div".

    if (alertContainer.childElementCount >= 2) { // If some alert already exist...
        alertContainer.classList.replace('active-alert', 'inactive-alert'); // Replace container styles to "inactive".
        alertContainer.removeChild(alertContainer.firstElementChild); // Remove "p" element.
    }
};


// EVENT LISTENERS 

const inputElement = document.getElementById('form-input');
const selectElement = document.getElementById('form-select');

/*  A regular expression that will check if the input has:
    1.  Zero or one minus sign "-" at the beginning, from one to three integers followed by a dot "." and another two integers.
        This pattern will check if the value is not bigger than 999.99 and smaller than -999.99.
    OR
    2.  Zero or one minus sign "-" at the beginning, from one to three integers.
        This pattern will check if the value is not bigger than 999 and smaller than -999.
    OR
    3.  Dot "." and up to two integers.
        This pattern will allow the decimals without zero "0" as the first character, e.g. ".69".
    
    Check validated input with and without decimals (max. two decimals).*/
const inputRegEx = /(?<!.)\-?\d{1,3}\.\d{1,2}(?!.)|(?<!.)\-?\d{1,3}(?!.)|(?<!.)\-?\.\d{1,2}(?!.)/;

// When focus on "input" element, select current input value.
inputElement.addEventListener('focus', function() {
    this.select();
});

selectElement.addEventListener('input', () => {
    convertTemps();
});

inputElement.addEventListener('input', function() {
    let alertMessage = '<b>INVALID INPUT</b><br/>Please enter the value between -999.99 and 999.99';
    if (inputRegEx.test(this.value) || this.value === '') { // If input value is between -999.99 to 999.99 OR empty...
        if (this.value === '') {
            showAlertBox(alertMessage);
            showInputAlert();
        } else {
            hideAlertBox();
            hideInputAlert(); 
        }
    } else {
        nonNumberCollection = [];
        if (/\-?\d{1,3}\.\d{3,}/.test(this.value)) { // If user try to put more than 2 decimals...
            let dotIndex = this.value.indexOf('.'); // Find index of dot ".".
            this.value = this.value.slice(0, (dotIndex + 3)); // Slice the input value two places after dot.
        } else if (/\-?\d{4,}/.test(this.value)) { // If user try to put more than 3 integers...
            let hasMinus = this.value.includes('-'); // Check if the input value has minus "-"...
            hasMinus ? this.value = this.value.slice(0, 4) : this.value = this.value.slice(0, 3); // If yes slice to length of 4, if no slice to length of 3.
        } else if (/-\?\.\d{3,}/) { // If user try to put more than 2 decimals, without using zero "0" before the dot "."...
            this.value = this.value.slice(0, 4); // Slice to length of 4.
        } else {
            showAlertBox(alertMessage);
            showInputAlert();
        }
    }

    convertTemps();
});