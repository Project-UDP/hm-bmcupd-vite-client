import { useEffect, useState } from 'react'
import { api } from '../../../api/api'

export const PatinetCount = (): JSX.Element => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await api.statistics.getPatientCount()
        const data = response.data
        setCount(data.count)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return <h1>Кол-во пациентов: {count}</h1>
}
