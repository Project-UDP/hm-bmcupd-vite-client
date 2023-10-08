import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { api } from "../../../api/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const,
    }
  },
};

export const IcdCounts = (): JSX.Element => {
  const [data, setData] = useState<Array<any>>([])
  const [labels, setLabels] = useState<Array<string>>([])

    useEffect(() => {
        (async () => {
          try {
            const response = await api.statistics.getIcdCounts();
            const data = response.data
            //setData(data)
            const newLabels: Array<string> = []
            const newData: Array<number> = []
            data.forEach((item) => {
              if (item.icd) {
                newLabels.push(item.icd)
                newData.push(item.count)
              }
            })
            setLabels(newLabels)
            setData(newData)
          } catch (error) {
            console.error(error);
          }
        })();
      }, []);

      const sdata = {
        labels: labels,
        datasets: [
          {
            label: 'Кол-во',
            data: data,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };

    return <Bar options={options} data={sdata} />
}
