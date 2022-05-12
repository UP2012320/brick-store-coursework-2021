import {useEffect} from 'Scripts/hooks/useEffect';
import {type StateSetter, useState} from 'Scripts/hooks/useState';
import {createKeyedContainer} from 'Scripts/uiUtils';
import commonComponents from 'Styles/commonComponents.module.scss';

export default function useOverlay (key: string, defaultValue = false, additionalToggle?: StateSetter<boolean>, maxWidth?: number): [HTMLDivElement, boolean, StateSetter<boolean>] {
  const [isOpen, setIsOpen] = useState(key, defaultValue);

  const overlayElement = createKeyedContainer('div', key, undefined, commonComponents.overlay);

  if (!isOpen) {
    overlayElement.classList.add(commonComponents.hidden);
  } else if (maxWidth && window.innerWidth > maxWidth) {
    overlayElement.classList.add(commonComponents.hidden);
  }

  useEffect(key, () => {
    const overlay = document.querySelector(`.${commonComponents.overlay}[key="${key}"]`);

    if (overlay) {
      if (isOpen) {
        if (maxWidth && window.innerWidth > maxWidth) {
          return;
        }

        overlay.classList.remove(commonComponents.hidden);
      } else {
        overlay.classList.add(commonComponents.hidden);
      }
    }
  }, [isOpen]);

  const onOverlayClick = () => {
    setIsOpen(false);
    if (additionalToggle) {
      additionalToggle(false);
    }
  };

  useEffect(key, () => {
    const overlay = document.querySelector(`.${commonComponents.overlay}[key="${key}"]`);

    if (overlay) {
      overlay.addEventListener('click', onOverlayClick);

      return () => {
        overlay.removeEventListener('click', onOverlayClick);
      };
    }

    return () => {};
  }, []);

  return [overlayElement, isOpen, setIsOpen];
}
