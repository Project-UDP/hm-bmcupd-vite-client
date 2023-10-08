import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { api } from "../../../api/api";

ChartJS.register(ArcElement, Tooltip, Legend);

export const NationalityDoughnut = () => {
  const [kazakh, setKazakh] = useState(0);
  const [russian, setRussian] = useState(0);
  const [uzbek, setUzbek] = useState(0);
  const [others, setOthers] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.statistics.getNationalityCounts();
        const data = response.data
        for (const item of data) {
          if (item.nation === "Казах") {
            setKazakh(item.count);
          } else if (item.nation === "Русский") {
            setRussian(item.count);
          } else if (item.nation === "Узбек") {
            setUzbek(item.count);
          } else if (item.nation === "Другое") {
            setOthers(item.count);
          }
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const data = {
    labels: ["Казах", "Русский", "Узбек", "Другое"],
    datasets: [
      {
        label: "Количество",
        data: [kazakh, russian, uzbek, others],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(2, 132, 205, 0.6)",
          "rgba(200, 120, 100, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(2, 132, 205, 0.6)",
          "rgba(200, 120, 100, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut data={data} />;
};
