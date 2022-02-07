import {nameof} from 'Scripts/helpers';
import StateManager from 'Scripts/hooks/hookCallerStateManager';
import type {UseEffectCallerState} from 'Types/types';
import deepEqual from 'deep-equal';

const stateManager = new StateManager<unknown[] | undefined, UseEffectCallerState<unknown[] | undefined>>(nameof(useEffect));

export function resetUseEffectStateIndexes () {
  stateManager.resetStateIndexes();
}

export function useEffect (callerName: string, callback: () => (() => void) | void, dependencies?: unknown[]) {
  const [callerState, callerStateIndex] = stateManager.useStateManager(dependencies, {isFirstRender: true});

  const state = callerState.states[callerStateIndex];

  if (!state) {
    callback();
  } else if (state.length === 0 && callerState.isFirstRender) {
    callback();
  } else if (state.length > 0 && !deepEqual(state, dependencies)) {
    callback();
  } else {
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
