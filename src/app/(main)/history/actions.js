import axios from "axios";

export async function getHistory(
  setHistory,
  setHistoryLoading,
  addMsg,
  userId
) {
  setHistoryLoading(true);
  try {
    const response = await axios.get(
      `/api/history?action=gethistory&userId=${userId}`
    );

    if (response.status === 200) {
      setHistory(response.data);
      addMsg("success", "Got user history.");
    } else {
      addMsg(
        "error",
        "Something failed, please try again later. (get history)"
      );
    }
  } catch (error) {
    addMsg(`error', 'error getting history: ${error}`);
  }
  setHistoryLoading(false);
}

export async function deleteHistory(
  date,
  addMsg,
  setDeleteHistoryLoading,
  userId
) {
  setDeleteHistoryLoading(true);
  try {
    const response = await axios.delete(
      `/api/history?action=deletehistory&userId=${userId}&date=${date}`
    );

    if (response.status === 200) {
      addMsg("success", "Successfully deleted summary.");
    } else {
      addMsg(
        "error",
        "Something failed, please try again later. (delete history)"
      );
    }
  } catch (error) {
    addMsg(`error', 'error deleting history: ${error}`);
  }
  setDeleteHistoryLoading(false);
}
