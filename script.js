const display = document.getElementById('display');

const state = {
  current: '0',
  previous: null,
  operator: null,
  waitingForNewValue: false,
};

function updateDisplay() {
  display.textContent = state.current;
}

function inputDigit(digit) {
  if (state.waitingForNewValue) {
    state.current = String(digit);
    state.waitingForNewValue = false;
  } else {
    state.current = state.current === '0' ? String(digit) : state.current + digit;
  }

  updateDisplay();
}

function inputDecimal() {
  if (state.waitingForNewValue) {
    state.current = '0.';
    state.waitingForNewValue = false;
    updateDisplay();
    return;
  }

  if (!state.current.includes('.')) {
    state.current += '.';
  }

  updateDisplay();
}

function clearAll() {
  state.current = '0';
  state.previous = null;
  state.operator = null;
  state.waitingForNewValue = false;
  updateDisplay();
}

function deleteLast() {
  if (state.waitingForNewValue) {
    return;
  }

  if (state.current.length > 1) {
    state.current = state.current.slice(0, -1);
  } else {
    state.current = '0';
  }

  updateDisplay();
}

function performCalculation(firstValue, secondValue, operator) {
  switch (operator) {
    case '+':
      return firstValue + secondValue;
    case '-':
      return firstValue - secondValue;
    case '*':
      return firstValue * secondValue;
    case '/':
      if (secondValue === 0) {
        return 'Error';
      }
      return firstValue / secondValue;
    default:
      return secondValue;
  }
}

function handleOperator(nextOperator) {
  const inputValue = Number.parseFloat(state.current);

  if (state.previous === null) {
    state.previous = inputValue;
  } else if (state.operator) {
    const result = performCalculation(state.previous, inputValue, state.operator);
    state.current = String(result);
    state.previous = result;
  }

  state.operator = nextOperator;
  state.waitingForNewValue = true;
  updateDisplay();
}

function handleEquals() {
  if (!state.operator || state.previous === null) {
    return;
  }

  const inputValue = Number.parseFloat(state.current);
  const result = performCalculation(state.previous, inputValue, state.operator);

  state.current = String(result);
  state.previous = null;
  state.operator = null;
  state.waitingForNewValue = true;
  updateDisplay();
}

document.querySelectorAll('.number').forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    if (value === '.') {
      inputDecimal();
    } else {
      inputDigit(value);
    }
  });
});

document.querySelectorAll('.operator').forEach((button) => {
  button.addEventListener('click', () => {
    handleOperator(button.dataset.value);
  });
});

document.querySelector('[data-action="clear"]').addEventListener('click', clearAll);
document.querySelector('[data-action="delete"]').addEventListener('click', deleteLast);
document.querySelector('[data-action="equals"]').addEventListener('click', handleEquals);

updateDisplay();
