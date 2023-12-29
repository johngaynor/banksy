import axios from "axios";

export async function updateProfile(
  userId,
  firstName,
  lastName,
  oldPassword,
  newPassword,
  setUpdateProfileLoading,
  addMsg
) {
  try {
    setUpdateProfileLoading(true);
    const payload = { userId, firstName, lastName, oldPassword, newPassword };
    const response = await axios.post("/api/settings?action=profile", payload);

    if (response.status === 200) {
      addMsg("success", "Successfully updated profile.");
    } else {
      addMsg(
        "error",
        "Something failed, please try again later. (update profile)"
      );
    }
  } catch (error) {
    addMsg("error", `error updating profile: ${error}`);
  }

  setUpdateProfileLoading(false);
}
