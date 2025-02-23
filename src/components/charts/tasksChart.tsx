import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { TaskStats } from "../../screens/StatisticsScreen";
import { Employee } from "../../../types/types";

// Helper function to sanitize data
const sanitizeChartData = (data: number[]): number[] => {
  return data.map(value => {
    // Handle invalid values
    if (value === Infinity || value === -Infinity || isNaN(value)) {
      return 0;
    }
    return Number(value) || 0;
  });
};

// Updated chart components with data validation
export const TaskProgressChart = ({ taskProgress, taskLabels }: { taskProgress: number[], taskLabels: string[] }) => (
  <LineChart
    data={{
      labels: taskLabels,
      datasets: [
        {
          data: sanitizeChartData(taskProgress),
        },
      ],
    }}
    width={Dimensions.get("window").width - 40}
    height={220}
    chartConfig={{
      backgroundColor: "#fff",
      backgroundGradientFrom: "#fff",
      backgroundGradientTo: "#fff",
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      propsForLabels: {
        fontSize: 12,
      },
      formatYLabel: (value) => Math.round(Number(value)).toString(),
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16,
    }}
  />
);

export const EmployeeWorkloadChart = ({ employees }: { employees: Employee[] }) => {
  // Handle single employee case
  const chartData = {
    labels: employees.length === 1 
      ? [employees[0].name.split(" ").map(word => word[0]).join(""), ""] // Add empty label for spacing
      : employees.map(emp => emp.name.split(" ").map(word => word[0]).join("")),
    datasets: [{
      data: employees.length === 1
        ? [...sanitizeChartData(employees.map(emp => emp.tasks.length)), 0] // Add zero value for spacing
        : sanitizeChartData(employees.map(emp => emp.tasks.length))
    }]
  };

  return (
    <BarChart
      data={chartData}
      width={Dimensions.get("window").width - 40}
      height={220}
      yAxisLabel=""
      yAxisSuffix=""
      showValuesOnTopOfBars={true}
      chartConfig={{
        backgroundColor: "#fff",
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        barPercentage: employees.length === 1 ? 0.4 : 0.8, // Make bar thinner for single employee
        style: {
          borderRadius: 16,
        },
        propsForLabels: {
          fontSize: 12,
        },
      }}
      style={{
        marginVertical: 8,
        borderRadius: 16,
        paddingRight: 0,
      }}
      fromZero={true}
    />
  );
};

export const TaskDistributionChart = ({ stats }: { stats: TaskStats }) => (
  <PieChart
    data={[
      {
        name: "Completadas",
        population: Math.max(0, stats.completed || 0),
        color: "#4CAF50",
        legendFontColor: "#7F7F7F",
      },
      {
        name: "En Progreso",
        population: Math.max(0, stats.inProgress || 0),
        color: "#2196F3",
        legendFontColor: "#7F7F7F",
      },
      {
        name: "Atrasadas",
        population: Math.max(0, stats.delayed || 0),
        color: "#FF5252",
        legendFontColor: "#7F7F7F",
      },
    ]}
    width={Dimensions.get("window").width - 40}
    height={220}
    chartConfig={{
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    }}
    accessor="population"
    backgroundColor="transparent"
    paddingLeft="15"
    style={{
      marginVertical: 8,
      borderRadius: 16,
    }}
  />
);