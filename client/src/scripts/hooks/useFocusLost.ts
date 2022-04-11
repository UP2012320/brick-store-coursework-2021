import {useEffect} from 'Scripts/hooks/useEffect';

export default function useFocusLost (key: string, targetSelector: string, onFocusLost: () => void) {
  const onOutsideClick = (event: MouseEvent) => {
    const dropDownOptionsContainerMouseEvent = document.querySelector(targetSelector);

    if (!dropDownOptionsContainerMouseEvent?.contains(event.target as HTMLElement)) {
      onFocusLost();
    }
  };

  useEffect(key, () => {
    document.body.addEventListener('click', onOutsideClick);
    return () => document.body.removeEventListener('click', onOutsideClick);
  }, []);
}
