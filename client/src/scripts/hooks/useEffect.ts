import StateManager from 'Scripts/hooks/hookCallerStateManager';
import type {UseEffectCallerState} from 'Types/types';
import deepEqual from 'deep-equal';

const stateManager = new StateManager<unknown[] | undefined, UseEffectCallerState<unknown[] | undefined>>();

const useEffectQueue: Array<() => (() => void) | void> = [];

export function fireUseEffectQueue () {
  let callback;

  while ((callback = useEffectQueue.shift())) {
    callback();
  }
}

export function resetUseEffectStateIndexes () {
  stateManager.resetStateIndexes();
}

export function useEffect (callerName: string, callback: () => (() => void) | void, dependencies?: unknown[]) {
  const [callerState, callerStateIndex] = stateManager.useStateManager(callerName, dependencies, {isFirstRender: true});

  const state = callerState.states[callerStateIndex];

  if (state === undefined || state === null) {
    useEffectQueue.push(callback);
  } else if (state.length === 0 && callerState.isFirstRender) {
    useEffectQueue.push(callback);
  } else if (state.length > 0 && !deepEqual(state, dependencies)) {
    callerState.states[callerStateIndex] = dependencies;
    useEffectQueue.push(callback);
  } else if (state.length !== 0) {
    callerState.states[callerStateIndex] = dependencies;
  }

  if (callerState.isFirstRender && callerStateIndex === 0) {
    callerState.isFirstRender = false;
  }
}

export function registerUseEffect (callerName: string) {
  return (callback: () => (() => void) | void, dependencies?: unknown[]) => useEffect(callerName,
    callback,
    dependencies);
}
