import { useCallback, useEffect, useState } from 'react'
import { apiGet } from '../api/api'

export function useIssues() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await apiGet('/issues')

      setIssues(data)
    } catch (err) {
      setError(err.message || 'Failed to load issues')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIssues()
  }, [fetchIssues])

  return {
    issues,
    loading,
    error,
    refreshIssues: fetchIssues
  }
}