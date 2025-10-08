import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
}

const SearchBar = ({ value, onChange, onClear, placeholder }: SearchBarProps) => {
  return (
    <div className="search-bar">
      <Search size={20} className="search-icon" />
      <input
        type="text"
        placeholder={placeholder || 'Buscar por local...'}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="search-input"
      />
      {value && (
        <button onClick={onClear} className="clear-button">
          <X size={20} />
        </button>
      )}
    </div>
  )
}

export default SearchBar
