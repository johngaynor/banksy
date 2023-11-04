"use client";
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Label,
} from "recharts";
import { Box, Grid, Typography, Button, LinearProgress } from "@mui/material";

import { generateSummary } from "./processorFunctions";
import { useProcessorState } from "../context";

export default function SummaryView() {
  const { setData, data, userViews } = useProcessorState();
  const [categories, setCategories] = useState([]);
  const [macros, setMacros] = useState([]);
  console.log(macros, categories);

  useEffect(() => {
    const summary = generateSummary(userViews, data);

    // console.log(summary);
    // setData(summary); // setting data

    const sortedCategories = () => {
      const order = Object.keys(summary.views[1].categories);
      const categories = {
        savings: summary.savings,
        ...summary.views[0].categories,
      };
      const sorted = [];

      for (const o of order) {
        const options = summary.views[1].aggregates[o];

        for (const c in categories) {
          if (options.includes(c)) {
            sorted.push({ name: c, value: categories[c] });
          }
        }

        if (o === "savings") {
          sorted.push({ name: "savings", value: summary.savings });
        }
      }

      setCategories(sorted);
    };

    sortedCategories();

    const macroArr = [];
    for (const m in summary.views[1].categories) {
      if (m === "savings") {
        macroArr.push({ name: "savings", value: summary.savings });
      } else {
        macroArr.push({ name: m, value: summary.views[1].categories[m] });
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

  return (
    <Grid
      container
      sx={{
        // backgroundColor: "red",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <PieChart
        width={550}
        height={400}
        // style={{ backgroundColor: "yellow" }}
      >
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
            `${name} - ${(percent * 100).toFixed(2)}`
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
      <PieChart
        width={550}
        height={400}
        style={
          {
            // backgroundColor: "yellow",
          }
        }
      >
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
