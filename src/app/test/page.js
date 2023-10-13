"use client";
import React, { useState, useEffect } from "react";
import { apiCall } from "../components/api/api";

export default function Test() {
  const [num, setNum] = useState(0);

  const handlePost = async () => {
    try {
      const response = await apiCall("post", "api/testpost/", {
        data: 2,
        otherData: "test",
      });

      console.log("Post request successful:", response);
      setNum(response.data);
    } catch (error) {
      console.error("Post request failed:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button onClick={handlePost}>Test post route</button>
      <h1>{num}</h1>
    </div>
  );
}
