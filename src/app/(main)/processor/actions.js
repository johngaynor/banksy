import axios from "axios";

export async function getBanks(setUserBanks, setBanksLoading, addMsg, userId) {
  setBanksLoading(true);
  try {
    const response = await axios.get(
      `/api/processor?action=getbanks&userId=${userId}`
    );
    if (response.status === 200) {
      setUserBanks(response.data);
      addMsg("success", "Got user banks.");
    } else {
      addMsg("error", "Something failed, please try again later. (banks)");
    }
  } catch (error) {
    addMsg("error", `error getting banks: ${error}`);
  }
  setBanksLoading(false);
}

export async function getCategories(
  setUserCategories,
  setCategoriesLoading,
  addMsg,
  userId
) {
  setCategoriesLoading(true);
  try {
    const response = await axios.get(
      `/api/processor?action=getcategories&userId=${userId}`
    );
    if (response.status === 200) {
      setUserCategories(response.data);
      addMsg("success", "Got user categories.");
    } else {
      addMsg("error", "Something failed, please try again later. (categories)");
    }
  } catch (error) {
    addMsg("error", `error getting categories: ${error}`);
  }
  setCategoriesLoading(false);
}

export async function getViews(setUserViews, setViewsLoading, addMsg, userId) {
  setViewsLoading(true);
  try {
    const response = await axios.get(
      `/api/processor?action=getviews&userId=${userId}`
    );
    if (response.status === 200) {
      setUserViews(response.data);
      addMsg("success", "Got summary views.");
    } else {
      addMsg("error", "Something failed, please try again later. (views)");
    }
  } catch (error) {
    addMsg("error", `error getting views: ${error}`);
  }
  setViewsLoading(false);
}

export async function submitSummary(
  data,
  date,
  addMsg,
  setSubmitSummaryLoading,
  router
) {
  try {
    setSubmitSummaryLoading(true);
    const { income, spending, savings } = data;
    const response = await axios.post(
      `/api/processor?action=summary&date=${date}&income=${income}&spending=${spending}&savings=${savings}`
    );
    if (response.status === 200) {
      if (response.data.error) {
        addMsg("error", `Error: ${response.data.error}`);
      } else {
        addMsg("success", "Summary submitted to database.");
        router.push("/history");
      }
    }
  } catch (error) {
    addMsg("error", `error submitting summary: ${error}`);
  }
  setSubmitSummaryLoading(false);
}
