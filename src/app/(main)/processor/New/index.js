"use client";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import Home from "../components/home";
import Categories from "../components/categories";
import { initUpload } from "../components/processorFunctions";
import { useGlobalState } from "../../../context";
import { useProcessorState } from "../context";

export default function Processor() {
  const { addMsg } = useGlobalState();
  const { file } = useProcessorState();
  const [data, setData] = useState(null);
  const [formStep, setFormStep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const transactions = await initUpload(file);
          setData(transactions);
          // console.log("data set", transactions);
          addMsg("success", "data set!");
          setLoading(false);
        } catch (error) {
          // console.log("error:", error);
          addMsg("error", error);
        }
      };

      fetchData();
    }
  }, [file]);

  if (loading) {
    return <CircularProgress />;
  }

  if (formStep === 0) {
    return <Home setFormStep={setFormStep} />;
  } else if (formStep === 1) {
    return <Categories data={data} loading={loading} setLoading={setLoading} />;
  }
}
