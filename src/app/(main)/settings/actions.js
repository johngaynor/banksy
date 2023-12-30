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

export async function deleteKeyword(
  userId,
  categoryId,
  keyword,
  setDeleteKeywordLoading,
  addMsg
) {
  try {
    setDeleteKeywordLoading(true);
    const data = { userId, categoryId, keyword, action: "keyword" };
    const response = await axios.delete(`/api/settings`, { data });

    if (response.status === 200) {
      if (response.data.error) {
        addMsg("error", `error deleting keyword: ${response.data.error}`);
      } else {
        addMsg("success", "Successfully deleted keyword.");
      }
    } else {
      addMsg("error", `Error: error`);
    }
  } catch (error) {
    addMsg("error", `error deleting keyword: ${error}`);
  }
  setDeleteKeywordLoading(false);
}
