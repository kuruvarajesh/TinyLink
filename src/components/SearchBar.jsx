
import { useState } from 'react'

function SearchBar({ onSearch, initialValue = '' }) {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(value.trim())
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search by code or URL..."
          className="search-input"
        />
        <button type="submit" className="btn btn-secondary">Search</button>
        {value && (
          <button type="button" className="btn btn-outline" onClick={handleClear}>Clear</button>
        )}
      </form>
    </div>
  )
}

export default SearchBar