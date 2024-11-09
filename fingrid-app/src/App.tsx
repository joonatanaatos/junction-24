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
    setTimeout(() => {
      alert('There have been changes to your issue!');
    }, 3000);
  };

  return [value, setStoredValue] as const;
};

function App() {
  const [data, setData] = useLocalStorage<FingridData[]>(
    'fingridData',
    defaultData as unknown as FingridData[],
  );

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [filters, setFilters] = useState<{ field: string; value: string }[]>(
    [],
  );

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const [sortedby, setSortedby] = useState("");

  const handleSortChange = (field: string) => {
    setSortedby(field);
  };

  const handleFilterChange = (index: number, field: string, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = { field, value };
    setFilters(newFilters);
  };

  const addFilter = () => {
    setFilters([...filters, { field: '', value: '' }]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const filteredData = data.filter((entry) =>
    filters.every(
      (filter) =>
        !filter.field ||
        (entry[filter.field] &&
          entry[filter.field]
            .toString()
            .toLowerCase()
            .includes(filter.value.toLowerCase())),
    ),
  );

  const allFields = [
    'ID',
    'Suunniteltu toteutus-versio\nPlanned release version',
    'Tila\nState',
    'Kehitysehdotus (alkuper\u00e4inen)\nDevelopment proposal (original)\n',
    'Kehitysehdotuksen tarkennus (alkuper\u00e4inen)',
    'Development proposal and clarification (original)',
    'Kehitysehdotuksen ratkaisukuvaus',
    'Development proposal resolution description',
    'Nosto-p\u00e4iv\u00e4ys\nRaised date',
    'Toiminnallinen alue',
    'Ehdotuksen viittaus (tiketti) numero\nReference (ticket) number for proposal',
    'Kokoluokka-arvio DH (1-3/4)\nBall park estimate for DH',
    'Toimialavaikutus (0-3)\nImpact on market',
    'Potentiaalinen tuotteen parannus\nProduct improvement',
    'Prioriteetti (1-3)\nPriority',
    'Perustelut ehdotukselle\nArguments for proposal',
    'Kommentti\nComment',
    'Ehdotuksen vaikutukset\nImpact of proposal',
    'Toteutuksen arvioitu laajuus',
    'Vaatiiko toimenpiteit\u00e4 k\u00e4ytt\u00f6\u00f6noton yhteydess\u00e4\n(Kyll\u00e4/Ei)\nRequires actions in commissioning (Y/N)',
    'K\u00e4sitelty kehitysty\u00f6ryhm\u00e4ss\u00e4\npvm\nPresented in the development WG',
    'Asiakastoimikunnan/Kehitysty\u00f6ryhm\u00e4n etenemissuositus\nRecommendation from CC/DWG',
    'K\u00e4sittelyn etenemissuunnitelma\nNext steps',
  ];
  const importantFields = ['Kehitysehdotus', 'Tila', 'Prioriteetti'];

  const handleFieldBlur = (
    entryIndex: number,
    field: string,
    value: string,
  ) => {
    const newData = [...data];
    newData[entryIndex][field] = value;
    setData(newData);
  };

  const createNewItem = () => {
    const newItem: FingridData = allFields.reduce((acc, field) => {
      acc[field] = '';
      return acc;
    }, {} as FingridData);
    setData([newItem, ...data]);
  };

  const deleteItem = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

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
      <div className="mb-4">
        <select
          value={sortedby}
          onChange={(e) =>
            handleSortChange(e.target.value)
          }
          className="p-2 border rounded"
        >
          <option value="">Sort by</option>
          {allFields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <button
          onClick={createNewItem}
          className="p-2 border rounded bg-green-500 text-white mb-4"
        >
          Create New Item
        </button>
        {filters.map((filter, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select
              value={filter.field}
              onChange={(e) =>
                handleFilterChange(index, e.target.value, filter.value)
              }
              className="p-2 border rounded"
            >
              <option value="">Select field</option>
              {allFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={filter.value}
              onChange={(e) =>
                handleFilterChange(index, filter.field, e.target.value)
              }
              placeholder="Search..."
              className="p-2 border rounded"
            />
            <button
              onClick={() => removeFilter(index)}
              className="p-2 border rounded bg-red-500 text-white"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addFilter}
          className="p-2 border rounded bg-blue-500 text-white"
        >
          Add Filter
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {filteredData.sort((a, b) => a[sortedby] > b[sortedby] ? 1 : -1).map((entry, index) => (
          <div key={index} className="p-4 border rounded shadow">
            <button
              className="text-blue-500 underline m-3 float-right"
              onClick={() => toggleExpand(index)}
            >
              {expandedIndex === index ? 'Show Less' : 'Show More'}
            </button>
            <button
              onClick={() => deleteItem(index)}
              className="text-red-500 underline m-3 float-right"
            >
              Delete
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
                  {expandedIndex === index ? (
                    <textarea
                      defaultValue={value}
                      onBlur={(e) =>
                        handleFieldBlur(index, key, e.target.value)
                      }
                      className="p-1 border rounded w-full"
                    />
                  ) : (
                    <span>{value}</span>
                  )}
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
