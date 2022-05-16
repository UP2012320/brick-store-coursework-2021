import StateManager from 'Scripts/hooks/hookCallerStateManager';
import {forceReRender} from 'Scripts/uiUtils';
import deepEqual from 'deep-equal';

const stateManager = new StateManager();
export const resetStateIndexes = () => {
  stateManager.resetStateIndexes();
};

export function clearState(key) {
  stateManager.clearState(key);
}

export function useState(key, initialState) {
  const [callerState, callerStateIndex] = stateManager.useStateManager(key, initialState, {});
  const setState = (newState) => {
    let newStateValue;
    if (newState instanceof Function) {
      newStateValue = newState(callerState.states[callerStateIndex]);
    } else {
      newStateValue = newState;
    }
    if (deepEqual(newStateValue, callerState.states[callerStateIndex])) {
      return false;
    }
    callerState.states[callerStateIndex] = newStateValue;
    forceReRender();
    return true;
  };
  return [callerState.states[callerStateIndex], setState];
}

export function registerUseState(key) {
  const overloadedFunction = (initialState) => useState(key, initialState);
  return overloadedFunction;
}
