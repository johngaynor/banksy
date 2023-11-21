"use client";
import { useState } from "react";
import { CircularProgress, Box } from "@mui/material";

import HomeView from "./views/homeView";
import CategoryView from "./views/categoryView";
import TableView from "./views/tableView";
import SummaryView from "./views/summaryView";

import { ProcessorContextProvider } from "./context";
import { useGlobalState } from "@/app/components/context";

export default function Processor() {
  const [formStep, setFormStep] = useState(0);
  const {
    banksLoading,
    categoriesLoading,
    viewsLoading,
    submitSummaryLoading,
  } = useGlobalState();

  const activePage = () => {
    if (formStep === 0) {
      return <HomeView setFormStep={setFormStep} />;
    } else if (formStep === 1) {
      return <CategoryView setFormStep={setFormStep} />;
    } else if (formStep === 2) {
      return <TableView setFormStep={setFormStep} />;
    } else if (formStep === 3) {
      return <SummaryView setFormStep={setFormStep} />;
    }
  };

  if (
    banksLoading ||
    categoriesLoading ||
    viewsLoading ||
    submitSummaryLoading
  ) {
    return <CircularProgress />;
  }

  return (
    <ProcessorContextProvider>
      <Box
        sx={{
          padding: 4,
          backgroundColor: "#121212",
          minHeight: "100vh",
        }}
      >
        {activePage()}
      </Box>
    </ProcessorContextProvider>
  );
}
