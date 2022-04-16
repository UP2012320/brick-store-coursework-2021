import StateManager from 'Scripts/hooks/hookCallerStateManager';
import {forceReRender} from 'Scripts/uiUtils';
import deepEqual from 'deep-equal';

const stateManager = new StateManager();

export const resetStateIndexes = () => {
  stateManager.resetStateIndexes();
};

export function clearState (key: string) {
  stateManager.clearState(key);
}

export type StateSetter<T> = (newState: (T | ((previous: T) => T))) => boolean;

export function useState<T = undefined> (key: string, initialState?: undefined): [(T | undefined), (StateSetter<T>)];
export function useState<T> (key: string, initialState: T): [(T), (StateSetter<T>)];
export function useState<T> (key: string, initialState: T): unknown {
  const [callerState, callerStateIndex] = stateManager.useStateManager(key, initialState, {});

  const setState = (newState: T | ((previous: T) => T)) => {
    let newStateValue;

    if (newState instanceof Function) {
      newStateValue = newState(callerState.states[callerStateIndex] as T);
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

  return [callerState.states[callerStateIndex] as T, setState];
}

interface registerUseStateOverloads {
  <T = undefined>(initialState?: undefined): [(T | undefined), (StateSetter<T>)];
  <T>(initialState: T): [(T), (StateSetter<T>)];
}

export function registerUseState (key: string) {
  const overloadedFunction: registerUseStateOverloads = <T> (initialState: T) => useState(key, initialState);
  return overloadedFunction;
}
