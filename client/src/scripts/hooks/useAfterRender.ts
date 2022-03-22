import StateManager from 'Scripts/hooks/hookCallerStateManager';

const stateManager = new StateManager();

export function resetUseAfterRenderStateIndexes () {
  stateManager.resetStateIndexes();
}

export function useAfterRender (key: string, callback: () => void) {
  stateManager.useStateManager(key, callback, {});
}

export function fireAfterRenderFunction (key: string) {
  const states = stateManager.stateStore.get(key);

  if (states) {
    for (const afterRenderFunction of states.states as Array<() => void>) {
      afterRenderFunction();
    }
  }
}
