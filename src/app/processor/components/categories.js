import { useEffect } from "react";

import { assignCategories } from "./processorFunctions";
import { categoryKeys } from "@/app/components/userData";

export default function Categories({ data, setData }) {
  useEffect(() => {
    if (data) {
      const processData = async () => {
        try {
          const categories = await assignCategories(data, categoryKeys);
          console.log(categories);
        } catch (error) {
          console.log("error:", error);
        }
      };

      processData();
    }
  }, []);

  return <h1>next step</h1>;
}
