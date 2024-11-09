import './App.css';
import defaultData from './default-data.json';
import { useState } from 'react';

type FingridData = Record<string, string>;

const useLocalStorage = <T,>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  });

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue] as const;
};

function App() {
  const [data, setData] = useLocalStorage<FingridData[]>(
    'fingridData',
    defaultData as unknown as FingridData[],
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fingrid Data</h1>
      <div className="grid grid-cols-1 gap-4">
        {data.map((entry, index) => (
          <div key={index} className="p-4 border rounded shadow">
            {Object.entries(entry).map(([key, value]) => (
              <div key={key} className="mb-2">
                <span className="font-semibold">{key}: </span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
