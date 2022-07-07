// basic math operators
function add(a, b) {
    // parse function to avoid string concatenation
    return parseFloat(a) + parseFloat(b); 
};

function subtract(a, b) {
    return a - b;
};

function multiply(a, b) {
    return a * b;
};

function divide(a, b) {
    return a / b;
};

// calls one of the above functions on the numbers
function operate(operator, a, b) {
    if (operator == "add") {
        return add(a, b);
    } else if (operator == "subtract") {
        return subtract(a, b);
    } else if (operator == "multiply") {
        return multiply(a, b);
    } else if (operator == "divide") {
        return divide(a, b);
    }
};


// START VALUES
let displayValue = 0; // the 'screen's' start value is equal to 0
let ifDotExists = 0; // i.e. function that adds a dot hasn't run
let ifEquals = 0; // i.e. function that dispalys the result after pressing '=' hasn't run
let firstNumber = null;
let secondNumber = null;
let operatorButtonWhich = 0; // stores which operator button has been selected
let isOperatorButtonClickedFirstTime = 0;
let backspaceBlockIfButonSelected = 0; // if this value is equal to 1 it stops the 'backspace' button from reducing the value on the 'screen'


// displays the number value on the 'screen'
const display = document.getElementById('display');

function showValue(e) {
    // the user can undo if they choose the wrong number
    backspaceBlockIfButonSelected = 0;
    // if the user selects a number after the equals function has run -> reset everything and display that number
    if (ifEquals === 1) {
        resetCalculator();
        displayValue = e.target.value;
        // concatenate strings if the current value is '0.'  
    }  else if (displayValue === '0.') {
        displayValue += e.target.value;
        // if displayValue is 0 (in either string or number form) replace it with the selected one, otherwise there'll be values like '0123' instead of '123'
    }  else if (displayValue == 0) {
        displayValue = e.target.value;   
        // otherwise just concatenate strings (e.g. '3' + '2' = '32') as long as they fit on the screen (i.e. displayValue doesn't exceed 15 chars)
    }  else if (displayValue.length < 15 && displayValue != 0) {
        displayValue += e.target.value;
    }
    // and then show this value on the 'screen'
    display.textContent = displayValue;
};

const numButton = document.querySelectorAll('.num');
numButton.forEach(numButton => numButton.addEventListener('click', showValue));


// operator button; determines which button was clicked and when
function whichButton(e) {
    // reset the values 
    ifEquals = 0; // otherwise the first if of the showvalue function will run and reset everything
    displayValue = 0; // without this showValue would keep concatenating even after selecting an operator
    ifDotExists = 0; // dot can be used again for the second number

    // 0 -> assign the value visible on the 'screen' to the firstNumber variable (when entering the number for the first time or after running the equals function)
    if (isOperatorButtonClickedFirstTime === 0) {
        firstNumber = display.textContent;
        isOperatorButtonClickedFirstTime++; // iteration, so that this if statement becomes false and the else condition can run next
        operatorButtonWhich = e.target.value; 
        backspaceBlockIfButonSelected = 1;
        secondNumber = 0; // it's 0 here, so that the equals function can run if the user clicks the '=' button
    } else {
        eqFirst.textContent = firstNumber;
        eqOperator.textContent = operatorButtonWhichToSymbol(operatorButtonWhich);
        secondNumber = display.textContent;
        eqSecond.textContent = secondNumber;
        // prevents dividing by 0; displays a message and resets the calcualator
        if (operatorButtonWhich == "divide" && secondNumber == 0) {
            display.textContent = 'division by zero ;)';
            setTimeout(function () {
                resetCalculator();
            }, 1000);
            return;
        }
        // first number becomes the result of calculation of the first pair of numbers; uses the operator from the previous selection
        firstNumber = operate(operatorButtonWhich, firstNumber, secondNumber);
        eqEquals.textContent = '=';
        eqResult.textContent = numberMaxLength(firstNumber);
        display.textContent = numberMaxLength(firstNumber);  
        // new operator assigned to the variable after the calculation has run
        operatorButtonWhich = e.target.value;
        backspaceBlockIfButonSelected = 1;
    }
};

const operatorButton = document.querySelectorAll('.op'); // buttons with operator class
operatorButton.forEach(operatorButton => operatorButton.addEventListener('click', whichButton));


// equals button
const equalsButton = document.getElementById('equals');
equalsButton.addEventListener('click', equals);

function equals() {
        // doesn't run without a valid operator or numbers
        if (operatorButtonWhich === 0 || firstNumber === null || secondNumber === null) {
            return;
        }
        secondNumber = displayValue;
        // prevents division by 0
        if (operatorButtonWhich == "divide" && secondNumber == 0) {
            display.textContent = 'division by zero ;)';
            setTimeout(function () {
                resetCalculator();
            }, 1000);
            return;
        }
        eqFirst.textContent = firstNumber;
        firstNumber = operate(operatorButtonWhich, firstNumber, secondNumber);
        eqOperator.textContent = operatorButtonWhichToSymbol(operatorButtonWhich);
        eqSecond.textContent = secondNumber;
        eqEquals.textContent = '=';
        eqResult.textContent = numberMaxLength(firstNumber);
        display.textContent = numberMaxLength(firstNumber);
        
        // resets these values, so that the first 'if' from the 'whichButton' function can run
        operatorButtonWhich = 0;
        secondNumber = 0;
        isOperatorButtonClickedFirstTime = 0;
        ifEquals = 1;
};


// dot button that lets the user input decimals
const dot = document.getElementById('dot');
dot.addEventListener('click', dotFunction);

function dotFunction() {
    if (ifDotExists === 0 && ifEquals === 0 && backspaceBlockIfButonSelected === 0) {
        displayValue += '.';
        display.textContent = displayValue;
        ifDotExists = 1;
    } else {
        return;
    }
};

// backspace
const backspace = document.getElementById('backspace');
backspace.addEventListener('click', back);

function back() {
    if (backspaceBlockIfButonSelected === 0 && ifEquals === 0) {
        if (displayValue.toString().length > 1) {
            if ((displayValue.toString().slice(0, -1)).includes('.')) {
                ifDotExists = 0;
            }
            displayValue = displayValue.toString().slice(0, -1);
            display.textContent = displayValue;
            return displayValue; 
        } else if (displayValue.toString().length === 1) {
            displayValue = display.textContent = 0;
            return displayValue;
        }
    }
};



// resets everything after clicking the AC button
const reset = document.getElementById('ac');
reset.addEventListener('click', resetCalculator);

function resetCalculator() {
    firstNumber = null;
    secondNumber = null;
    displayValue = 0;
    operatorButtonWhich = 0;
    display.textContent = 0;
    isOperatorButtonClickedFirstTime = 0;
    ifDotExists = 0;
    ifEquals = 0
};


// adds darker background to yellow butons when hovered
const yellowButtons = document.querySelectorAll('.yellow');
let yellowButtonArray = Array.from(yellowButtons);

for (let i = 0; i < yellowButtonArray.length; i++) {
    yellowButtonArray[i].onmouseover = function() {
        yellowButtonArray[i].classList.add('hovered');
    }
    
    yellowButtonArray[i].onmouseout = function() {
        yellowButtonArray[i].classList.remove('hovered');
    }
};


// rounds results with long decimals
function numberMaxLength(num) {
    if (num.toString().length > 15) {
        return num.toPrecision(9);
    } else {
        return num;
    }
};


// equation container div for displaying the last result
const eqFirst = document.getElementById('first-no');
const eqOperator = document.getElementById('operator');
const eqSecond = document.getElementById('second-no');
const eqEquals = document.getElementById('equals-symbol');
const eqResult = document.getElementById('result');

// operator button symbol
function operatorButtonWhichToSymbol(operatorTextForm) {
    if (operatorTextForm === 'add') {
        return '+';
    } else if (operatorTextForm === 'subtract') {
        return '-';
    } else if (operatorTextForm === 'multiply') {
        return '×'
    } else if (operatorTextForm === 'divide') {
        return '÷'
    }
};
