"use client";
import { useEffect, useState } from "react";

import Home from "./components/home";
import Categories from "./components/categories";
import { initUpload } from "./components/processorFunctions";
import CircularProgress from "@mui/material/CircularProgress";

export default function Processor() {
  const [file, setFile] = useState(null);
  const [openMsg, setOpenMsg] = useState(false);
  const [msgContent, setMsgContent] = useState({});
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
          console.log("data set", transactions);
          setLoading(false);
        } catch (error) {
          console.log("error:", error);
        }
      };

      fetchData();
    }
  }, [file]);

  if (loading) {
    return <CircularProgress />;
  }

  if (formStep === 0) {
    return (
      <Home
        data={data}
        setData={setData}
        setOpenMsg={setOpenMsg}
        openMsg={openMsg}
        file={file}
        setFile={setFile}
        msgContent={msgContent}
        setMsgContent={setMsgContent}
        setFormStep={setFormStep}
        loading={loading}
        setLoading={setLoading}
      />
    );
  } else if (formStep === 1) {
    return <Categories data={data} loading={loading} setLoading={setLoading} />;
  }
}
