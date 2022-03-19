import StateManager from 'Scripts/hooks/hookCallerStateManager';

const stateManager = new StateManager();

export function resetUseAfterRenderStateIndexes () {
  stateManager.resetStateIndexes();
}

export function useAfterRender (key: string, callback: () => void) {
  stateManager.useStateManager(key, callback, {});
}

export function fireAfterRenderFunctions () {
  const stateStore = stateManager.stateStore;

  for (const state of Object.values(stateStore)) {
    for (const afterRenderFunction of Object.values(state.states) as Array<() => void>) {
      afterRenderFunction();
    }
  }
}
