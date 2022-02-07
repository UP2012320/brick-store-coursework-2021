import {nameof} from 'Scripts/helpers';
import StateManager from 'Scripts/hooks/hookCallerStateManager';
import {forceReRender} from 'Scripts/uiUtils';

const stateManager = new StateManager(nameof(useState));

export const resetStateIndexes = () => {
  stateManager.resetStateIndexes();
};

export function useState<T = undefined> (callerName: string, initialState?: undefined): [(T | undefined), ((newState: (T | ((previous: T | undefined) => T))) => void)];
export function useState<T> (callerName: string, initialState: T): [(T), ((newState: (T | ((previous: T) => T))) => void)];
export function useState<T> (callerName: string, initialState: T): unknown {
  const [callerState, callerStateIndex] = stateManager.useStateManager(initialState, {});

  const setState = (newState: T | ((previous: T) => T)) => {
    if (newState instanceof Function) {
      callerState.states[callerStateIndex] = newState(callerState.states[callerStateIndex] as T);
    } else {
      callerState.states[callerStateIndex] = newState;
    }

    forceReRender();
  };

  return [callerState.states[callerStateIndex] as T, setState];
}

interface registerUseStateOverloads {
  <T = undefined>(initialState?: undefined): [(T | undefined), ((newState: (T | ((previous: T | undefined) => T))) => void)];
  <T>(initialState: T): [(T), ((newState: (T | ((previous: T) => T))) => void)];
}

export function registerUseState (callerName: string) {
  const overloadedFunction: registerUseStateOverloads = <T> (initialState: T) => useState(callerName, initialState);
  return overloadedFunction;
}
