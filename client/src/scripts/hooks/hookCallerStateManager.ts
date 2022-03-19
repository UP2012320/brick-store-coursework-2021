import type {CallerState} from 'Types/types';

export default class StateManager<T, S extends CallerState<T>> {
  public stateStore: Map<string, S>;

  public constructor () {
    this.stateStore = new Map<string, S>();
  }

  public useStateManager (key: string, initialState: T, callerStateArgs: Partial<S>): [S, number] {
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
        ...callerStateArgs as S,
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

  public resetStateIndexes () {
    for (const callerState of this.stateStore.values()) {
      callerState.index = 0;
    }
  }

  public clearState (key: string) {
    this.stateStore.delete(key);
  }
}
