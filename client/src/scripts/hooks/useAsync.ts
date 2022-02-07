import {nameof} from 'Scripts/helpers';
import HookCallerStateManager from 'Scripts/hooks/hookCallerStateManager';
import {useEffect} from 'Scripts/hooks/useEffect';
import {registerUseState} from 'Scripts/hooks/useState';

const useState = registerUseState(nameof(useAsync));

const stateManager = new HookCallerStateManager(nameof(useAsync));

export const resetAsyncIndexes = () => {
  stateManager.resetStateIndexes();
};

export default function useAsync<T> (callerName: string, promise: () => Promise<T>, immediate = false): [T | undefined, unknown, boolean] {
  const [result, setResult] = useState<T | undefined>();
  const [error, setError] = useState<unknown>();
  const [finished, setFinished] = useState(false);
  const [callerState, callerStateIndex] = stateManager.useStateManager(promise, {});

  const state = callerState.states[callerStateIndex] as () => Promise<T>;

  useEffect(nameof(useAsync), () => {
    if (immediate) {
      state().then((value) => {
        setResult(value);
        setFinished(true);
      }).catch((error_) => {
        setError(error_);
      });
    }
  }, []);

  return [result, error, finished];
}
