import axios from "axios";
export async function fetchBranchesList({
  page,
  limit,
  search,
  status,
  sortBy,
}) {
  try {
    const { data } = await axios.get(
      "http://localhost:3001/api/branch-management/list",
      {
        params: {
          page,
          limit,
          search: search || undefined,
          status,
          sortBy,
        },
      },
    );
    console.log("paarms", { page, limit, search, status, sortBy });
    console.log("data", data);
    return data;
  } catch (error) {
    console.warn("error fetching branches list", error.message);
  }
}
