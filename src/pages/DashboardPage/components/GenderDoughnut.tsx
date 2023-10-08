import { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { api } from '../../../api/api'

ChartJS.register(ArcElement, Tooltip, Legend)

export const GenderDoughnut = () => {
  const [maleCount, setMaleCount] = useState(0)
  const [femaleCount, setFemaleCount] = useState(0)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await api.statistics.getGenderCounts()
        const data = response.data
        setMaleCount(data.maleCount)
        setFemaleCount(data.femaleCount)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  const data = {
    labels: ['Мужчина', 'Женщина'],
    datasets: [
      {
        label: 'Количество',
        data: [maleCount, femaleCount],
        backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1
      }
    ]
  }

  return <Doughnut data={data} />
}
