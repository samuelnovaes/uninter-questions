import { useEffect } from 'react';
import { useState } from 'react';

const useSessionStorage = (name, defaultValue) => {
  const [value, setValue] = useState(sessionStorage.getItem(name) || defaultValue);
  useEffect(() => {
    if (value === null) {
      sessionStorage.removeItem(name);
      return;
    }
    sessionStorage.setItem(name, value);
  }, [value]);
  return [value, setValue];
};

export default useSessionStorage;
