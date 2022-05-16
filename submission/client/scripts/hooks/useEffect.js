import StateManager from 'Scripts/hooks/hookCallerStateManager';
import deepEqual from 'deep-equal';

const stateManager = new StateManager();
const useEffectOnDiscardCallbacks = {};
const useEffectQueue = [];

export function fireUseEffectQueue() {
  let queueItem;
  while ((queueItem = useEffectQueue.shift())) {
    const result = queueItem.callback();
    if (typeof result === 'function') {
      useEffectOnDiscardCallbacks[queueItem.key] = result;
    }
  }
}

export function fireUseEffectDiscardQueue(key) {
  const queueItem = useEffectOnDiscardCallbacks[key];
  if (queueItem) {
    queueItem();
  }
}

export function resetUseEffectStateIndexes() {
  // If the indexes are being reset, then the first render is finished
  // Any subsequent calls from within useEffect hooks that may trigger a re-render need to know
  for (const state of stateManager.stateStore.values()) {
    if (state.isFirstRender) {
      state.isFirstRender = false;
    }
  }
  stateManager.resetStateIndexes();
}

export function clearUseEffect(key) {
  stateManager.stateStore.delete(key);
}

export function useEffect(key, callback, dependencies) {
  const [callerState, callerStateIndex] = stateManager.useStateManager(key, dependencies, {isFirstRender: true});
  // The state is the dependencies array passed
  const state = callerState.states[callerStateIndex];
  if (state === undefined || state === null) {
    // If the state is undefined or null, then the callback is always called
    useEffectQueue.push({callback, key});
  } else if (state.length === 0 && callerState.isFirstRender) {
    // If the state is empty, and it's the first render, then the callback can be called
    useEffectQueue.push({callback, key});
  } else if (state.length > 0 && !deepEqual(state, dependencies)) {
    // If the dependencies have changed, then the callback needs to be re-queued
    callerState.states[callerStateIndex] = dependencies;
    useEffectQueue.push({callback, key});
  } else if (state.length !== 0) {
    // Dependencies have not changed, so do not call the callback, but update the dependency state
    callerState.states[callerStateIndex] = dependencies;
  }
}

export function registerUseEffect(callerName) {
  return (callback, dependencies) => useEffect(callerName, callback, dependencies);
}
