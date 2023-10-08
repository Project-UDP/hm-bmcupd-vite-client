import { useState } from 'react'
import { useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { api } from '../../../api/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'График регистрации пациентов'
    }
  }
}

const labels = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
]

export const RegistrationLine = () => {
  const [lineData, setData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

  const [year, setYear] = useState(new Date().getFullYear())

  const handleInput = (event: any) => {
    console.log(year)
    setYear(event.target.value)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const response = await api.statistics.getRegistrationRatesByYear(year)
        const data = response.data
        const newLineData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < data.length; i++) {
          const element = data[i]
          newLineData[element.month - 1] = element.count
        }
        setData(newLineData)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [year])

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'График',
        data: lineData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }

  return (
    <div>
      <select value={year} onChange={handleInput}>
        {years.map((year) => (
          <option value={year}>{year}</option>
        ))}
      </select>
      <Line options={options} data={data} />
    </div>
  )
}

const years: Array<number> = []

for (let i = 2022; i < 2122; i++) {
  years.push(i)
}
