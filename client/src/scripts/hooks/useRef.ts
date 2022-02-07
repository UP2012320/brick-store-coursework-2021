import {nameof} from 'Scripts/helpers';
import StateManager from 'Scripts/hooks/hookCallerStateManager';
import type {Ref} from 'Types/types';

const stateManager = new StateManager(nameof(useRef));

export const resetRefIndexes = () => {
  stateManager.resetStateIndexes();
};

export function useRef<T = undefined> (callerName: string, initialValue?: undefined): Ref<T | undefined>;
export function useRef<T> (callerName: string, initialValue: T): Ref<T>;
export function useRef<T> (callerName: string, initialValue: T): unknown {
  const [callerState, callerStateIndex] = stateManager.useStateManager({current: initialValue}, {});

  return callerState.states[callerStateIndex] as Ref<T>;
}

interface registerUseRefOverloads {
  <T = undefined>(initialValue?: undefined): Ref<T | undefined>;
  <T>(initialValue: T): Ref<T>;
}

export function registerUseRef (callerName: string) {
  const overloadedFunction: registerUseRefOverloads = <T> (initialValue: T) => useRef(callerName, initialValue);
  return overloadedFunction;
}
