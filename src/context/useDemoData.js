import { useEffect, useState } from 'react'
import { getData } from '../data/demoStore'

export function useDemoData(type) {
  const [data, setData] = useState(() => getData(type))
  useEffect(() => { const refresh = () => setData(getData(type)); window.addEventListener('changemakers-data-change', refresh); return () => window.removeEventListener('changemakers-data-change', refresh) }, [type])
  return data
}
