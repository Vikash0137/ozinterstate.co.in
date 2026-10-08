import { useEffect, useState, useRef } from 'react'
import customerService from '../../services/customerService'

const CustomerSelect = ({ onSelect, placeholder = 'Search customers by name, email or phone', initial }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!query) return setResults([])
    setLoading(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        const res = await customerService.searchCustomers(query, 10)
        setResults(res?.data?.customers || res?.data || [])
      } catch (err) {
        console.warn('Customer search failed', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer.current)
  }, [query])

  useEffect(() => {
    if (initial && onSelect) onSelect(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial])

  return (
    <div className="customer-select">
      <input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <div className="customer-select-loading">Searching…</div>}

      {results.length > 0 && (
        <ul className="customer-select-results">
          {results.map((c) => (
            <li key={c._id} onClick={() => onSelect && onSelect(c)}>
              <strong>{c.name}</strong>
              <div className="customer-select-meta">{c.email} · {c.phone}</div>
            </li>
          ))}
        </ul>
      )}

      {!loading && query && results.length === 0 && (
        <div className="customer-select-empty">No customers found.</div>
      )}
    </div>
  )
}

export default CustomerSelect
