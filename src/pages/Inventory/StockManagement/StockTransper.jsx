"use client";

import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { alpha } from "@mui/material/styles";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock data for the chart
const mockChartData = {
  daily: {
    labels: ["May 1", "May 2", "May 3", "May 4", "May 5", "May 6", "May 7"],
    stockIn: [5, 3, 0, 7, 2, 10, 4],
    stockOut: [2, 5, 3, 1, 8, 4, 2],
    balance: [3, -2, -3, 6, -6, 6, 2],
  },
  weekly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    stockIn: [15, 22, 18, 30],
    stockOut: [12, 18, 15, 25],
    balance: [3, 4, 3, 5],
  },
  monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    stockIn: [45, 52, 38, 65, 75, 60],
    stockOut: [40, 45, 35, 50, 65, 55],
    balance: [5, 7, 3, 15, 10, 5],
  },
};

export function StockChart() {
  const [timeRange, setTimeRange] = useState("daily");
  const [chartType, setChartType] = useState("line");
  const [dataView, setDataView] = useState("all");

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleChartTypeChange = (event, newValue) => {
    if (newValue !== null) {
      setChartType(newValue);
    }
  };

  const handleDataViewChange = (event, newValue) => {
    if (newValue !== null) {
      setDataView(newValue);
    }
  };

  // Prepare chart data based on selected options
  const chartData = {
    labels: mockChartData[timeRange].labels,
    datasets: [],
  };

  // Add datasets based on the selected data view
  if (dataView === "all" || dataView === "in") {
    chartData.datasets.push({
      label: "Stock In",
      data: mockChartData[timeRange].stockIn,
      borderColor: "#4caf50",
      backgroundColor: alpha("#4caf50", 0.5),
      borderWidth: 2,
      tension: 0.3,
      fill: chartType === "area",
    });
  }

  if (dataView === "all" || dataView === "out") {
    chartData.datasets.push({
      label: "Stock Out",
      data: mockChartData[timeRange].stockOut,
      borderColor: "#f44336",
      backgroundColor: alpha("#f44336", 0.5),
      borderWidth: 2,
      tension: 0.3,
      fill: chartType === "area",
    });
  }

  if (dataView === "all" || dataView === "balance") {
    chartData.datasets.push({
      label: "Net Balance",
      data: mockChartData[timeRange].balance,
      borderColor: "#1976d2",
      backgroundColor: alpha("#1976d2", 0.5),
      borderWidth: 2,
      tension: 0.3,
      fill: chartType === "area",
    });
  }

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#000",
        bodyColor: "#666",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        cornerRadius: 8,
        titleFont: {
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>

        <div className="md:flex gap-2 ">
          
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={handleChartTypeChange}
              size="small"
              aria-label="chart type"
            >
              <ToggleButton value="line" aria-label="line chart">
                Line
              </ToggleButton>
              <ToggleButton value="bar" aria-label="bar chart">
                Bar
              </ToggleButton>
              <ToggleButton value="area" aria-label="area chart">
                Area
              </ToggleButton>
            </ToggleButtonGroup>
<div className="mt-2 md:mt-0">
            <ToggleButtonGroup
              value={dataView}
              exclusive
              onChange={handleDataViewChange}
              size="small"
              aria-label="data view"
            >
              <ToggleButton value="all" aria-label="all data">
                All
              </ToggleButton>
              <ToggleButton value="in" aria-label="stock in">
                In
              </ToggleButton>
              <ToggleButton value="out" aria-label="stock out">
                Out
              </ToggleButton>
              <ToggleButton value="balance" aria-label="balance">
                Balance
              </ToggleButton>
            </ToggleButtonGroup>
         </div>
        </div>
      </Box>

      <Box sx={{ height: 350 }}>
        {chartType === "bar" ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </Box>
    </Box>
  );
}
