import { useState, useCallback } from 'react';
import { getItem, setItem } from '../utils/storage';

export function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => getItem(key, defaultValue));

  const setValue = useCallback(
    (value) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      setItem(key, valueToStore);
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
