import type {CallerState} from 'Types/types';

export default class StateManager<T, S extends CallerState<T>> {
  public stateStore: Record<string, S>;

  private readonly callerName: string;

  public constructor (callerName: string) {
    this.stateStore = {};
    this.callerName = callerName;
  }

  public useStateManager (initialState: T, callerStateArgs: Partial<S>): [S, number] {
    let callerState = this.stateStore[this.callerName];
    let callerStateIndex = 0;

    if (callerState) {
      callerStateIndex = callerState.index++;
      const temporaryState = callerState.states[callerStateIndex];

      if (temporaryState === undefined) {
        callerState.states[callerStateIndex] = initialState;
      }
    } else {
      this.stateStore[this.callerName] = {
        ...callerStateArgs as S,
        index: 1,
        states: {
          '0': initialState,
        },
      };
      callerState = this.stateStore[this.callerName];
    }

    return [callerState, callerStateIndex];
  }

  public resetStateIndexes () {
    for (const callerState of Object.values(this.stateStore)) {
      callerState.index = 0;
    }
  }
}
