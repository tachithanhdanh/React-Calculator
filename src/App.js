import { useReducer } from 'react';
import './App.css';
import { DigitButton, OperationButton } from './Buttons';

const buttons = ['AC', 'DEL', '/', '1', '2', '3', '*', '4', '5', '6', '+', '7', '8', '9', '-', '.', '0', '='];
const operations = ['+', '-', '*', '/'];

export const ACTIONS = {
  ADD_DIGIT: 'ADD_DIGIT',
  CHOOSE_OPERATION: 'CHOOSE_OPERATION',
  CLEAR: 'CLEAR',
  DELETE_DIGIT: 'DELETE_DIGIT',
  EVALUATE: 'EVALUATE',
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.CLEAR:
      return { currentOperand: '0', previousOperand: '', operation: '' };
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return { ...state, currentOperand: `${payload.digit}`, overwrite: false };
      }
      if (state.currentOperand === '0' && payload.digit === '0') {
        return state;
      }
      // if (state.currentOperand === '.' && payload.digit !== '.') {
      //   return state;
      // }
      // if (String(state.currentOperand).includes('.') && state.currentOperand[state.currentOperand.length - 1] === '0' && payload.digit === '0') {
      //   return state;
      // }
      if (Number(state.currentOperand) === 0 && payload.digit !== '.' && !state.currentOperand.includes('.')) {
        return {
          ...state, currentOperand: `${payload.digit}`,
        }
      }
      return {
        ...state, currentOperand: `${state.currentOperand || '0'}${payload.digit}`,
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return { ...state, currentOperand: '0', overwrite: false };
      }
      return {
        ...state, currentOperand: `${state.currentOperand.slice(0, -1) || '0'}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === '0' && state.previousOperand !== '') {
        return { ...state, operation: payload.operation };
      }
      if (!state.previousOperand) {
        return { ...state, operation: payload.operation, previousOperand: state.currentOperand, currentOperand: '0' };
      }
      return { ...state, currentOperand: '0', previousOperand: evaluate(state), operation: payload.operation };
    case ACTIONS.EVALUATE:
      if (!state.previousOperand) {
        return state;
      }
      return { ...state, currentOperand: evaluate(state), previousOperand: '', operation: '', overwrite: true };
    default:
      return state;
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
function formatNumber(number) {
  if (!number || number === '0') {
    return number;
  }
  const [integer, decimal] = number.split('.');
  if (!decimal) {
    return INTEGER_FORMATTER.format(Number(integer));
  }
  return `${INTEGER_FORMATTER.format(Number(integer))}.${decimal}`;
}

function evaluate({currentOperand, previousOperand, operation}) {
  if (!previousOperand) {
    return currentOperand;
  }
  return String(eval(`${previousOperand} ${operation} ${currentOperand}`));
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, { currentOperand: '0' });
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatNumber(previousOperand)} {operation}</div>
        <div className="current-operand">{formatNumber(currentOperand)}</div>
      </div>
      {buttons.map((button) => {
        if (!isNaN(parseInt(button)) || button === '.') {
          return <DigitButton key={button} digit={button} dispatch={dispatch} />;
        }
        if (operations.includes(button)) {
          return <OperationButton key={button} operation={button} dispatch={dispatch} />;
        }
        if (button === 'AC') {
          return <button key={button} className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>{button}</button>;
        }
        if (button === 'DEL') {
          return <button key={button} onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>{button}</button>;
        }
        if (button === '=') {
          return <button key={button} className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>{button}</button>;
        }
        // return <button key={button}>{button}</button>;
      })}
    </div>
  );
}

export default App;
