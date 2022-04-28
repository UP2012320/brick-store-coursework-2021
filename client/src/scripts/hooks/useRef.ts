import StateManager from 'Scripts/hooks/hookCallerStateManager';
import {type Ref} from 'Types/types';

const stateManager = new StateManager();

export const resetRefIndexes = () => {
  stateManager.resetStateIndexes();
};

export function clearRef (key: string) {
  stateManager.stateStore.delete(key);
}

export function useRef<T = undefined> (key: string, initialValue?: undefined): Ref<T | undefined>;
export function useRef<T> (key: string, initialValue: T): Ref<T>;
export function useRef<T> (key: string, initialValue: T): unknown {
  const [callerState, callerStateIndex] = stateManager.useStateManager(key, {current: initialValue}, {});

  return callerState.states[callerStateIndex] as Ref<T>;
}

interface registerUseRefOverloads {
  <T = undefined>(initialValue?: undefined): Ref<T | undefined>;
  <T>(initialValue: T): Ref<T>;
}

export function registerUseRef (key: string) {
  const overloadedFunction: registerUseRefOverloads = <T> (initialValue: T) => useRef(key, initialValue);
  return overloadedFunction;
}
