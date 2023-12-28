import { useState, useEffect } from "react";

import { useGlobalState } from "@/app/components/context";

export default function ProfileTab({ tab, index }) {
  const { user } = useGlobalState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
    }
  }, [user]);

  if (tab !== index) {
    return;
  }

  return <h1>{firstName}</h1>;
}
