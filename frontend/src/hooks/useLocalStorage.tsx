import React from "react";

export function useLocalStorage<Type>(
  keyName: string,
  defaultValue: Type
) {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);

      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        if(keyName === "filter"){
          window.dispatchEvent(new Event("filter"));
        }
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue: Type) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
      if(keyName === "filter"){
        window.dispatchEvent(new Event("filter"));
      }
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
}
