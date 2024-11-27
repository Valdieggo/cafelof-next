export default function SortOptions({ options, selectedOption, onSortChange }) {
  return (
    <div className="flex-1 min-w-[100px] max-w-[200px]">
      <select
        value={selectedOption}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm text-sm"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
