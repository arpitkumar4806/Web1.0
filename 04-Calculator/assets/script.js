const display = document.getElementById("result");
let memory = 0;
let mrcPressed = false;

function addToDisplay(input) {
    if ([".", "+", "-", "*", "/"].includes(input)) {
        if (
            [".", "+", "-", "*", "/"].includes(
                display.value.charAt(display.value.length - 1)
            )
        ) {
            display.value = display.value.slice(0, -1) + input;
        } else {
            display.value += input;
        }
    } else {
        display.value += input;
    }
}

function clearDisplay() {
    display.value = "";
}

function deleteFromDisplay() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        let expr = display.value.trim();
        if (!expr) {
            display.value = "";
            return;
        }

        let tokens = expr.match(/(\-?\d+(\.\d+)?|[+\-*/])/g);
        if (!tokens || isNaN(tokens[0])) throw new Error("Invalid expression");

        let result = parseFloat(tokens[0]);
        for (let i = 1; i < tokens.length; i += 2) {
            let op = tokens[i];
            let num = parseFloat(tokens[i + 1]);
            if (isNaN(num)) throw new Error("Invalid expression");

            switch (op) {
                case "+":
                    result += num;
                    break;
                case "-":
                    result -= num;
                    break;
                case "*":
                    result *= num;
                    break;
                case "/":
                    if (num === 0) throw new Error("Division by zero");
                    result /= num;
                    break;
                default:
                    throw new Error("Invalid operator");
            }
        }

        display.value = result.toString();
    } catch (error) {
        display.value = error.message;
    }
}

function memoryAdd() {
    try {
        let value = parseFloat(display.value);
        if (!isNaN(value)) {
            memory += value;
            mrcPressed = false;
        }
    } catch {}
}

function memorySubtract() {
    try {
        let value = parseFloat(display.value);
        if (!isNaN(value)) {
            memory -= value;
            mrcPressed = false;
        }
    } catch {}
}

function memoryRecallClear() {
    if (!mrcPressed) {
        display.value = memory.toString();
        mrcPressed = true;
    } else {
        memory = 0;
        mrcPressed = false;
        display.value = "";
    }
}

document.addEventListener("keydown", function (e) {
    // Prevent typing in input if not focused
    if (document.activeElement !== display) {
        let key = e.key;
        let btn = null;

        // Map keys to button selectors
        if ("0123456789".includes(key)) {
            btn = document.querySelector(`button.number[onclick*="${key}"]`);
        } else if (key === ".") {
            btn = document.querySelector(`button.number[onclick*="('.')"]`);
        } else if (key === "+") {
            btn = document.querySelector(`button.operation[onclick*="'+'"]`);
        } else if (key === "-") {
            btn = document.querySelector(`button.operation[onclick*="'-'"]`);
        } else if (key === "*") {
            btn = document.querySelector(`button.operation[onclick*="'*'"]`);
        } else if (key === "/") {
            btn = document.querySelector(`button.operation[onclick*="'/'"]`);
        } else if (key === "(") {
            btn = document.querySelector(`button.operation[onclick*="'('"]`);
        } else if (key === ")") {
            btn = document.querySelector(`button.operation[onclick*="')'"]`);
        } else if (key === "Enter" || key === "=") {
            btn = document.querySelector(`button.equal`);
        } else if (key === "Backspace") {
            btn = document.querySelector(`button.delete`);
        } else if (key.toLowerCase() === "c") {
            btn = document.querySelector(`button.clear`);
        } else if (key.toLowerCase() === "m") {
            // M+ (Shift+M), M- (Alt+M), MRC (plain M)
            if (e.shiftKey) {
                btn = document.querySelector(
                    `button.memory[onclick^="memoryAdd"]`
                );
            } else if (e.altKey) {
                btn = document.querySelector(
                    `button.memory[onclick^="memorySubtract"]`
                );
            } else {
                btn = document.querySelector(
                    `button.memory[onclick^="memoryRecallClear"]`
                );
            }
        }

        if (btn) {
            btn.classList.add("active");
            btn.click();
            setTimeout(() => btn.classList.remove("active"), 150);
            e.preventDefault();
        }
    }
});
