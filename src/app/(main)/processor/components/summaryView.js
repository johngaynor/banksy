"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";

import { SubmitSummary } from "./processorFunctions";
import { useProcessorState } from "../context";
import { useGlobalState } from "../../../context";

export default function SummaryView() {
  const { data, setSubmitSummaryLoading } = useProcessorState();
  const { addMsg } = useGlobalState();
  const [categories, setCategories] = useState([]);
  const [macros, setMacros] = useState([]);

  useEffect(() => {
    const sortedCategories = () => {
      const order = Object.keys(data.views[1].categories);
      const categories = {
        savings: data.savings,
        ...data.views[0].categories,
      };
      const sorted = [];

      for (const o of order) {
        const options = data.views[1].aggregates[o];

        for (const c in categories) {
          if (options.includes(c)) {
            sorted.push({ name: c, value: categories[c] });
          }
        }

        if (o === "savings") {
          sorted.push({ name: "savings", value: data.savings });
        }
      }

      setCategories(sorted);
    };

    sortedCategories();

    const macroArr = [];
    for (const m in data.views[1].categories) {
      if (m === "savings") {
        macroArr.push({ name: "savings", value: data.savings });
      } else {
        macroArr.push({ name: m, value: data.views[1].categories[m] });
      }
    }

    setMacros(macroArr);
  }, []);

  const defaultColors = [
    "#0450b4",
    "#046dc8",
    "#1184a7",
    "#15a2a2",
    "#6fb1a0",
    "#b4418e",
    "#d94a8c",
    "#ea515f",
    "#fe7434",
    "#fea802",
  ];

  const blueShades = ["#0450b4", "#045fbe", "#046dc8", "#0b79b8", "#1184a7"];

  const macroColors = ["#fea802", "#15a2a2", "#ea515f"];

  const prevSummary = {
    spending: 1800.0,
    income: 2000.0,
    savings: 200.0,
  };

  const handleSubmit = () => {
    SubmitSummary(data, addMsg, setSubmitSummaryLoading);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 4,
        backgroundColor: "#121212",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={0}>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <Typography
            variant="h3"
            sx={{ textAlign: "center", marginBottom: "10px" }}
          >
            Summary
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={() => handleSubmit()}
            component="label"
            variant="contained"
            color="success"
            startIcon={<StorageIcon />}
          >
            Submit to DB
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          padding: "20px 0",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Grid item xs={3}>
          <Card sx={{ backgroundColor: "#242424" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "white" }}>
                Income
              </Typography>
              <Box
                container
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ color: "white", marginTop: "5px" }}
                >
                  ${data.income?.toFixed(2)}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color:
                      data.income - prevSummary.income > 0
                        ? "#2E7D32"
                        : "#D32E2E",

                    margin: "0 0 4px 10px",
                  }}
                >
                  {data.income - prevSummary.income > 0 ? "+" : "-"}
                  {parseFloat((data.income - prevSummary.income).toFixed(2))}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card sx={{ backgroundColor: "#242424" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "white" }}>
                Spending
              </Typography>
              <Box
                container
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ color: "white", marginTop: "5px" }}
                >
                  ${data.spending?.toFixed(2)}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color:
                      data.spending - prevSummary.spending > 0
                        ? "#D32E2E"
                        : "#2E7D32",

                    margin: "0 0 4px 10px",
                  }}
                >
                  {data.spending - prevSummary.spending > 0 ? "+" : "-"}
                  {parseFloat(
                    (data.spending - prevSummary.spending).toFixed(2)
                  )}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card sx={{ backgroundColor: "#242424" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "white" }}>
                Net Gain
              </Typography>
              <Box
                container
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ color: "white", marginTop: "5px" }}
                >
                  ${data.savings?.toFixed(2)}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color:
                      data.savings - prevSummary.savings > 0
                        ? "#2E7D32"
                        : "#D32E2E",

                    margin: "0 0 4px 10px",
                  }}
                >
                  {data.savings - prevSummary.savings > 0 ? "+" : "-"}
                  {parseFloat((data.savings - prevSummary.savings).toFixed(2))}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Grid item style={{ backgroundColor: "#242424" }}>
          <Typography variant="h5" padding={2}>
            Wants/Needs/Savings
          </Typography>
          <PieChart width={600} height={400}>
            <Pie
              data={categories}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
            >
              {categories.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={blueShades[index % blueShades.length]}
                />
              ))}
            </Pie>
            <Pie
              data={macros}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={135}
              outerRadius={145}
              fill="#8884d8"
              label={({ name, value, percent }) =>
                `${name} - ${(percent * 100).toFixed(2)}%`
              }
            >
              {macros.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={macroColors[index % macroColors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </Grid>
        <Grid item sx={{ backgroundColor: "#242424" }}>
          <Typography variant="h5" padding={2}>
            All Categories
          </Typography>
          <PieChart width={600} height={400}>
            <Pie
              data={categories.filter((cat) => cat.value !== 0)}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={135}
              fill="#8884d8"
              label={({ name, value, percent }) => `${name} - $${value}`}
            >
              {categories.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={defaultColors[index % defaultColors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </Grid>
      </Grid>
    </Box>
  );
}

// const testData = {
//   income: 2787.03,
//   spending: 2097.54,
//   savings: 689.49,
//   views: [
//     {
//       spending: 2097.54,
//       view_id: 1,
//       view_name: "default",
//       aggregates: {},
//       categories: {
//         gas: 567.62,
//         grocery: 405.21,
//         leisure: 720.18,
//         miscellaneous: 4.99,
//         recFood: 216.9,
//         rent: 0,
//         school: 0,
//         travel: 182.64,
//       },
//     },
//     {
//       spending: 2097.54,
//       view_id: 2,
//       view_name: "macros",
//       aggregates: {
//         needs: ["gas", "grocery", "rent", "school", "travel"],
//         wants: ["leisure", "recFood", "miscellaneous"],
//         savings: [],
//       },
//       categories: {
//         needs: 1155.47,
//         wants: 942.07,
//         savings: 0,
//       },
//     },
//   ],
// };
