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

export async function editUseDefaultKeywords(
  userId,
  setEditUseDefaultKeywordsLoading,
  addMsg
) {
  try {
    setEditUseDefaultKeywordsLoading(true);
    const data = { userId, action: "usedefaultkeywords" };
    const response = await axios.patch("/api/settings", { data });

    if (response.status === 200) {
      if (response.data.error) {
        addMsg(
          "error",
          `error editing user preference: ${response.data.error}`
        );
      } else {
        addMsg("success", "Successfully edited user preference.");
      }
    } else {
      addMsg("error", `Error: error`);
    }
  } catch (error) {
    addMsg("error", `error editing preference: ${error}`);
  }
  setEditUseDefaultKeywordsLoading(false);
}
