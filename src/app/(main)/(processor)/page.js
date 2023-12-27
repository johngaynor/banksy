"use client";
import { useState } from "react";
import { Box } from "@mui/material";

import HomeView from "./views/homeView";
import CategoryView from "./views/categoryView";
import TableView from "./views/tableView";
import SummaryView from "./views/summaryView";
import BankView from "./views/bankView";
import Spinner from "@/app/components/spinner";

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
      return <BankView setFormStep={setFormStep} />;
    } else if (formStep === 2) {
      return <CategoryView setFormStep={setFormStep} />;
    } else if (formStep === 3) {
      return <TableView setFormStep={setFormStep} />;
    } else if (formStep === 4) {
      return <SummaryView setFormStep={setFormStep} />;
    }
  };

  return (
    <ProcessorContextProvider>
      <Box
        sx={{
          padding: 4,
          backgroundColor: "#121212",
          minHeight: "100vh",
        }}
      >
        {banksLoading ||
        categoriesLoading ||
        viewsLoading ||
        submitSummaryLoading ? (
          <Spinner />
        ) : null}
        {activePage()}
      </Box>
    </ProcessorContextProvider>
  );
}
