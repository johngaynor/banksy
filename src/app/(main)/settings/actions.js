import axios from "axios";

export async function updateProfile(
  userId,
  firstName,
  lastName,
  oldPassword,
  newPassword,
  setUpdateProfileLoading,
  addMsg,
  setUser
) {
  try {
    setUpdateProfileLoading(true);
    const payload = { userId, firstName, lastName, oldPassword, newPassword };
    const response = await axios.post("/api/settings?action=profile", payload);

    if (response.status === 200) {
      if (response.data.error) {
        addMsg("error", `error updating profile: ${response.data.error}`);
      } else {
        addMsg("success", "Successfully updated profile.");
        setUser(response.data.user);
      }
    } else {
      addMsg("error", `Error: error`);
    }
  } catch (error) {
    addMsg("error", `error updating profile: ${error}`);
  }

  setUpdateProfileLoading(false);
}
