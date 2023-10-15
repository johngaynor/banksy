import { useEffect } from "react";

import { assignCategories } from "./processorFunctions";
import { categoryKeys } from "@/app/components/userData";

export default function Categories({ data, setLoading }) {
  useEffect(() => {
    if (data) {
      const processData = async () => {
        try {
          setLoading(true);
          const categories = await assignCategories(data, categoryKeys);
          console.log(categories);
          setLoading(false);
        } catch (error) {
          console.log("error:", error);
        }
      };

      processData();
    }
  }, []);

  return <h1>next step</h1>;
}
