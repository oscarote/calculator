// Math functions
function add(a, b) {
    return roundDecimals(parseFloat(b) + parseFloat(a));
};

function subtract(a, b) {
    return roundDecimals(parseFloat(b) - parseFloat(a));
};

function multiply(a, b) {
    return roundDecimals(parseFloat(b) * parseFloat(a));
};

function divide(a, b) {
    return roundDecimals(parseFloat(b) / parseFloat(a));
};

function operate(operator, a, b) {
    if (a === "0" && operator === "÷") {
        errorCalc();
        return;
    }
    operation += " " + numberOne + " =";
    switch (operator) {
        case "+":
            numberOne = add(a, b);
            break;
        case "-":
            numberOne = subtract(a, b);
            break;
        case "×":
            numberOne = multiply(a, b);
            break;
        case "÷":
            numberOne = divide(a, b);
            break;
    }
    refreshScreen();
    lastResult = numberOne;
}

// Screen variables
const upperLine = document.querySelector(".line1");
const bottomLine = document.querySelector(".line2");
let numberOne = "";
let numberTwo = "";
let operator = "";
let operation = "";
let operationFinished = "yes";
let lastResult = "";

// Event listeners
const btnClick = document.querySelectorAll("[data-number]");
btnClick.forEach(btn => btn.addEventListener("click", e => handleNumber(e.target.textContent)));

const equalBtn = document.getElementById("equal");
equalBtn.addEventListener("click", finishOperation);

const decimalBtn = document.getElementById("decimal");
decimalBtn.addEventListener("click", () => {
    if (numberOne.includes(".")) return;
    numberOne += ".";
    refreshScreen();
});

const signChange = document.getElementById("sign");
signChange.addEventListener("click", () => {
    numberOne *= -1;
    refreshScreen();
});

const operatorBtn = document.querySelectorAll("[data-operator]");
operatorBtn.forEach(btn => btn.addEventListener("click", e => handleOperator(e.target.textContent)));

// Reset buttons

const resetBtn = document.getElementById("reset");
resetBtn.addEventListener("click", resetScreen);

const deleteBtn = document.getElementById("delete");
deleteBtn.addEventListener("click", () => {
    numberOne = "";
    refreshScreen();
});

const backspaceBtn = document.getElementById("backspace");
backspaceBtn.addEventListener("click", deleteLast);

// Event listener for keyboard
window.addEventListener('keydown', handleKey);

function handleKey(e) {
    if (isFinite(e.key)) {
        handleNumber(e.key);
    } else if (e.key === "/") {
        handleOperator("÷");
    } else if (e.key === "*") {
        handleOperator("×");
    } else if (e.key === "+" || e.key === "-") {
        handleOperator(e.key);
    } else if (e.key === "=" || e.key === "Enter") {
        finishOperation();
    } else if (e.key === "Backspace") {
        deleteLast();
    } else if (e.key === "," || e.key === ".") {
        if (numberOne.includes(".")) return;
        numberOne += ".";
        refreshScreen();
    }
}
// Functions for event listeners
function deleteLast() {
    let temp = numberOne.toString().slice(0,-1);
    numberOne = temp;
    refreshScreen();
};

function handleNumber(num) {
    if (operationFinished === "yes") {
        resetScreen();
        operationFinished = "no";    
        numberOne += num;
        refreshScreen();
    } else if (operationFinished === "no" && operation.charAt(operation.length - 1) === "=") {
        numberTwo = lastResult;
        numberOne += num;
        operation = numberTwo + " " + operator;
        refreshScreen();
    } else {
        numberOne += num;
        refreshScreen();
    }
};

function handleOperator(ope) {
    if (!numberTwo && ope === "-") {
        numberOne = "-";
        refreshScreen();
    } else if (operationFinished === "no" && operation.charAt(operation.length - 1) !== "=" && operator !== "") {
        operate(operator, numberOne, numberTwo);
        refreshScreen();
        operator = ope;
        numberOne = "";
    }else if (operationFinished === "no" && operation.charAt(operation.length - 1) === "=") {
        numberTwo = numberOne;
        operate(operator, numberOne, numberTwo);
        numberTwo = numberOne;
        numberOne = "";
        operator = ope;
        operation = numberTwo + " " + operator;
        refreshScreen();
    } else {
        numberTwo = numberOne;
        numberOne = "";
        operator = ope;
        operation = numberTwo + " " + operator;
        refreshScreen();
    }
};

function refreshScreen() {
    bottomLine.textContent = numberOne;
    upperLine.textContent = operation;
};

function resetScreen() {
    numberOne = "";
    numberTwo = "";
    operator = "";
    operation = "";
    operationFinished = "yes";
    lastResult = "";
    refreshScreen();
};

function finishOperation() {
    if (numberTwo === "") return;
    operate(operator, numberOne, numberTwo);
    operationFinished = "yes";
};

// Round to 3 decimals function
function roundDecimals(number) {
    return Math.round((number + Number.EPSILON) * 1000) / 1000;
};

// Alert if 
function errorCalc() {
    alert("It is not possible to divide by 0");
    resetScreen();
    bottomLine.textContent = "ERROR";
}