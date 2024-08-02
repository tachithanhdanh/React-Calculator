import { ACTIONS } from './App';

export function DigitButton({ digit, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
    >
      {digit}
    </button>
  )
}

export function OperationButton({ operation, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation }})}
    >
      {operation}
    </button>
  )
}

