import React, { useEffect } from "react";

import { generateSummary } from "./processorFunctions";
import { useProcessorState } from "../context";

export default function SummaryView() {
  const { setData, data, userViews } = useProcessorState();

  useEffect(() => {
    const summary = generateSummary(userViews, data);

    console.log(summary);
    setData(summary);
  }, []);

  return <h1>hello</h1>;
}
