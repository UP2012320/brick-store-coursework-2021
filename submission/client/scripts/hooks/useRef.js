import StateManager from 'Scripts/hooks/hookCallerStateManager';

const stateManager = new StateManager();
export const resetRefIndexes = () => {
  stateManager.resetStateIndexes();
};

export function clearRef(key) {
  stateManager.stateStore.delete(key);
}

export function useRef(key, initialValue) {
  // Wrap the initial value in an object so that any type including primitives will be passed around as a reference
  const [callerState, callerStateIndex] = stateManager.useStateManager(key, {current: initialValue}, {});
  return callerState.states[callerStateIndex];
}

export function registerUseRef(key) {
  const overloadedFunction = (initialValue) => useRef(key, initialValue);
  return overloadedFunction;
}
