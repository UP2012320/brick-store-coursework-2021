import StateManager from 'Scripts/hooks/hookCallerStateManager';
import type {UseEffectCallerState} from 'Types/types';
import deepEqual from 'deep-equal';

const stateManager = new StateManager<unknown[] | undefined, UseEffectCallerState<unknown[] | undefined>>();

const useEffectOnDiscardCallbacks: Record<string, () => void> = {};
const useEffectQueue: Array<{callback: () => (() => void) | void, key: string, }> = [];

export function fireUseEffectQueue () {
  let queueItem;

  while ((queueItem = useEffectQueue.shift())) {
    const result = queueItem.callback();

    if (typeof result === 'function') {
      useEffectOnDiscardCallbacks[queueItem.key] = result;
    }
  }
}

export function fireUseEffectDiscardQueue (key: string) {
  const queueItem = useEffectOnDiscardCallbacks[key];

  if (queueItem) {
    queueItem();
  }
}

export function resetUseEffectStateIndexes () {
  stateManager.resetStateIndexes();
}

export function clearUseEffect (key: string) {
  stateManager.stateStore.delete(key);
}

export function useEffect (key: string, callback: () => (() => void) | void, dependencies?: unknown[]) {
  const [callerState, callerStateIndex] = stateManager.useStateManager(key, dependencies, {isFirstRender: true});

  const state = callerState.states[callerStateIndex];

  if (state === undefined || state === null) {
    useEffectQueue.push({callback, key});
  } else if (state.length === 0 && callerState.isFirstRender) {
    useEffectQueue.push({callback, key});
  } else if (state.length > 0 && !deepEqual(state, dependencies)) {
    callerState.states[callerStateIndex] = dependencies;
    useEffectQueue.push({callback, key});
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
