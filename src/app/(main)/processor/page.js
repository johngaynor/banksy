"use client";

import { ProcessorContextProvider } from "./context";
import Processor from "./New";

export default function Home() {
  return (
    <ProcessorContextProvider>
      <Processor />
    </ProcessorContextProvider>
  );
}
