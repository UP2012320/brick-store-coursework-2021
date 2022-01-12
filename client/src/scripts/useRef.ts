import type {CallerState, Ref} from 'Types/types';

const stateStore: Record<string, CallerState> = {};

export const resetRefIndexes = () => {
  for (const callerState of Object.values(stateStore)) {
    callerState.index = 0;
  }
};

export function useRef<T = undefined> (callerName: string, initialValue?: undefined): Ref<T | undefined>;
export function useRef<T> (callerName: string, initialValue: T): Ref<T>;
export function useRef<T> (callerName: string, initialValue: T): unknown {
  const callerState = stateStore[callerName];
  let ref = {current: initialValue} as Ref<T>;
  let callerStateIndex = 0;

  if (callerState) {
    callerStateIndex = callerState.index++;
    const temporaryState = callerState.states[callerStateIndex] as Ref<T> | undefined;

    if (temporaryState === undefined) {
      callerState.states[callerStateIndex] = ref;
    } else if (temporaryState) {
      ref = temporaryState;
    }
  } else {
    stateStore[callerName] = {
      index: 0,
      states: {
        '0': ref,
      },
    };
  }

  return ref;
}

interface registerUseRefOverloads {
  <T = undefined>(initialValue?: undefined): Ref<T | undefined>;
  <T>(initialValue: T): Ref<T>;
}

export function registerUseRef (callerName: string) {
  const overloadedFunction: registerUseRefOverloads = <T> (initialValue: T) => useRef(callerName, initialValue);
  return overloadedFunction;
}
