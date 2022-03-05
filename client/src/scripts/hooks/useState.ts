import StateManager from 'Scripts/hooks/hookCallerStateManager';
import {forceReRender} from 'Scripts/uiUtils';
import deepEqual from 'deep-equal';

const stateManager = new StateManager();

export const resetStateIndexes = () => {
  stateManager.resetStateIndexes();
};

export type StateSetter<T> = (newState: (T | ((previous: T) => T))) => void;

export function useState<T = undefined> (callerName: string, initialState?: undefined): [(T | undefined), (StateSetter<T>)];
export function useState<T> (callerName: string, initialState: T): [(T), (StateSetter<T>)];
export function useState<T> (callerName: string, initialState: T): unknown {
  const [callerState, callerStateIndex] = stateManager.useStateManager(callerName, initialState, {});

  const setState = (newState: T | ((previous: T) => T)) => {
    let newStateValue;

    if (newState instanceof Function) {
      newStateValue = newState(callerState.states[callerStateIndex] as T);
    } else {
      newStateValue = newState;
    }

    if (deepEqual(newStateValue, callerState.states[callerStateIndex])) {
      return;
    }

    callerState.states[callerStateIndex] = newStateValue;

    forceReRender();
  };

  return [callerState.states[callerStateIndex] as T, setState];
}

interface registerUseStateOverloads {
  <T = undefined>(initialState?: undefined): [(T | undefined), (StateSetter<T>)];
  <T>(initialState: T): [(T), (StateSetter<T>)];
}

export function registerUseState (callerName: string) {
  const overloadedFunction: registerUseStateOverloads = <T> (initialState: T) => useState(callerName, initialState);
  return overloadedFunction;
}
