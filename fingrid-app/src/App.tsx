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

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const importantFields = ['Kehitysehdotus', 'Nostopäiväys', 'Prioriteetti'];

  return (
    <div className="p-4">
      <div className="w-full flex flex-col items-center gap-3 p-3">
        <img
          className="h-[3rem]"
          src="https://upload.wikimedia.org/wikipedia/fi/c/cb/Fingrid_logo.svg"
        />
        <h1 className="text-2xl font-bold mb-4">
          Development Management System
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {data.map((entry, index) => (
          <div key={index} className="p-4 border rounded shadow">
            <button
              className="text-blue-500 underline m-3 float-right"
              onClick={() => toggleExpand(index)}
            >
              {expandedIndex === index ? 'Show Less' : 'Show More'}
            </button>
            {Object.entries(entry).map(([key, value]) => {
              if (
                expandedIndex !== index &&
                !importantFields.some((field) => key.includes(field))
              ) {
                return null;
              }
              return (
                <div key={key} className="mb-2">
                  <span className="font-semibold">{key}: </span>
                  <span>{value}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
