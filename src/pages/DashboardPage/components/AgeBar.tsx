import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { api } from "../../../api/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Возраст",
    },
  },
};

const labels = [
  "до 1 года младенчество",
  "1-3 ранее детство",
  "4-6 дошкольное детство",
  "7-11 младший школьный",
  "11-15 подростковый",
  "14-18 юношеский",
  "18-44 молодой",
  "45-59 средний",
  "60-74 пожилой",
  "75-90 старческий",
  "90 и выше долгожители",
];

export const AgeBar = () => {
  const [barData, setBarData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.statistics.getAgeCategoryCounts();
        const data = response.data
        for (const item of data) {
          if (item.ageCategory === "infant") {
            barData[0] = item.count;
          } else if (item.ageCategory === "earlyChildhood") {
            barData[1] = item.count;
          } else if (item.ageCategory === "preschoolChildhood") {
            barData[2] = item.count;
          } else if (item.ageCategory === "juniorSchool") {
            barData[3] = item.count;
          } else if (item.ageCategory === "teen") {
            barData[4] = item.count;
          } else if (item.ageCategory === "adolescence") {
            barData[5] = item.count;
          } else if (item.ageCategory === "young") {
            barData[6] = item.count;
          } else if (item.ageCategory === "mid") {
            barData[7] = item.count;
          } else if (item.ageCategory === "elderly") {
            barData[8] = item.count;
          } else if (item.ageCategory === "senile") {
            barData[9] = item.count;
          } else if (item.ageCategory === "long-liver") {
            barData[10] = item.count;
          }
        }
        setBarData(JSON.parse(JSON.stringify(barData)));
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Количество",
        data: barData,
        backgroundColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};
