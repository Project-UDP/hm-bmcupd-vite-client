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
import { objectUtils } from "../../../utils/objectUtils";

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
      text: "Регионы",
    },
  },
};

const labels = [
  "Астана",
  "Алматы",
  "Шымкент",
  "Обл. Абай",
  "Акмолинская обл.",
  "Актюбинская обл.",
  "Алматинская обл.",
  "Атырауская обл.",
  "Жамбылская обл.",
  "Обл. Жетісу",
  "ЗКО",
  "Карагандинская обл.",
  "Костанайская обл.",
  "Кызылординская обл.",
  "Мангистауская обл.",
  "Павлодарская обл.",
  "СКО",
  "Туркестанская обл.",
  "Обл. Ұлытау",
];

export const RegionsBar = () => {
  const [barData, setBarData] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.statistics.getRegionCounts();
        const data = response.data
        for (const item of data) {
          if (item.region === "Астана") {
            barData[0] = item.count;
          } else if (item.region === "Алматы") {
            barData[1] = item.count;
          } else if (item.region === "Шымкент") {
            barData[2] = item.count;
          } else if (item.region === "Область Абай") {
            barData[3] = item.count;
          } else if (item.region === "Акмолинская область") {
            barData[4] = item.count;
          } else if (item.region === "Актюбинская область") {
            barData[5] = item.count;
          } else if (item.region === "Алматинская область") {
            barData[6] = item.count;
          } else if (item.region === "Атырауская область") {
            barData[7] = item.count;
          } else if (item.region === "Жамбылская область") {
            barData[8] = item.count;
          } else if (item.region === "Область Жетісу") {
            barData[9] = item.count;
          } else if (item.region === "Западно-Казахстанская область") {
            barData[10] = item.count;
          } else if (item.region === "Карагандинская область") {
            barData[11] = item.count;
          } else if (item.region === "Костанайская область") {
            barData[12] = item.count;
          } else if (item.region === "Кызылординская область") {
            barData[13] = item.count;
          } else if (item.region === "Мангистауская область") {
            barData[14] = item.count;
          } else if (item.region === "Павлодарская область") {
            barData[15] = item.count;
          } else if (item.region === "Северо-Казахстанская область") {
            barData[16] = item.count;
          } else if (item.region === "Туркестанская область") {
            barData[17] = item.count;
          } else if (item.region === "Область Ұлытау") {
            barData[18] = item.count;
          }
        }
        setBarData([...barData]);
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
