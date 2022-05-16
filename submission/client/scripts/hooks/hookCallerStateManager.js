export default class StateManager {
  stateStore;

  constructor() {
    this.stateStore = new Map();
  }

  useStateManager(key, initialState, callerStateArgs) {
    let callerState = this.stateStore.get(key);
    let callerStateIndex = 0;
    if (callerState) {
      callerStateIndex = callerState.index++;
      const temporaryState = callerState.states[callerStateIndex];
      if (temporaryState === undefined) {
        callerState.states[callerStateIndex] = initialState;
      }
    } else {
      const state = {
        ...callerStateArgs,
        index: 1,
        states: {
          '0': initialState,
        },
      };
      this.stateStore.set(key, state);
      callerState = state;
    }
    return [callerState, callerStateIndex];
  }

  resetStateIndexes() {
    for (const callerState of this.stateStore.values()) {
      callerState.index = 0;
    }
  }

  clearState(key) {
    this.stateStore.delete(key);
  }
}
