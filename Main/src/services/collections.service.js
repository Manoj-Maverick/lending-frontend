import api from "api/client";
import ENDPOINTS from "api/endpoints";

export async function getCollectionsByDateRange(params = {}) {
  const { data } = await api.get(ENDPOINTS.COLLECTIONS.list, { params });
  return data;
}
