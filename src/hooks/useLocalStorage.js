import { useState, useCallback } from 'react';
import { getItem, setItem } from '../utils/storage';

export function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => getItem(key, defaultValue));

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        setItem(key, valueToStore);
        return valueToStore;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
