import {forceReRender} from 'Scripts/uiUtils';
import type {CallerState} from 'Types/types';

const stateStore: Record<string, CallerState> = {};

export const resetStateIndexes = () => {
  for (const callerState of Object.values(stateStore)) {
    callerState.index = 0;
  }
};

export function useState<T = undefined> (callerName: string, initialState?: undefined): [(T | undefined), ((newState: (T | ((previous: T | undefined) => T))) => void)];
export function useState<T> (callerName: string, initialState: T): [(T), ((newState: (T | ((previous: T) => T))) => void)];
export function useState<T> (callerName: string, initialState: T): unknown {
  let callerState = stateStore[callerName];
  let state = initialState;
  let callerStateIndex = 0;

  if (callerState) {
    callerStateIndex = callerState.index++;
    const temporaryState = callerState.states[callerStateIndex] as T | undefined;

    if (temporaryState === undefined) {
      callerState.states[callerStateIndex] = initialState;
    } else if (temporaryState) {
      state = temporaryState;
    }
  } else {
    stateStore[callerName] = {
      index: 0,
      states: {
        0: state,
      },
    };
  }

  const setState = (newState: T | ((previous: T) => T)) => {
    callerState = stateStore[callerName];

    if (newState instanceof Function) {
      callerState.states[callerStateIndex] = newState(state);
    } else {
      callerState.states[callerStateIndex] = newState;
    }

    forceReRender();
  };

  return [state, setState];
}

interface registerUseStateOverloads {
  <T = undefined>(initialState?: undefined): [(T | undefined), ((newState: (T | ((previous: T | undefined) => T))) => void)];
  <T>(initialState: T): [(T), ((newState: (T | ((previous: T) => T))) => void)];
}

export function registerUseState (callerName: string) {
  const overloadedFunction: registerUseStateOverloads = <T> (initialState: T) => useState(callerName, initialState);
  return overloadedFunction;
}
