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
      addMsg("error", "Something failed, please try again later. (history)");
    }
  } catch (error) {
    addMsg(`error', 'error getting history: ${error}`);
  }
  setHistoryLoading(false);
}
