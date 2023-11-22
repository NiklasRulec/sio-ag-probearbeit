import { Bar } from "react-chartjs-2";

const TimeChart = ({ workDays }) => {
  const chartData = {
    labels: workDays.map((workDay) => workDay.date),
    datasets: [
      {
        label: "Arbeitszeit pro Tag",
        data: workDays.map((workDay) => calculateDailyWorkTime(workDay)),
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "category", // Stellen Sie sicher, dass die X-Achse eine Kategorieachse ist
      },
    },
  };
  return <Bar data={chartData} options={chartOptions} />;
};

export default TimeChart;
