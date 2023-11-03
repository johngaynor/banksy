"use client";

import React, { useEffect } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Label,
} from "recharts";

import { generateSummary } from "./processorFunctions";
import { useProcessorState } from "../context";

export default function SummaryView() {
  const { setData, data, userViews } = useProcessorState();

  useEffect(() => {
    const summary = generateSummary(userViews, data);

    console.log(summary);
    setData(summary);
  }, []);

  const testData = {
    income: 2787.03,
    spending: 2097.54,
    savings: 689.49,
    views: [
      {
        spending: 2097.54,
        view_id: 1,
        view_name: "default",
        categories: {
          gas: 567.62,
          grocery: 405.21,
          leisure: 720.18,
          miscellaneous: 4.99,
          recFood: 216.9,
          rent: 0,
          school: 0,
          travel: 182.64,
        },
      },
      {
        spending: 2097.54,
        view_id: 2,
        view_name: "macros",
        categories: {
          needs: 1155.47,
          wants: 942.07,
        },
      },
    ],
  };

  const categoryArray = [
    { name: "1", value: 70 },
    { name: "2", value: 140 },
    { name: "3", value: 30 },
    { name: "4", value: 20 },
  ];

  const macroArray = [
    { name: "needs", value: 210 },
    { name: "wants", value: 30 },
    { name: "savings", value: 20 },
  ];

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={categoryArray}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={120}
        fill="#8884d8"
      />
      <Pie
        data={macroArray}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={135}
        outerRadius={145}
        fill="#8884d8"
        label
      />
    </PieChart>
    // <PieChart width={600} height={600}>
    //   <Pie
    //     data={categoryArray}
    //     cx="50%"
    //     cy="50%"
    //     labelLine={false}
    //     label={renderCustomizedLabel}
    //     outerRadius={150}
    //     fill="#8884d8"
    //     dataKey="value"
    //   >
    //     {categoryArray.map((entry, index) => (
    //       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    //     ))}
    //   </Pie>
    // </PieChart>
  );
}

// useEffect(() => {
//   const summary = generateSummary(userViews, data);

//   console.log(summary);
//   setData(summary);
// }, []);

// <PieChart width={800} height={800}>
//   <Pie
//     data={categoryArray}
//     dataKey="value"
//     cx="50%"
//     cy="50%"
//     outerRadius={140}
//     fill="#8884d8"
//     label={false} // Disable the default labels
//   >
//     {categoryArray.map((entry, index) => (
//       <Label
//         key={index}
//         value={entry.value}
//         position="insideTop" // or "inside"
//         content={({ value }) => `${value}`} // Display the value
//       />
//     ))}
//   </Pie>
// </PieChart>

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// const RADIAN = Math.PI / 180;
// const renderCustomizedLabel = ({
//   cx,
//   cy,
//   midAngle,
//   innerRadius,
//   outerRadius,
//   percent,
//   index,
// }) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor={x > cx ? "start" : "end"}
//       dominantBaseline="central"
//     >
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

// const categoryArray = Object.keys(testData.views[0].categories).map(
//   (key) => ({
//     name: key,
//     value: testData.views[0].categories[key],
//   })
// );
