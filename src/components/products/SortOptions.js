export default function SortOptions({ options, selectedOption, onSortChange }) {
    return (
      <div>
        <select
          value={selectedOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-white border border-gray-300 rounded py-2 px-4">
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }
  